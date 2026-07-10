import type { DocPage, Locale, NavigationItems } from "@/@types/docs";
import { docsData as docsDataEn } from "./locales/en";
import { docsData as docsDataEs } from "./locales/es";
import { docsData as docsDataFr } from "./locales/fr";
import { navigationEn, navigationEs, navigationFr } from "./navigation";

export type { DocPage, NavigationItems };

export { docsDataEn, docsDataEs, docsDataFr };
export {
  navigationEn as navigationItemsEn,
  navigationEs as navigationItemsEs,
  navigationFr as navigationItemsFr,
};

export const docsByLocale: Record<Locale, Record<string, DocPage>> = {
  en: docsDataEn,
  es: docsDataEs,
  fr: docsDataFr,
};

export const navigationByLocale: Record<Locale, NavigationItems> = {
  en: navigationEn,
  es: navigationEs,
  fr: navigationFr,
};
