export type Locale = "en" | "es";

export interface Translations {
  // Navigation
  welcome: string;
  reactSdk: string;
  apiReference: string;
  zkProofs: string;
  scf: string;
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

  // Content
  onThisPage: string;
  wasThisHelpful: string;
  copy: string;
  copied: string;
  downloadPdf: string;

  // Footer
  poweredBy: string;

  // Search
  searchPlaceholder: string;
  searchResults: string;
  noResults: string;
  searching: string;
  aiPowered: string;
  relatedPages: string;
  askAnything: string;
  poweredByGemini: string;
  toSearch: string;
  toClose: string;

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
