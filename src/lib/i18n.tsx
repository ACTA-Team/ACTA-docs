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
    reactSdk: "Credentials SDK",
    apiReference: "API Reference",
    contracts: "Contracts",
    aiCategory: "AI",
    didCategory: "DID",
    guidesCategory: "Guides",
    tabAwayTitle: "Come back 👋 · ACTA Docs",
    dApp: "dApp",
    introduction: "Introduction",
    architecture: "Architecture",
    gettingStarted: "Getting Started",
    links: "Links",
    overview: "Overview",
    askOrSearch: "Ask or search...",
    discord: "Discord",
    website: "Website",
    english: "English",
    spanish: "Spanish",
    onThisPage: "On this page",
    copy: "Copy",
    copied: "Copied!",
    downloadPdf: "Download PDF",
    dappOpenCtaButton: "Open ACTA dApp",
    welcomeTryItDapp: "Open dApp",
    welcomeTryItDappHint: "Explore the ACTA dApp",
    welcomeTryItGithub: "View GitHub",
    welcomeTryItGithubHint: "Check the source code",
    welcomeTryItDiscord: "Join Discord",
    welcomeTryItDiscordHint: "Connect with the community",
    healthTryBadge: "Live",
    healthTryDescription:
      "Runs GET https://api.testnet.acta.build/health through this site’s proxy—no API key required. OpenAPI UI: https://api.testnet.acta.build/docs",
    healthTryButton: "Run health check",
    healthTryLoading: "Calling API…",
    healthTryHttpLabel: "HTTP status",
    healthTryUnexpectedError: "Unexpected error",
    poweredBy: "ACTA",
    footerGithub: "GitHub",
    footerSourceCommunity: "Source & community",
    notFoundDescription:
      "The page you're looking for might have been moved or doesn't exist.",
    notFoundGoDocs: "Back to documentation",
    notFoundVisitWebsite: "Visit acta.build",
    searchPlaceholder: "Ask AI anything about ACTA...",
    searchResults: "Search Results",
    noResults: "No results found",
    searching: "Searching...",
    aiPowered: "AI-powered search",
    relatedPages: "Related pages:",
    askAnything: "Ask anything about ACTA, credentials, vaults, or the SDK",
    poweredByClaude: "Powered by Claude AI",
    toSearch: "to search",
    toClose: "to close",
    aiSuggestionsLabel: "Try asking",
    aiExample1: "How do I issue a credential?",
    aiExample2: "What is a vault and how do I create one?",
    aiExample3: "How do I get an API key?",
    // FAQ
    faq: "FAQ",
    faqDescription:
      "Frequently asked questions about ACTA. Click on any question to get an AI-powered answer.",
    faqQuestion1: "What is ACTA and what problem does it solve?",
    faqQuestion2: "How do I integrate ACTA with my application?",
    faqQuestion3: "What are verifiable credentials and how do they work?",
    faqQuestion4: "How does the vault system work?",
    faqQuestion5: "What blockchain does ACTA use?",
    faqQuestion6: "How do I get started with the Credentials SDK?",
    clickToAnswer: "Click to get AI answer",
    loadingAnswer: "Getting answer...",
    // Support
    support: "Support",
    supportDescription: "Need help? Contact us or explore our resources.",
    supportTitle: "Get Support",
    supportResponseHint: "We do our best to respond within one business day.",
    supportEmailLabel: "Email",
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
    supportSending: "Sending…",
    supportErrorTitle: "Couldn’t send",
    supportSendFailed:
      "We couldn’t send your message. Please try again in a moment.",
    supportPlaceholderName: "Your name",
    supportPlaceholderEmail: "you@example.com",
    supportPlaceholderMessage: "How can we help?",
    supportDocLinkDescription: "Guides, API reference, and examples.",
    supportCommunityLinkDescription: "Chat with the team and other builders.",
    supportIssueLinkDescription: "Open an issue on GitHub.",
    supportFeatureLinkDescription: "Share ideas and discuss on GitHub.",
    supportImmediateHelpTitle: "Prefer a faster back-and-forth?",
    supportImmediateHelpBody:
      "Join Discord for real-time help from the team and the community.",
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
    reactSdk: "SDK de credenciales",
    apiReference: "Referencia API",
    contracts: "Contratos",
    aiCategory: "IA",
    didCategory: "DID",
    guidesCategory: "Guías",
    tabAwayTitle: "Vuelve 👋 · ACTA Docs",
    dApp: "dApp",
    introduction: "Introducción",
    architecture: "Arquitectura",
    gettingStarted: "Primeros Pasos",
    links: "Enlaces",
    overview: "Resumen",
    askOrSearch: "Preguntar o buscar...",
    discord: "Discord",
    website: "Sitio Web",
    english: "Inglés",
    spanish: "Español",
    onThisPage: "En esta página",
    copy: "Copiar",
    copied: "¡Copiado!",
    downloadPdf: "Descargar PDF",
    dappOpenCtaButton: "Abrir dApp de ACTA",
    welcomeTryItDapp: "Abrir dApp",
    welcomeTryItDappHint: "Explora la dApp de ACTA",
    welcomeTryItGithub: "Ver GitHub",
    welcomeTryItGithubHint: "Revisa el código fuente",
    welcomeTryItDiscord: "Únete a Discord",
    welcomeTryItDiscordHint: "Conéctate con la comunidad",
    healthTryBadge: "En vivo",
    healthTryDescription:
      "Ejecuta GET https://api.testnet.acta.build/health a través del proxy de este sitio—sin API key. Interfaz OpenAPI: https://api.testnet.acta.build/docs",
    healthTryButton: "Ejecutar health check",
    healthTryLoading: "Llamando a la API…",
    healthTryHttpLabel: "Estado HTTP",
    healthTryUnexpectedError: "Error inesperado",
    poweredBy: "ACTA",
    footerGithub: "GitHub",
    footerSourceCommunity: "Código y comunidad",
    notFoundDescription:
      "La página que buscas pudo haberse movido o no existe.",
    notFoundGoDocs: "Volver a la documentación",
    notFoundVisitWebsite: "Ir a acta.build",
    searchPlaceholder: "Pregunta a la IA sobre ACTA...",
    searchResults: "Resultados de búsqueda",
    noResults: "No se encontraron resultados",
    searching: "Buscando...",
    aiPowered: "Búsqueda con IA",
    relatedPages: "Páginas relacionadas:",
    askAnything:
      "Pregunta lo que quieras sobre ACTA, credenciales, bóvedas o el SDK",
    poweredByClaude: "Con tecnología de Claude AI",
    toSearch: "para buscar",
    toClose: "para cerrar",
    aiSuggestionsLabel: "Prueba preguntar",
    aiExample1: "¿Cómo emito una credencial?",
    aiExample2: "¿Qué es una bóveda y cómo la creo?",
    aiExample3: "¿Cómo obtengo una API key?",
    // FAQ
    faq: "Preguntas Frecuentes",
    faqDescription:
      "Preguntas frecuentes sobre ACTA. Haz clic en cualquier pregunta para obtener una respuesta impulsada por IA.",
    faqQuestion1: "¿Qué es ACTA y qué problema resuelve?",
    faqQuestion2: "¿Cómo integro ACTA con mi aplicación?",
    faqQuestion3: "¿Qué son las credenciales verificables y cómo funcionan?",
    faqQuestion4: "¿Cómo funciona el sistema de bóvedas?",
    faqQuestion5: "¿Qué blockchain usa ACTA?",
    faqQuestion6: "¿Cómo empiezo con el SDK de credenciales?",
    clickToAnswer: "Clic para obtener respuesta de IA",
    loadingAnswer: "Obteniendo respuesta...",
    // Support
    support: "Soporte",
    supportDescription:
      "¿Necesitas ayuda? Contáctanos o explora nuestros recursos.",
    supportTitle: "Obtener Soporte",
    supportResponseHint: "Intentamos responderte en un día hábil.",
    supportEmailLabel: "Correo",
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
    supportSending: "Enviando…",
    supportErrorTitle: "No se pudo enviar",
    supportSendFailed:
      "No pudimos enviar tu mensaje. Inténtalo de nuevo en un momento.",
    supportPlaceholderName: "Tu nombre",
    supportPlaceholderEmail: "tu@ejemplo.com",
    supportPlaceholderMessage: "¿En qué podemos ayudarte?",
    supportDocLinkDescription: "Guías, referencia de API y ejemplos.",
    supportCommunityLinkDescription:
      "Habla con el equipo y otros desarrolladores.",
    supportIssueLinkDescription: "Abre un issue en GitHub.",
    supportFeatureLinkDescription: "Comparte ideas y debate en GitHub.",
    supportImmediateHelpTitle: "¿Prefieres respuesta rápida?",
    supportImmediateHelpBody:
      "Únete a Discord para ayuda en tiempo real del equipo y la comunidad.",
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
