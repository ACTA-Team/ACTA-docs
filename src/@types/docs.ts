export type DocPage = {
  slug: string;
  title: string;
  section: string;
  content: string;
  tocItems: string[];
};

export type Locale = "en" | "es";

export type NavigationItem = {
  slug: string;
  title: string;
  /** If set, sidebar opens this URL instead of in-app navigation. */
  externalUrl?: string;
};

export type NavigationItems = {
  welcome: NavigationItem[];
  sdk: NavigationItem[];
  "api-reference": NavigationItem[];
  contracts?: NavigationItem[];
  /** AI-related docs (e.g. MCP). */
  ia?: NavigationItem[];
  dapp: NavigationItem[];
  help?: NavigationItem[];
};
