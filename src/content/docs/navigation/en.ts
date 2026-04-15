import type { NavigationItems } from "@/@types/docs";

export const navigation: NavigationItems = {
  welcome: [
    { slug: "introduction", title: "Introduction" },
    { slug: "architecture", title: "Architecture" },
    { slug: "getting-started", title: "Getting Started" },
    { slug: "links", title: "Links" },
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
  dapp: [
    { slug: "dapp-overview", title: "Overview" },
    { slug: "dapp-getting-started", title: "Getting Started" },
    { slug: "dapp-features", title: "Features" },
  ],
  "zk-proofs": [
    { slug: "zk-overview", title: "Overview" },
    { slug: "zk-circuits", title: "Circuits" },
    { slug: "zk-generation", title: "Proof Generation" },
    { slug: "zk-verification", title: "Proof Verification" },
  ],
  scf: [{ slug: "scf-42", title: "SCF 42" }],
  help: [
    { slug: "faq", title: "FAQ" },
    { slug: "support", title: "Support" },
  ],
};
