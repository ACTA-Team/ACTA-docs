import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "getting-started",
  title: "Getting Started",
  section: "Welcome",
  tocItems: [
    "API Integration",
    "React SDK Integration",
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
2. **Get API Access**: Base URL and network configuration
3. **Issue Credentials**: Use \`POST /credentials\` endpoint
4. **Verify Credentials**: Use \`GET /verify/:vc_id\` or \`POST /verify\`

See API Developer Quickstart for detailed steps.

## React SDK Integration

For React/Next.js applications:

1. **Install SDK**:

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

2. **Configure Provider**: Wrap app with \`ActaConfig\`
3. **Use Hooks**: \`useCredential\`, \`useVault\`, \`useVaultRead\`, etc.

See React SDK Documentation for hooks and examples.

## Wallet Integration

Connect Stellar wallets for user authentication and transaction signing:

1. **Install Wallet Kit**: Integrate wallet adapter
2. **Connect Wallet**: User connects Freighter or other Stellar wallet
3. **Sign Transactions**: Use transaction preparation endpoints

See Wallet Kit Integration for details.

## Testnet Setup

Before deploying to mainnet:

1. **Get Testnet Tokens**: Request XLM from Stellar testnet faucet
2. **Test Operations**: Issue, store, and verify test credentials
3. **Verify Contracts**: Testnet contract IDs are pre-configured

See Testnet Tokens for faucet links.

## Next Steps

- Review API Reference for all available endpoints
- Check Schema Documentation for data structures
- Explore React SDK Hooks for React integration
- Read Troubleshooting Guide for common issues
    `,
};
