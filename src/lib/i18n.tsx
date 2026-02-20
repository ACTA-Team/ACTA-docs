"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Locale, Translations } from "@/@types/i18n";

export type { Locale, Translations };

const translations: Record<Locale, Translations> = {
  en: {
    welcome: "Welcome",
    reactSdk: "React SDK",
    apiReference: "API Reference",
    zkProofs: "Zero-Knowledge Proofs",
    scf: "SCF",
    dApp: "dApp",
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
    downloadPdf: "Download PDF",
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
    // FAQ
    faq: "FAQ",
    faqDescription:
      "Frequently asked questions about ACTA. Click on any question to get an AI-powered answer.",
    faqQuestion1: "What is ACTA and what problem does it solve?",
    faqQuestion2: "How do I integrate ACTA with my application?",
    faqQuestion3: "What are verifiable credentials and how do they work?",
    faqQuestion4: "How does the vault system work?",
    faqQuestion5: "What blockchain does ACTA use?",
    faqQuestion6: "How do I get started with the React SDK?",
    clickToAnswer: "Click to get AI answer",
    loadingAnswer: "Getting answer...",
    // Support
    support: "Support",
    supportDescription: "Need help? Contact us or explore our resources.",
    supportTitle: "Get Support",
    contactUs: "Contact Us",
    sendMessage: "Send Message",
    yourName: "Your Name",
    yourEmail: "Your Email",
    yourMessage: "Your Message",
    messageSent: "Message sent successfully!",
    quickLinks: "Quick Links",
    documentation: "Documentation",
    community: "Community",
    reportIssue: "Report an Issue",
    featureRequest: "Feature Request",
    // Support validation
    validationErrorTitle: "Form error",
    validationNameRequired: "Name is required.",
    validationNameTooLong: "Name must be at most 200 characters.",
    validationEmailRequired: "Email is required.",
    validationEmailInvalid: "Please enter a valid email address.",
    validationMessageRequired: "Message is required.",
    validationMessageTooLong: "Message must be at most 4000 characters.",
  },
  es: {
    welcome: "Bienvenida",
    reactSdk: "React SDK",
    apiReference: "Referencia API",
    zkProofs: "Pruebas de Conocimiento Cero",
    scf: "SCF",
    dApp: "dApp",
    introduction: "Introducción",
    architecture: "Arquitectura",
    gettingStarted: "Primeros Pasos",
    links: "Enlaces",
    overview: "Resumen",
    askOrSearch: "Preguntar o buscar...",
    dApp: "dApp",
    discord: "Discord",
    website: "Sitio Web",
    english: "Inglés",
    spanish: "Español",
    onThisPage: "En esta página",
    wasThisHelpful: "¿Te fue útil?",
    copy: "Copiar",
    copied: "¡Copiado!",
    downloadPdf: "Descargar PDF",
    poweredBy: "ACTA",
    searchPlaceholder: "Pregunta a la IA sobre ACTA...",
    searchResults: "Resultados de búsqueda",
    noResults: "No se encontraron resultados",
    searching: "Buscando...",
    aiPowered: "Búsqueda con IA",
    relatedPages: "Páginas relacionadas:",
    askAnything:
      "Pregunta lo que quieras sobre ACTA, credenciales, bóvedas o el SDK",
    poweredByGemini: "Con tecnología de Gemini AI",
    toSearch: "para buscar",
    toClose: "para cerrar",
    // FAQ
    faq: "Preguntas Frecuentes",
    faqDescription:
      "Preguntas frecuentes sobre ACTA. Haz clic en cualquier pregunta para obtener una respuesta impulsada por IA.",
    faqQuestion1: "¿Qué es ACTA y qué problema resuelve?",
    faqQuestion2: "¿Cómo integro ACTA con mi aplicación?",
    faqQuestion3: "¿Qué son las credenciales verificables y cómo funcionan?",
    faqQuestion4: "¿Cómo funciona el sistema de bóvedas?",
    faqQuestion5: "¿Qué blockchain usa ACTA?",
    faqQuestion6: "¿Cómo empiezo con el React SDK?",
    clickToAnswer: "Clic para obtener respuesta de IA",
    loadingAnswer: "Obteniendo respuesta...",
    // Support
    support: "Soporte",
    supportDescription:
      "¿Necesitas ayuda? Contáctanos o explora nuestros recursos.",
    supportTitle: "Obtener Soporte",
    contactUs: "Contáctanos",
    sendMessage: "Enviar Mensaje",
    yourName: "Tu Nombre",
    yourEmail: "Tu Correo",
    yourMessage: "Tu Mensaje",
    messageSent: "¡Mensaje enviado exitosamente!",
    quickLinks: "Enlaces Rápidos",
    documentation: "Documentación",
    community: "Comunidad",
    reportIssue: "Reportar un Problema",
    featureRequest: "Solicitar Función",
    // Support validation
    validationErrorTitle: "Error en el formulario",
    validationNameRequired: "El nombre es obligatorio.",
    validationNameTooLong: "El nombre debe tener máximo 200 caracteres.",
    validationEmailRequired: "El correo es obligatorio.",
    validationEmailInvalid: "Introduce un correo electrónico válido.",
    validationMessageRequired: "El mensaje es obligatorio.",
    validationMessageTooLong: "El mensaje debe tener máximo 4000 caracteres.",
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: translations[locale] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
