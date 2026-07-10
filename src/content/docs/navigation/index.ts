import { navigation as navigationEn } from "./en";
import { navigation as navigationEs } from "./es";
import { navigation as navigationFr } from "./fr";

export { navigationEn, navigationEs, navigationFr };

export const navigationByLocale = {
  en: navigationEn,
  es: navigationEs,
  fr: navigationFr,
} as const;
