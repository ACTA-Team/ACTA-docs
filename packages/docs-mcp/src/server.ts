#!/usr/bin/env node

import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import docsData from "./generated/docs-data.json" with { type: "json" };
import type { DocPage, DocsByLocale, Locale, SearchResult } from "./types.js";

const docsByLocale = docsData as DocsByLocale;

const DOCS_BASE_URL = "https://docs.acta.build";
const DEFAULT_LOCALE: Locale = "en";
const LOCALES = ["en", "es"] as const;

const localeSchema = z.enum(LOCALES).default(DEFAULT_LOCALE);

const server = new McpServer({
  name: "acta-docs",
  version: "0.1.0",
});

function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

function getDocs(locale: Locale): Record<string, DocPage> {
  return docsByLocale[locale];
}

function getDoc(locale: Locale, slug: string): DocPage | undefined {
  return getDocs(locale)[slug];
}

function getDocUrl(locale: Locale, slug: string): string {
  return `${DOCS_BASE_URL}/${locale}/${slug}`;
}

function getDocUri(locale: Locale, slug: string): string {
  return `acta-docs://${locale}/${slug}`;
}

function toMarkdownPage(locale: Locale, page: DocPage): string {
  return [
    `# ${page.title}`,
    "",
    `Section: ${page.section}`,
    `Slug: ${page.slug}`,
    `Locale: ${locale}`,
    `URL: ${getDocUrl(locale, page.slug)}`,
    "",
    page.content.trim(),
  ].join("\n");
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function makeExcerpt(content: string, query: string): string {
  const normalizedContent = normalize(content);
  const normalizedQuery = normalize(query);
  const index = normalizedContent.indexOf(normalizedQuery);
  const start = index >= 0 ? Math.max(0, index - 120) : 0;
  const excerpt = content
    .replace(/\s+/g, " ")
    .trim()
    .slice(start, start + 280);
  return excerpt.length === 280 ? `${excerpt}...` : excerpt;
}

function scorePage(page: DocPage, query: string): number {
  const normalizedQuery = normalize(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return 0;
  }

  const title = normalize(page.title);
  const section = normalize(page.section);
  const toc = normalize(page.tocItems.join(" "));
  const content = normalize(page.content);

  return terms.reduce((score, term) => {
    let nextScore = score;
    if (title.includes(term)) nextScore += 8;
    if (section.includes(term)) nextScore += 4;
    if (toc.includes(term)) nextScore += 3;
    if (content.includes(term)) {
      const matches = content.split(term).length - 1;
      nextScore += Math.min(matches, 8);
    }
    return nextScore;
  }, 0);
}

function searchDocs(
  locale: Locale,
  query: string,
  limit: number
): SearchResult[] {
  return Object.values(getDocs(locale))
    .map(page => ({
      locale,
      slug: page.slug,
      title: page.title,
      section: page.section,
      score: scorePage(page, query),
      excerpt: makeExcerpt(page.content, query),
      uri: getDocUri(locale, page.slug),
      url: getDocUrl(locale, page.slug),
    }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

server.registerResource(
  "acta-doc",
  new ResourceTemplate("acta-docs://{locale}/{slug}", {
    list: async () => ({
      resources: LOCALES.flatMap(locale =>
        Object.values(getDocs(locale)).map(page => ({
          uri: getDocUri(locale, page.slug),
          name: `${locale}/${page.slug}`,
          title: page.title,
          description: `${page.section} - ${getDocUrl(locale, page.slug)}`,
          mimeType: "text/markdown",
        }))
      ),
    }),
    complete: {
      locale: value =>
        LOCALES.filter(locale => locale.startsWith(value)) as string[],
      slug: (value, context) => {
        const locale = context?.arguments?.locale;
        const selectedLocale =
          locale && isLocale(locale) ? locale : DEFAULT_LOCALE;
        return Object.keys(getDocs(selectedLocale)).filter(slug =>
          slug.startsWith(value)
        );
      },
    },
  }),
  {
    title: "ACTA documentation page",
    description: "Read a page from the ACTA documentation.",
    mimeType: "text/markdown",
  },
  async (uri, variables) => {
    const locale = String(variables.locale);
    const slug = String(variables.slug);

    if (!isLocale(locale)) {
      throw new Error(`Unsupported locale: ${locale}`);
    }

    const page = getDoc(locale, slug);
    if (!page) {
      throw new Error(`ACTA doc page not found: ${locale}/${slug}`);
    }

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: toMarkdownPage(locale, page),
        },
      ],
    };
  }
);

server.registerTool(
  "list_acta_docs",
  {
    title: "List ACTA docs",
    description: "List available ACTA documentation pages by locale.",
    inputSchema: {
      locale: localeSchema,
    },
  },
  async ({ locale }) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          Object.values(getDocs(locale)).map(page => ({
            slug: page.slug,
            title: page.title,
            section: page.section,
            uri: getDocUri(locale, page.slug),
            url: getDocUrl(locale, page.slug),
          })),
          null,
          2
        ),
      },
    ],
  })
);

server.registerTool(
  "read_acta_doc",
  {
    title: "Read ACTA doc",
    description: "Read one ACTA documentation page by slug.",
    inputSchema: {
      slug: z.string().min(1).describe("Page slug, for example sdk-overview."),
      locale: localeSchema,
    },
  },
  async ({ slug, locale }) => {
    const page = getDoc(locale, slug);
    if (!page) {
      return {
        isError: true,
        content: [
          { type: "text", text: `ACTA doc page not found: ${locale}/${slug}` },
        ],
      };
    }

    return {
      content: [{ type: "text", text: toMarkdownPage(locale, page) }],
    };
  }
);

server.registerTool(
  "search_acta_docs",
  {
    title: "Search ACTA docs",
    description: "Search ACTA documentation pages and return the best matches.",
    inputSchema: {
      query: z.string().min(2).describe("Search query."),
      locale: localeSchema,
      limit: z.number().int().min(1).max(10).default(5),
    },
  },
  async ({ query, locale, limit }) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(searchDocs(locale, query, limit), null, 2),
      },
    ],
  })
);

server.registerPrompt(
  "answer_acta_question",
  {
    title: "Answer an ACTA question",
    description:
      "Build a grounded prompt for answering questions using ACTA docs.",
    argsSchema: {
      question: z.string().min(1),
      locale: localeSchema,
    },
  },
  async ({ question, locale }) => {
    const results = searchDocs(locale, question, 4);
    const context = results
      .map(result => {
        const page = getDoc(result.locale, result.slug);
        return page ? toMarkdownPage(result.locale, page) : "";
      })
      .filter(Boolean)
      .join("\n\n---\n\n");

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Answer the user question using only the ACTA documentation context below.",
              "If the documentation does not contain the answer, say that clearly and suggest the closest ACTA docs page.",
              "",
              `Question: ${question}`,
              "",
              "ACTA documentation context:",
              context || "No matching ACTA documentation pages found.",
            ].join("\n"),
          },
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  console.error("ACTA MCP server failed to start:", error);
  process.exit(1);
});
