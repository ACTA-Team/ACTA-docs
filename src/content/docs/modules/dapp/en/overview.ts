import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "dapp-overview",
  title: "Overview",
  section: "dApp",
  tocItems: [
    "What is the ACTA dApp?",
    "Key Features",
    "Getting Started",
    "Access the dApp",
  ],
  content: `
# ACTA dApp Overview

The ACTA dApp is a modern web application that provides a user-friendly interface to issue, manage, share, and authorize verifiable credentials. Built with Next.js 16, React 19, and the ACTA SDK, it offers a complete credential management solution without requiring programming knowledge.

## What is the ACTA dApp?

The ACTA dApp is a decentralized application that allows you to:

- **Issue credentials** to users and manage issuer authorization
- **Maintain a vault** of credentials with search, share, and revoke actions
- **Share credentials** with zero-knowledge proofs for privacy
- **Authorize issuers** to control who can issue credentials to your vault
- **Verify credentials** on-chain and verify ZK proofs
- **Manage API keys** for programmatic access

All operations are performed directly on the Stellar blockchain through Soroban smart contracts, ensuring non-custodial credential management.

## Key Features

### Credential Management

- Create and issue verifiable credentials
- Store credentials in your personal vault
- Search and filter credentials
- Share credentials with selective field disclosure
- Revoke credentials when needed

### Issuer Authorization

- Authorize specific wallets to issue credentials to your vault
- Manage authorized issuers list
- Control who can create credentials for you

### Zero-Knowledge Proofs

- Generate ZK proofs for credential predicates
- Share credentials with privacy-preserving proofs
- Verify proofs without revealing private data
- Support for multiple predicate types (age verification, expiration, status)

### API Key Management

- Create and manage API keys for testnet and mainnet
- Standard role keys with 6-month expiration
- Easy integration with the ACTA API

### Guided Onboarding

- Interactive tutorials for first-time users
- Quick start guide with step-by-step instructions
- Contextual help throughout the application

## Getting Started

To start using the ACTA dApp:

1. **Connect your wallet** - Link your Stellar wallet (Freighter, etc.)
2. **Choose network** - Select testnet (for testing) or mainnet
3. **Create your vault** - Initialize your personal credential vault
4. **Authorize issuers** - Grant permissions to trusted wallets
5. **Start issuing** - Create and manage your credentials

See the [Getting Started Guide](#dapp-getting-started) for detailed instructions.

## Access the dApp

The ACTA dApp is available at:

\`\`\`
https://dapp.acta.build
\`\`\`

No installation required - simply visit the URL in your web browser and connect your Stellar wallet to get started.
    `,
};
