import type { NavigationItems } from "@/@types/docs";

export const navigation: NavigationItems = {
  welcome: [
    { slug: "introduction", title: "Introduction" },
    { slug: "architecture", title: "Architecture" },
    { slug: "getting-started", title: "Getting Started" },
    { slug: "security", title: "Security & Data Model" },
    { slug: "versions", title: "Versions & Changelog" },
    {
      slug: "links",
      title: "Links",
      externalUrl: "https://links.acta.build",
    },
  ],
  guides: [
    { slug: "quickstart", title: "Quickstart" },
    { slug: "mainnet-guide", title: "Going to Mainnet" },
    { slug: "verify-credentials", title: "Verifying Credentials" },
  ],
  sdk: [
    { slug: "sdk-overview", title: "Overview" },
    { slug: "actaClient", title: "ActaClient" },
    { slug: "useCredential", title: "useCredential" },
    { slug: "useVault", title: "useVault" },
    { slug: "useVaultRead", title: "useVaultRead" },
    { slug: "sponsoredVault", title: "sponsoredVault" },
  ],
  "api-reference": [
    { slug: "api-overview", title: "Overview" },
    { slug: "api-health-status", title: "Health & Status" },
    { slug: "api-keys", title: "API Keys" },
    { slug: "api-contract-info", title: "Contract Info" },
    { slug: "api-vault-read", title: "Vault Operations (Read)" },
    { slug: "api-vault-write", title: "Vault Operations (Write)" },
    { slug: "api-sponsored-vault", title: "Sponsored Vault" },
    { slug: "api-credentials", title: "Credential Operations" },
    { slug: "api-errors", title: "Errors" },
  ],
  contracts: [
    { slug: "contracts-reference", title: "Contracts Reference" },
    { slug: "contract-errors", title: "Contract errors" },
  ],
  did: [
    { slug: "did-overview", title: "Overview" },
    { slug: "did-registry", title: "Registry & Resolver" },
    { slug: "did-library", title: "TypeScript Library" },
  ],
  ia: [{ slug: "mcp", title: "MCP" }],
  dapp: [
    { slug: "dapp-overview", title: "Overview" },
    { slug: "dapp-getting-started", title: "Getting Started" },
    { slug: "dapp-features", title: "Features" },
  ],
  help: [
    { slug: "faq", title: "FAQ" },
    { slug: "support", title: "Support" },
    { slug: "glossary", title: "Glossary" },
  ],
};
