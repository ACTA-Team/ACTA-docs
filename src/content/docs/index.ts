import type { DocPage, NavigationItems } from "@/@types/docs";
import { docsData as docsDataEn } from "./locales/en";
import { docsData as docsDataEs } from "./locales/es";
import { navigationEn, navigationEs } from "./navigation";

export type { DocPage, NavigationItems };

export { docsDataEn, docsDataEs };
export { navigationEn as navigationItemsEn, navigationEs as navigationItemsEs };

export const docsByLocale: Record<"en" | "es", Record<string, DocPage>> = {
  en: docsDataEn,
  es: docsDataEs,
};
