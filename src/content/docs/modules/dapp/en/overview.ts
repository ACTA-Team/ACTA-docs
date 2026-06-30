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

The ACTA dApp is a modern web application that provides a user-friendly interface to issue, manage, and share verifiable credentials. Built with Next.js 16, React 19, and the ACTA SDK, it offers a credential management interface without requiring programming knowledge.

## What is the ACTA dApp?

The ACTA dApp is a decentralized application that allows you to:

- **Issue credentials** to users (issuing requires a registered \`did:stellar\` - see **My DID**)
- **Maintain a single-tenant vault** of credentials with search, share, and revoke actions
- **Share credentials** with selective field disclosure
- **Manage issuer access** by blocking and unblocking issuers (issuance is open by default)
- **Verify credentials** on-chain
- **Manage API keys** for programmatic access

Each owner has their **own** vault, deployed deterministically by the \`vc-vault-factory\`. Operations are performed through Stellar/Soroban infrastructure using ACTA contracts and APIs.

## Key Features

### Credential Management

- Create and issue verifiable credentials
- Store credentials in your personal single-tenant vault
- Search and filter credentials
- Share credentials with selective field disclosure
- Revoke credentials when needed

### Issuer Access (block list)

- **Issuance is open by default** - anyone with a registered \`did:stellar\` can issue to a vault unless blocked
- **Block** an issuer to stop it from writing to your vault
- **Unblock** a previously blocked issuer to restore access
- Review your blocked-issuer list

### My DID

- Issuing credentials requires a registered, resolvable \`did:stellar\`
- The dApp helps you create and manage your issuer DID

### API Key Management

- Create and manage API keys for testnet and mainnet
- Standard role keys with 6-month expiration
- Integrate with the ACTA API

### Guided Onboarding

- Interactive tutorials for first-time users
- Quick start guide with step-by-step instructions
- Contextual help throughout the application

## Getting Started

To start using the ACTA dApp:

1. **Connect your wallet** - Link your Stellar wallet
2. **Choose network** - Select testnet or mainnet
3. **Create your vault** - Initialize your personal single-tenant credential vault
4. **Register your DID** - Set up your \`did:stellar\` to issue credentials
5. **Start issuing** - Create and manage your credentials (block issuers only if needed)

See the [Getting Started Guide](#dapp-getting-started) for detailed instructions.

## Access the dApp

The ACTA dApp is available at the link below. **No installation required** - open it in your web browser and connect your Stellar wallet to get started.

:::dapp-open-cta:::
    `,
};
