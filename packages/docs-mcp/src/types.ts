export type Locale = "en" | "es" | "fr";

export type DocPage = {
  slug: string;
  title: string;
  section: string;
  content: string;
  tocItems: string[];
};

export type DocsByLocale = Record<Locale, Record<string, DocPage>>;

export type SearchResult = {
  locale: Locale;
  slug: string;
  title: string;
  section: string;
  score: number;
  excerpt: string;
  uri: string;
  url: string;
};
