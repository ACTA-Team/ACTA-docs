import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "getting-started",
  title: "Getting Started",
  section: "Welcome",
  tocItems: [
    "API Integration",
    "Credentials SDK Integration",
    "Wallet Integration",
    "Testnet Setup",
    "Next Steps",
  ],
  content: `
# Getting Started

Quick start guides for different integration scenarios.

## API Integration

Start using the ACTA API to issue and verify credentials:

1. **Choose Network**: Testnet (recommended for development) or Mainnet
2. **Get an API Key**: All \`/contracts/*\` routes require an \`X-ACTA-Key\` header (see [API Keys](doc:api-keys))
3. **Issue Credentials**: Use the \`POST /contracts/vc/issue\` endpoint
4. **Verify Credentials**: Use \`POST /contracts/vault/verify-vc\`

For base URLs and the full endpoint map, open **[API Overview](doc:api-overview)**. To confirm the service is up, use **[Health & Status](doc:api-health-status)** (includes a live **GET /health** you can run in the browser).

## Credentials SDK Integration

For React / Next.js applications:

1. **Install**:

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

2. **Provider**: Wrap your tree with **\`ActaConfig\`** (pass \`baseURL\`, optional \`apiKey\`; see Credentials SDK Overview).
3. **Hooks**: \`useCredential\`, \`useVault\`, \`useVaultRead\`, and **\`useActaClient\`** when you need the HTTP client directly.

See **[Credentials SDK Overview](doc:sdk-overview)** and the hook pages for details.

## Wallet Integration

Connect Stellar wallets for user authentication and transaction signing:

1. **Wallet UI**: Integrate a Stellar wallet adapter - **[Stellar Wallets Kit](https://stellarwalletskit.dev)** covers Freighter, Albedo, WalletConnect, and more.
2. **Connect wallet**: User connects Freighter or another supported Stellar wallet.
3. **Sign transactions**: Use ACTA’s transaction preparation endpoints from **[Vault Operations (Write)](doc:api-vault-write)** and **[Credential Operations](doc:api-credentials)**; your \`signTransaction\` callback signs the unsigned XDR the API returns.

## Testnet Setup

Before deploying to mainnet:

1. **Get testnet XLM**: Use **[Stellar Lab (fund account)](https://lab.stellar.org/account/fund)** or the **[testnet](https://developers.stellar.org/docs/learn/fundamentals/networks)** resources from Stellar.
2. **Test operations**: Issue, store, and verify test credentials against testnet (see **[API Overview](doc:api-overview)**).
3. **Verify contracts**: Testnet contract IDs are pre-configured when you use the testnet API base URL.

## Next Steps

- **[API Overview](doc:api-overview)** - all public endpoints
- **[Credential Operations](doc:api-credentials)** and **[Vault Operations (Read)](doc:api-vault-read)** - payloads and examples
- **[Contract errors](doc:contract-errors)** - on-chain error codes
- **[FAQ](doc:faq)** - common questions
    `,
};
