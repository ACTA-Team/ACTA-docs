export type Locale = "en" | "es" | "fr";

export interface Translations {
  // Navigation
  welcome: string;
  reactSdk: string;
  apiReference: string;
  contracts: string;
  /** Sidebar / breadcrumb label for the AI category (IA / AI). */
  aiCategory: string;
  didCategory: string;
  guidesCategory: string;
  tabAwayTitle: string;
  dApp: string;
  introduction: string;
  architecture: string;
  gettingStarted: string;
  links: string;
  overview: string;

  // Header
  askOrSearch: string;
  discord: string;
  website: string;
  english: string;
  spanish: string;
  french: string;

  // Content
  onThisPage: string;
  copy: string;
  copied: string;
  downloadPdf: string;
  /** Primary pill CTA linking to the ACTA dApp (docs markdown directive). */
  dappOpenCtaButton: string;
  /** Welcome page "Try it now" CTA row (titles + short hints). */
  welcomeTryItDapp: string;
  welcomeTryItDappHint: string;
  welcomeTryItGithub: string;
  welcomeTryItGithubHint: string;
  welcomeTryItDiscord: string;
  welcomeTryItDiscordHint: string;

  /** Live GET /health demo on the Health & Status doc page. */
  healthTryBadge: string;
  healthTryDescription: string;
  healthTryButton: string;
  healthTryLoading: string;
  healthTryHttpLabel: string;
  healthTryUnexpectedError: string;

  // Footer
  poweredBy: string;
  footerGithub: string;
  footerSourceCommunity: string;

  // Not found
  notFoundDescription: string;
  notFoundGoDocs: string;
  notFoundVisitWebsite: string;

  // Search
  searchPlaceholder: string;
  searchResults: string;
  noResults: string;
  searching: string;
  aiPowered: string;
  relatedPages: string;
  askAnything: string;
  poweredByAI: string;
  toSearch: string;
  toClose: string;
  aiSuggestionsLabel: string;
  aiExample1: string;
  aiExample2: string;
  aiExample3: string;

  // FAQ
  faq: string;
  faqDescription: string;
  faqQuestion1: string;
  faqQuestion2: string;
  faqQuestion3: string;
  faqQuestion4: string;
  faqQuestion5: string;
  faqQuestion6: string;
  clickToAnswer: string;
  loadingAnswer: string;

  // Support
  support: string;
  supportDescription: string;
  supportTitle: string;
  supportResponseHint: string;
  supportEmailLabel: string;
  contactUs: string;
  sendMessage: string;
  yourName: string;
  yourEmail: string;
  yourMessage: string;
  messageSent: string;
  quickLinks: string;
  documentation: string;
  community: string;
  reportIssue: string;
  featureRequest: string;
  supportSending: string;
  supportErrorTitle: string;
  supportSendFailed: string;
  supportPlaceholderName: string;
  supportPlaceholderEmail: string;
  supportPlaceholderMessage: string;
  supportDocLinkDescription: string;
  supportCommunityLinkDescription: string;
  supportIssueLinkDescription: string;
  supportFeatureLinkDescription: string;
  supportImmediateHelpTitle: string;
  supportImmediateHelpBody: string;
  // Support validation
  validationErrorTitle: string;
  validationNameRequired: string;
  validationNameTooLong: string;
  validationEmailRequired: string;
  validationEmailInvalid: string;
  validationMessageRequired: string;
  validationMessageTooLong: string;
}
