import type { NavigationItems } from "@/@types/docs";

export const navigation: NavigationItems = {
  welcome: [
    { slug: "introduction", title: "Introduction" },
    { slug: "architecture", title: "Architecture" },
    { slug: "getting-started", title: "Getting Started" },
    {
      slug: "links",
      title: "Links",
      externalUrl: "https://links.acta.build",
    },
  ],
  sdk: [
    { slug: "sdk-overview", title: "Overview" },
    { slug: "useCredential", title: "useCredential" },
    { slug: "useVault", title: "useVault" },
    { slug: "useVaultRead", title: "useVaultRead" },
  ],
  "api-reference": [
    { slug: "api-overview", title: "Overview" },
    { slug: "api-keys", title: "API Keys" },
    { slug: "api-contract-info", title: "Contract Info" },
    { slug: "api-vault-read", title: "Vault Operations (Read)" },
    { slug: "api-vault-write", title: "Vault Operations (Write)" },
    { slug: "api-credentials", title: "Credential Operations" },
  ],
  contracts: [{ slug: "contract-errors", title: "Contract errors" }],
  mcp: [{ slug: "mcp", title: "ACTA Docs MCP" }],
  dapp: [
    { slug: "dapp-overview", title: "Overview" },
    { slug: "dapp-getting-started", title: "Getting Started" },
    { slug: "dapp-features", title: "Features" },
  ],
  help: [
    { slug: "faq", title: "FAQ" },
    { slug: "support", title: "Support" },
  ],
};
