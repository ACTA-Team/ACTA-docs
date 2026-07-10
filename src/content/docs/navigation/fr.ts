import type { NavigationItems } from "@/@types/docs";

export const navigation: NavigationItems = {
  welcome: [
    { slug: "introduction", title: "Introduction" },
    { slug: "architecture", title: "Architecture" },
    { slug: "getting-started", title: "Premiers Pas" },
    { slug: "security", title: "Sécurité et Modèle de Données" },
    { slug: "versions", title: "Versions et Changelog" },
    {
      slug: "links",
      title: "Liens",
      externalUrl: "https://links.acta.build",
    },
  ],
  guides: [
    { slug: "quickstart", title: "Quickstart" },
    { slug: "mainnet-guide", title: "Passer en Mainnet" },
    { slug: "verify-credentials", title: "Vérifier des credentials" },
  ],
  sdk: [
    { slug: "sdk-overview", title: "Aperçu" },
    { slug: "actaClient", title: "ActaClient" },
    { slug: "useCredential", title: "useCredential" },
    { slug: "useVault", title: "useVault" },
    { slug: "useVaultRead", title: "useVaultRead" },
    { slug: "sponsoredVault", title: "sponsoredVault" },
  ],
  "api-reference": [
    { slug: "api-overview", title: "Aperçu" },
    { slug: "api-health-status", title: "Santé et état" },
    { slug: "api-keys", title: "API Keys" },
    { slug: "api-contract-info", title: "Infos du Contrat" },
    { slug: "api-vault-read", title: "Opérations de Coffre (Lecture)" },
    { slug: "api-vault-write", title: "Opérations de Coffre (Écriture)" },
    { slug: "api-sponsored-vault", title: "Coffre sponsorisé" },
    { slug: "api-credentials", title: "Opérations de Credentials" },
    { slug: "api-errors", title: "Erreurs" },
  ],
  contracts: [
    { slug: "contracts-reference", title: "Référence des Contrats" },
    { slug: "contract-errors", title: "Erreurs de contrat" },
  ],
  did: [
    { slug: "did-overview", title: "Aperçu" },
    { slug: "did-registry", title: "Registre et Resolver" },
    { slug: "did-library", title: "Bibliothèque TypeScript" },
  ],
  ia: [{ slug: "mcp", title: "MCP" }],
  dapp: [
    { slug: "dapp-overview", title: "Aperçu" },
    { slug: "dapp-getting-started", title: "Premiers Pas" },
    { slug: "dapp-features", title: "Fonctionnalités" },
  ],
  help: [
    { slug: "faq", title: "FAQ" },
    { slug: "support", title: "Support" },
    { slug: "glossary", title: "Glossaire" },
  ],
};
