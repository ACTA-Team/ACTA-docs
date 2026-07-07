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

The ACTA dApp is a modern web application that provides a user-friendly interface to issue, manage, share, and control access to verifiable credentials. Built with Next.js 16 and React 19 on top of the ACTA REST API, it offers a credential management interface without requiring programming knowledge.

## What is the ACTA dApp?

The ACTA dApp is a decentralized application that allows you to:

- **Issue credentials** to users (issuing requires a registered did:stellar identity and charges an on-chain fee paid by the issuer)
- **Maintain a vault** of credentials with search, share, and revoke actions
- **Share credentials** with selective field disclosure
- **Manage issuer access** - issuance is open by default, so you only block or unblock specific issuers
- **Verify credentials** on-chain
- **Manage API keys** for programmatic access

Operations are performed through Stellar/Soroban infrastructure using ACTA contracts and APIs.

## Key Features

### Credential Management

- Create and issue verifiable credentials from **templates** (built-in templates like course certificates, memberships, or payment receipts, plus a custom template builder)
- Store credentials in your personal vault
- Search and filter credentials
- Share credentials with selective field disclosure, a QR code, and a public verification page
- Revoke credentials when needed

### Issuer Access

- Issuance is open by default - any issuer can issue to your vault unless you block them
- Block specific issuers to stop them from issuing to you
- Unblock issuers to restore their access

### API Key Management

- Create and manage API keys for testnet and mainnet
- Standard role keys with 6-month expiration
- Integrate with the ACTA API

### Guided Onboarding

- Interactive guided tour on first visit
- Quick start guide with step-by-step instructions
- Contextual help throughout the application

### More

- **Notifications**: in-app notifications (e.g. when your vault receives a credential)
- **Languages**: English, Spanish, and French
- **Network switch**: change between testnet and mainnet at any time in Settings

## Getting Started

To start using the ACTA dApp:

1. **Connect your wallet and choose a network** - Freighter, Albedo, or WalletConnect; testnet or mainnet
2. **Create your API key** - required for vault and credential operations
3. **Register your issuer DID** - a did:stellar identity (needed to issue credentials)
4. **Create your vault** - Initialize your dedicated single-tenant credential vault
5. **Start issuing** - Create and manage credentials (the issuer pays an on-chain fee per credential)

See the [Getting Started Guide](#dapp-getting-started) for detailed instructions.

## Access the dApp

The ACTA dApp is available at the link below. **No installation required** - open it in your web browser and connect your Stellar wallet to get started.

:::dapp-open-cta:::
    `,
};
