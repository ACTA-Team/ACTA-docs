import { navigation as navigationEn } from "./en";
import { navigation as navigationEs } from "./es";

export { navigationEn, navigationEs };

export const navigationByLocale = {
  en: navigationEn,
  es: navigationEs,
} as const;
