import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { AppShell } from "@/layouts/app-shell/AppShell";
import { docsByLocale } from "@/content/docs";
import type { Locale } from "@/@types/docs";

const SECONDARY_LOCALES = ["es", "fr"] as const;

/** Non-content pages rendered by the shell itself, with localized metadata. */
const EXTRA_SLUGS: Record<
  string,
  Record<Locale, { title: string; description: string }>
> = {
  faq: {
    en: { title: "FAQ", description: "Frequently asked questions about ACTA." },
    es: {
      title: "Preguntas Frecuentes",
      description: "Preguntas frecuentes sobre ACTA.",
    },
    fr: { title: "FAQ", description: "Questions fréquentes sur ACTA." },
  },
  support: {
    en: {
      title: "Support",
      description: "Get help with ACTA: contact the team and community.",
    },
    es: {
      title: "Soporte",
      description: "Obtén ayuda con ACTA: contacta al equipo y la comunidad.",
    },
    fr: {
      title: "Support",
      description: "Obtenez de l'aide avec ACTA : équipe et communauté.",
    },
  },
};

const ALL_SLUGS = [
  ...Object.keys(docsByLocale.en),
  ...Object.keys(EXTRA_SLUGS),
];

function isLocale(value: string): value is (typeof SECONDARY_LOCALES)[number] {
  return (SECONDARY_LOCALES as readonly string[]).includes(value);
}

function parsePath(
  path: string[]
): { locale: Locale; slug: string } | { redirectTo: string } | null {
  if (path.length === 1) {
    if (isLocale(path[0])) return { redirectTo: `/${path[0]}/introduction` };
    if (ALL_SLUGS.includes(path[0])) return { locale: "en", slug: path[0] };
    return null;
  }
  if (path.length === 2 && isLocale(path[0]) && ALL_SLUGS.includes(path[1])) {
    return { locale: path[0], slug: path[1] };
  }
  return null;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const params: Array<{ path: string[] }> = [];
  for (const slug of ALL_SLUGS) params.push({ path: [slug] });
  for (const locale of SECONDARY_LOCALES) {
    params.push({ path: [locale] });
    for (const slug of ALL_SLUGS) params.push({ path: [locale, slug] });
  }
  return params;
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

function pathFor(locale: Locale, slug: string): string {
  return locale === "en" ? `/${slug}` : `/${locale}/${slug}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>;
}): Promise<Metadata> {
  const { path } = await params;
  const parsed = parsePath(path);
  if (!parsed || "redirectTo" in parsed) return {};

  const { locale, slug } = parsed;
  const languages = {
    en: pathFor("en", slug),
    es: pathFor("es", slug),
    fr: pathFor("fr", slug),
    "x-default": pathFor("en", slug),
  };
  const alternates = { canonical: pathFor(locale, slug), languages };

  const extra = EXTRA_SLUGS[slug];
  if (extra) {
    const { title, description } = extra[locale];
    return { title, description, alternates };
  }

  const page = docsByLocale[locale][slug];
  if (!page) return {};
  const description = extractDescription(page.content);
  return {
    title: page.title === "Overview" ? `${page.section} Overview` : page.title,
    description,
    alternates,
    openGraph: {
      title: `${page.title} · ACTA Docs`,
      description,
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const parsed = parsePath(path);
  if (!parsed) notFound();
  if ("redirectTo" in parsed) permanentRedirect(parsed.redirectTo);
  return <AppShell />;
}
