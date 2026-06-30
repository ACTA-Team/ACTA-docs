import type { DocPage } from "@/@types/docs";

export const introduction: DocPage = {
  slug: "introduction",
  title: "Introduction",
  section: "Welcome",
  tocItems: [
    "Start here",
    "What you can build",
    "Common use cases",
    "Try it now",
  ],
  content: `
# Welcome

ACTA is **Verifiable Credentials Infrastructure** for **Stellar blockchain**. Build **non-custodial** credential flows with **issuance**, verification, and storage. Contracts run on **Stellar (Soroban)**. Your app drives them via API or SDK.

## Start here

| Topic | Description |
|-------|-------------|
| **Architecture** | System components, contracts, and data flow |
| **Getting Started** | Quick integration guide for API and SDK |
| **Credentials SDK** | \`npm i @acta-team/credentials\` - hooks for credential and vault operations |
| **API Reference** | Complete documentation of public API endpoints |
| **Links** | Official links, resources, and community |
| **Credential Flow** | Understanding issuance, verification, and storage flows |

## What you can build

- Issue and verify **[W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model-2.0/)** on-chain
- Store encrypted credentials in **user-controlled vaults**
- Add **programmable verification logic** to your app
- Support **revocation**, status checks, and credential transfers
- Configure **issuer authorization** per vault
- Launch faster without writing credential contracts from scratch

## Common use cases

- **Digital Identity**: Issue verifiable identity credentials
- **Education**: Academic certificates and diplomas
- **Professional**: Licenses, certifications, and memberships
- **Healthcare**: Medical records and vaccination certificates
- **Finance**: KYC/AML compliance credentials
- **Access Control**: Membership and authorization tokens

## Try it now

:::welcome-try-cta:::
    `,
};
