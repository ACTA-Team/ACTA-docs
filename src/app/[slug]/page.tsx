import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/layouts/app-shell/AppShell";
import { docsByLocale } from "@/content/docs";

/** Non-content pages rendered by the shell itself. */
const EXTRA_SLUGS: Record<string, { title: string; description: string }> = {
  faq: {
    title: "FAQ",
    description: "Frequently asked questions about ACTA.",
  },
  support: {
    title: "Support",
    description: "Get help with ACTA: contact the team and community.",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(docsByLocale.en), ...Object.keys(EXTRA_SLUGS)].map(
    slug => ({ slug })
  );
}

/** First readable sentence of a page's markdown, for meta descriptions. */
function extractDescription(content: string): string | undefined {
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (
      !line ||
      line.startsWith("#") ||
      line.startsWith("|") ||
      line.startsWith("```") ||
      line.startsWith(":::") ||
      line.startsWith(">") ||
      line.startsWith("-") ||
      /^\d+\./.test(line)
    ) {
      continue;
    }
    const plain = line
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .trim();
    if (plain.length > 40) {
      return plain.length > 155 ? `${plain.slice(0, 152)}...` : plain;
    }
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const extra = EXTRA_SLUGS[slug];
  if (extra) {
    return { title: extra.title, description: extra.description };
  }
  const page = docsByLocale.en[slug];
  if (!page) return {};
  const description = extractDescription(page.content);
  return {
    title: page.title === "Overview" ? `${page.section} Overview` : page.title,
    description,
    openGraph: {
      title: `${page.title} · ACTA Docs`,
      description,
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!docsByLocale.en[slug] && !EXTRA_SLUGS[slug]) {
    notFound();
  }
  return <AppShell />;
}
