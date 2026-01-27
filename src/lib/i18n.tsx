"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import type { Locale, Translations } from "@/@types/i18n"

export type { Locale, Translations }

const translations: Record<Locale, Translations> = {
  en: {
    welcome: "Welcome",
    reactSdk: "React SDK",
    introduction: "Introduction",
    architecture: "Architecture",
    gettingStarted: "Getting Started",
    links: "Links",
    overview: "Overview",
    askOrSearch: "Ask or search...",
    dApp: "dApp",
    discord: "Discord",
    website: "Website",
    english: "English",
    spanish: "Spanish",
    onThisPage: "On this page",
    wasThisHelpful: "Was this helpful?",
    copy: "Copy",
    copied: "Copied!",
    poweredBy: "ACTA",
    searchPlaceholder: "Ask AI anything about ACTA...",
    searchResults: "Search Results",
    noResults: "No results found",
    searching: "Searching...",
    aiPowered: "AI-powered search",
    relatedPages: "Related pages:",
    askAnything: "Ask anything about ACTA, credentials, vaults, or the SDK",
    poweredByGemini: "Powered by Gemini AI",
    toSearch: "to search",
    toClose: "to close",
  },
  es: {
    welcome: "Bienvenida",
    reactSdk: "React SDK",
    introduction: "Introduccion",
    architecture: "Arquitectura",
    gettingStarted: "Primeros Pasos",
    links: "Enlaces",
    overview: "Resumen",
    askOrSearch: "Preguntar o buscar...",
    dApp: "dApp",
    discord: "Discord",
    website: "Sitio Web",
    english: "Ingles",
    spanish: "Espanol",
    onThisPage: "En esta pagina",
    wasThisHelpful: "Te fue util?",
    copy: "Copiar",
    copied: "Copiado!",
    poweredBy: "ACTA",
    searchPlaceholder: "Pregunta a la IA sobre ACTA...",
    searchResults: "Resultados de busqueda",
    noResults: "No se encontraron resultados",
    searching: "Buscando...",
    aiPowered: "Busqueda con IA",
    relatedPages: "Páginas relacionadas:",
    askAnything: "Pregunta lo que quieras sobre ACTA, credenciales, bóvedas o el SDK",
    poweredByGemini: "Con tecnología de Gemini AI",
    toSearch: "para buscar",
    toClose: "para cerrar",
  },
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")
  
  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
