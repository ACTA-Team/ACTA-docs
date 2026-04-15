import type { DocPage, NavigationItems } from "@/@types/docs";

export type { DocPage, NavigationItems };

export const docsDataEn: Record<string, DocPage> = {
  // Welcome Section
  introduction: {
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
      | **React SDK** | Hooks for credential and vault operations |
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

- [Open dApp](https://dapp.acta.build/) - Explore the ACTA dApp
- [View GitHub](https://github.com/ACTA-Team) - Check the source code
- [Join Discord](https://discord.gg/DsUSE3aMDZ) - Connect with the community
    `,
  },
  architecture: {
    slug: "architecture",
    title: "Architecture",
    section: "Welcome",
    tocItems: [
      "System Components",
      "Issuance Contract",
      "Vault Contract",
      "API Layer",
      "Storage",
      "Identity Model",
      "Credential Flow",
      "Network Support",
    ],
    content: `
# Architecture

Technical overview of ACTA's system architecture and components.

## System Components

### Issuance Contract (Soroban)

Handles credential lifecycle on-chain:

- **Issue**: Creates new credentials and anchors hash on-chain
- **Verify**: Public verification of credential status
- **Revoke**: Revokes credentials with optional revocation date

Contract functions are exposed via API endpoints. See API Reference for details.

### Vault Contract (Soroban)

Multi-tenant credential storage repository:

- **Initialize**: Creates a new vault for a user
- **Store**: Stores encrypted credentials in the user's vault
- **List/Get**: Retrieves credential IDs and data
- **Verify**: Verifies credentials via issuance contract delegation
- **Authorization**: Manages issuer authorization lists

Each user has an isolated vault with independent admin controls and issuer authorization.

### API Layer

RESTful API providing:

- **Credential Operations**: Issue, verify, revoke
- **Vault Operations**: Store, retrieve, manage vaults
- **Transaction Preparation**: Generate unsigned XDR transactions for client-side signing
- **Read Operations**: Query credentials and vault state (no signature required)

All endpoints support both mainnet and testnet automatically via \`NETWORK_TYPE\` configuration.

### Storage

- **On-chain**: Credential hashes and status metadata (Soroban smart contracts)
- **Off-chain**: Encrypted credential payloads (user-controlled vaults)

## Identity Model 1.0

Uses DID:pkh format:

\`\`\`
did:pkh:stellar:{network}:{wallet_address}
\`\`\`

- **Network**: \`mainnet\` or \`testnet\`
- **Wallet Address**: Stellar public key (G...)

No additional identity infrastructure required - Stellar wallet keys serve as identity.

> **Note**: Version 1.0 is the first version in ACTA. Version 2.0 is currently being developed where the official Stellar DID will be used.

## Credential Flow

![Issuance Flow](/issuance-flow.png)

![Verification Flow](/credential-verifier.png)

## Network Support

ACTA automatically handles network configuration:

- **Testnet**: \`https://acta.build/api/testnet\` or \`NETWORK_TYPE=testnet\`
- **Mainnet**: \`https://acta.build/api/mainnet\` or \`NETWORK_TYPE=mainnet\`

Contract IDs, RPC URLs, and network passphrases are configured automatically based on network type.
    `,
  },
  "getting-started": {
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
npm install @acta-team/acta-sdk
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
  },
  links: {
    slug: "links",
    title: "Links",
    section: "Welcome",
    tocItems: ["Official", "Developer", "Social Media"],
    content: `
# Links

## Official

- **Website**: [https://acta.build](https://acta.build)
- **dApp**: [https://dapp.acta.build/](https://dapp.acta.build/)

## Developer

- **GitHub**: [https://github.com/ACTA-Team](https://github.com/ACTA-Team)
- **Discord**: [https://discord.gg/DsUSE3aMDZ](https://discord.gg/DsUSE3aMDZ)

## Social Media

- **X/Twitter**: [https://x.com/ActaXyz](https://x.com/ActaXyz)
- **LinkedIn**: [https://www.linkedin.com/company/acta-org](https://www.linkedin.com/company/acta-org)
- **Instagram**: [https://www.instagram.com/acta.xyz](https://www.instagram.com/acta.xyz)
    `,
  },

  // React SDK Section
  "sdk-overview": {
    slug: "sdk-overview",
    title: "Overview",
    section: "React SDK",
    tocItems: [
      "Exports",
      "Provider Setup",
      "Accessing the Client",
      "Hooks Summary",
    ],
    content: `
# React SDK Overview

React library exposing a provider, client access, and hooks for ACTA API and Soroban transactions. The network is inferred from the \`baseURL\`.

## Exports

- \`ActaConfig\` provider and \`useActaClient\` context accessor
- Hooks: \`useVault\`, \`useCredential\`, \`useVaultRead\`
- Base URLs: \`mainNet\` and \`testNet\`

## Provider Setup

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/acta-sdk";

export function App() {
  return (
    <ActaConfig baseURL={mainNet}>
      {/* your app */}
    </ActaConfig>
  );
}
\`\`\`

The API key is automatically read from environment variables:
- \`ACTA_API_KEY_MAINNET\` (for mainnet)
- \`ACTA_API_KEY_TESTNET\` (for testnet)
- \`ACTA_API_KEY\` (fallback for both networks)

## Accessing the Client

\`\`\`ts
import { useActaClient } from "@acta-team/acta-sdk";

const client = useActaClient();
const config = await client.getConfig();
// config: { rpcUrl, networkPassphrase, actaContractId }
\`\`\`

## Hooks Summary

- \`useVault\`: Vault operations - create vault, authorize issuer, revoke issuer
  - \`createVault\`: Initialize a vault for an owner
  - \`authorizeIssuer\`: Authorize an issuer in the vault
  - \`revokeIssuer\`: Revoke an authorized issuer from the vault

- \`useCredential\`: Credential operations - issue, issueLinked, and revoke
  - \`issue\`: Issue a credential (stores in vault and marks as valid)
  - \`issueLinked\`: Issue a credential linked to a parent VC
  - \`revoke\`: Revoke a credential

- \`useVaultRead\`: Vault read operations - list IDs, get VC, get VC parent, verify VC
  - \`listVcIds\`: List credential IDs owned by an owner
  - \`getVc\`: Get a credential from the vault
  - \`getVcParent\`: Get parent VC info for a linked credential
  - \`verifyVc\`: Verify the status of a credential in the vault
    `,
  },
  useCredential: {
    slug: "useCredential",
    title: "useCredential",
    section: "React SDK",
    tocItems: [
      "Function",
      "issue",
      "Arguments",
      "Signer Type",
      "Return Value",
      "Example",
      "issueLinked",
      "revoke",
      "Transaction Flow",
      "Notes",
    ],
    content: `
# useCredential

Hook for credential operations: issue, issueLinked, and revoke.

## Function

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
  issueLinked: (args: IssueLinkedArgs) => Promise<{ txId: string }>;
  revoke: (args: RevokeArgs) => Promise<{ txId: string }>;
}
\`\`\`

## issue

Issues a credential (stores it in the vault and marks it as valid).

### Arguments

\`\`\`ts
{
  owner: string;                    // Stellar public key of the credential owner (vault owner)
  vcId: string;                    // Unique credential identifier
  vcData: string | object;         // Credential data (JSON string or object). @context is added automatically
  issuer: string;                  // Stellar public key of the issuer
  holder: string;                  // Wallet address or DID of the holder (DID is built automatically from address)
  issuerDid?: string;              // Wallet address or DID of the issuer (DID is built automatically from address)
  signTransaction: Signer;         // Function that signs the unsigned XDR
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Signer Type

\`\`\`ts
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useCredential } from "@acta-team/acta-sdk";

const { issue } = useCredential();

const { txId } = await issue({
  owner: "G...",
  vcId: "credential-123",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:pkh:stellar:testnet:G...",
      name: "John Doe"
    }
  }),
  issuer: "G...",
  holder: "G...",        // wallet address — DID is built automatically
  issuerDid: "G...",     // wallet address — DID is built automatically
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## issueLinked

Issues a credential linked to a parent VC. The parent VC must exist and be valid in its vault. This enables hierarchical credential relationships.

### Arguments

\`\`\`ts
{
  owner: string;                    // Stellar public key of the credential owner (vault owner)
  vcId: string;                    // Unique credential identifier
  vcData: string | object;         // Credential data (JSON string or object). @context is added automatically
  issuer: string;                  // Stellar public key of the issuer
  holder: string;                  // Wallet address or DID of the holder (DID is built automatically from address)
  issuerDid?: string;              // Wallet address or DID of the issuer (DID is built automatically from address)
  signTransaction: Signer;         // Function that signs the unsigned XDR
  contractId?: string;             // Contract ID (optional, uses the configured default)
  parentOwner: string;             // Stellar public key of the parent VC owner
  parentVcId: string;              // Identifier of the parent VC
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useCredential } from "@acta-team/acta-sdk";

const { issueLinked } = useCredential();

const { txId } = await issueLinked({
  owner: "G...",
  vcId: "linked-credential-456",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:pkh:stellar:testnet:G...",
      name: "John Doe",
      certification: "Advanced Level"
    }
  }),
  issuer: "G...",
  holder: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  },
  parentOwner: "G...",             // Owner of the parent VC
  parentVcId: "credential-123"    // ID of the parent VC
});
\`\`\`

## revoke

Revokes a credential.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the credential owner
  vcId: string;                    // Unique identifier of the credential to revoke
  signTransaction: Signer;         // Function that signs the unsigned XDR
  date?: string;                   // Revocation date in ISO format (optional, uses current date by default)
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useCredential } from "@acta-team/acta-sdk";

const { revoke } = useCredential();

const { txId } = await revoke({
  owner: "G...",
  vcId: "credential-123",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  },
  date: new Date().toISOString() // Optional
});
\`\`\`

## Transaction Flow

All methods follow the same flow:

1. **Prepare**: Calls the API to get an unsigned XDR and the network passphrase
2. **Sign**: Uses \`signTransaction\` to sign the XDR with the provided passphrase
3. **Submit**: Sends the signed XDR to the API to be processed on the network

The hook automatically handles the distinction between prepare and submit responses using internal type guards.

## Notes

- The \`issue\` method automatically stores the credential in the vault and marks it as valid in a single transaction
- The \`revoke\` method requires the \`owner\` to sign the transaction
- The revocation date is automatically set to the current date if not provided
    `,
  },
  useVault: {
    slug: "useVault",
    title: "useVault",
    section: "React SDK",
    tocItems: [
      "Function",
      "createVault",
      "Arguments",
      "Signer Type",
      "Return Value",
      "Example",
      "authorizeIssuer",
      "revokeIssuer",
      "Transaction Flow",
    ],
    content: `
# useVault

Hook for vault operations: create vault, authorize issuer, revoke issuer.

## Function

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  authorizeIssuer: (args: AuthorizeIssuerArgs) => Promise<{ txId: string }>;
  revokeIssuer: (args: RevokeIssuerArgs) => Promise<{ txId: string }>;
}
\`\`\`

## createVault

Creates (initializes) a vault for an owner.

### Arguments

\`\`\`ts
{
  owner: string;                    // Stellar public key of the owner (G...)
  ownerDid: string;                  // DID URI associated with the owner
  signTransaction: Signer;          // Function that signs the unsigned XDR
  contractId?: string;              // Contract ID (optional, uses the configured default)
}
\`\`\`

### Signer Type

\`\`\`ts
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useVault } from "@acta-team/acta-sdk";

const { createVault } = useVault();

const { txId } = await createVault({
  owner: "G...",
  ownerDid: "did:stellar:G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## authorizeIssuer

Authorizes an issuer in a vault.

### Arguments

\`\`\`ts
{
  owner: string;                    // Stellar public key of the vault owner
  issuer: string;                   // Stellar public key of the issuer to authorize
  signTransaction: Signer;          // Function that signs the unsigned XDR
  contractId?: string;              // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useVault } from "@acta-team/acta-sdk";

const { authorizeIssuer } = useVault();

const { txId } = await authorizeIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## revokeIssuer

Revokes (removes) an authorized issuer from a vault.

### Arguments

\`\`\`ts
{
  owner: string;                    // Stellar public key of the vault owner
  issuer: string;                   // Stellar public key of the issuer to revoke
  signTransaction: Signer;          // Function that signs the unsigned XDR
  contractId?: string;              // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

- \`Promise<{ txId: string }>\`: Transaction ID after sending to the network

### Example

\`\`\`ts
import { useVault } from "@acta-team/acta-sdk";

const { revokeIssuer } = useVault();

const { txId } = await revokeIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
});
\`\`\`

## Transaction Flow

All methods follow the same flow:

1. **Prepare**: Calls the API to get an unsigned XDR and the network passphrase
2. **Sign**: Uses \`signTransaction\` to sign the XDR with the provided passphrase
3. **Submit**: Sends the signed XDR to the API to be processed on the network

The hook automatically handles the distinction between prepare and submit responses using internal type guards.
    `,
  },
  useVaultRead: {
    slug: "useVaultRead",
    title: "useVaultRead",
    section: "React SDK",
    tocItems: [
      "Function",
      "listVcIds",
      "Arguments",
      "Return Value",
      "Example",
      "getVc",
      "getVcParent",
      "verifyVc",
      "Notes",
    ],
    content: `
# useVaultRead

Hook for reading vault data: list credential IDs, get credentials, get parent VC info, verify credentials.

## Function

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
  getVcParent: (args: GetVcParentArgs) => Promise<{ owner: string; vc_id: string } | null>;
  verifyVc: (args: VerifyVcArgs) => Promise<VaultVerifyVcResponse>;
}
\`\`\`

## listVcIds

Lists credential IDs owned by an owner.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

- \`Promise<string[]>\`: Array of credential IDs

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { listVcIds } = useVaultRead();

const vcIds = await listVcIds({
  owner: "G..."
});
// vcIds: ["credential-1", "credential-2", ...]
\`\`\`

## getVc

Gets a credential from the vault.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner
  vcId: string;                    // Unique credential identifier
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

- \`Promise<unknown | null>\`: Credential data or \`null\` if not found

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { getVc } = useVaultRead();

const vc = await getVc({
  owner: "G...",
  vcId: "credential-123"
});

if (vc) {
  console.log("Credential found:", vc);
} else {
  console.log("Credential not found");
}
\`\`\`

## getVcParent

Gets the parent VC info for a linked credential. Returns \`null\` if the credential has no parent link.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner
  vcId: string;                    // Unique credential identifier
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

\`\`\`ts
Promise<{ owner: string; vc_id: string } | null>
\`\`\`

- Returns an object with the parent VC's \`owner\` address and \`vc_id\`, or \`null\` if the credential is not linked to a parent.

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { getVcParent } = useVaultRead();

const parent = await getVcParent({
  owner: "G...",
  vcId: "linked-credential-456"
});

if (parent) {
  console.log("Parent owner:", parent.owner);
  console.log("Parent VC ID:", parent.vc_id);
} else {
  console.log("This credential has no parent link");
}
\`\`\`

## verifyVc

Verifies the status of a credential in the vault.

### Arguments

\`\`\`ts
{
  owner: string;                   // Stellar public key of the owner
  vcId: string;                    // Unique credential identifier
  contractId?: string;             // Contract ID (optional, uses the configured default)
}
\`\`\`

### Return Value

\`\`\`ts
Promise<{
  status: "valid" | "revoked";
  since?: string;                  // ISO date since when it's been in that state (optional)
}>
\`\`\`

### Example

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { verifyVc } = useVaultRead();

const verification = await verifyVc({
  owner: "G...",
  vcId: "credential-123"
});

console.log(\`Status: \${verification.status}\`); // "valid" or "revoked"
if (verification.since) {
  console.log(\`Since: \${verification.since}\`);
}
\`\`\`

## Notes

- All these operations are **read-only** and do not require signing transactions
- Methods automatically handle different API response formats
- \`getVc\` returns \`null\` if the credential does not exist in the vault
- \`getVcParent\` returns \`null\` if the credential has no parent link
- \`verifyVc\` always returns a result with the current status of the credential
    `,
  },

  // API Reference Section
  "api-overview": {
    slug: "api-overview",
    title: "Overview",
    section: "API Reference",
    tocItems: [
      "Base URLs",
      "Authentication",
      "Request Format",
      "Response Format",
      "Prepare/Submit Flow",
      "Error Handling",
      "Rate Limiting",
      "Try it in Postman",
    ],
    content: `
# API Reference Overview

RESTful API for ACTA credential management on Stellar blockchain. All endpoints support both mainnet and testnet networks.

## Base URLs

**Testnet:**

\`\`\`
https://acta.build/api/testnet
\`\`\`

**Mainnet:**

\`\`\`
https://acta.build/api/mainnet
\`\`\`

## Authentication

Only **credential issuance** (\`POST /contracts/vc/issue\`), **linked credential issuance** (\`POST /contracts/vc/issue-linked\`), and **admin endpoints** require an API key. Vault operations (create, read, authorize, revoke, set-new-owner), contract version (\`GET /contracts/version\`), and credential revocation (\`POST /contracts/vc/revoke\`) do not require authentication.

When required, send the API key in the request header:

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

### Getting an API Key

You can create a public API key (standard role, expires in 6 months) via:

- **POST** \`/public/api-keys\` on the network base URL (e.g. \`https://acta.build/api/testnet/public/api-keys\` or \`https://acta.build/api/mainnet/public/api-keys\`)

No authentication required, but rate limited to 5 requests per minute per IP.

## Request Format

All requests use JSON format. Content-Type header should be \`application/json\`.

### Write Operations (Prepare/Submit)

Write operations support two modes:

1. **Prepare**: Send request without \`signedXdr\` → returns unsigned XDR
2. **Submit**: Send request with \`signedXdr\` → executes the transaction

Example prepare request:

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "...",
  "issuer": "G...",
  "sourcePublicKey": "G..."
}
\`\`\`

Example submit request:

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

## Response Format

### Success Response

Prepare mode returns unsigned XDR + network passphrase:

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

Submit mode returns the transaction ID:

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

### Error Response

\`\`\`json
{
  "error": "error_code",
  "message": "Human readable error message"
}
\`\`\`

## Prepare/Submit Flow

1. **Prepare**: Call endpoint with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Call the same endpoint with \`signedXdr\` to execute

## Error Handling

All errors return JSON with:
- \`error\`: Error code identifier
- \`message\`: Human-readable error description

Common HTTP status codes:
- \`200\`: Success
- \`400\`: Bad request (invalid parameters)
- \`401\`: Unauthorized (missing or invalid API key)
- \`403\`: Forbidden (insufficient permissions)
- \`404\`: Not found
- \`429\`: Rate limit exceeded
- \`500\`: Internal server error

## Rate Limiting

- Public API key creation: 5 requests per minute per IP
- Authenticated endpoints: Rate limits may apply based on API key tier
- Rate limit headers included in responses:
  - \`X-RateLimit-Limit\`: Maximum requests allowed
  - \`X-RateLimit-Remaining\`: Remaining requests in window
  - \`X-RateLimit-Reset\`: Unix timestamp when limit resets

## Try it in Postman

Want to test the ACTA API right away? We have a public Postman collection with all the endpoints pre-configured and ready to use.

1. Open the [ACTA Postman Collection](https://www.postman.com/acta-xyz-1193247/workspace/acta-team/collection/52380013-1a09da17-4bee-4267-b469-610c46969235?action=share&creator=52380013&active-environment=52380013-785bdf1a-3108-4c33-808c-76e31ee3b67f)
2. **Fork the collection** into your own Postman workspace
3. Select the environment (**testnet** or **mainnet**)
4. Start making requests!

> Forking lets you keep a personal copy you can customize, and still pull updates when we add new endpoints.
    `,
  },
  "api-health-status": {
    slug: "api-health-status",
    title: "Health & Status",
    section: "API Reference",
    tocItems: ["Health Check", "Network Configuration"],
    content: `
# Health & Status Endpoints

Endpoints for checking API health and retrieving network configuration.

## Health Check

### GET /health

Checks the API status. No authentication required.

**Response:**

\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

**Example:**

\`\`\`bash
curl https://acta.build/api/testnet/health
\`\`\`

## Network Configuration

### GET /config

Gets public network configuration (RPC URL, passphrase, contract ID). Requires API key.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Response:**

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "actaContractId": "C..."
}
\`\`\`

**Example:**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" https://acta.build/api/testnet/config
\`\`\`
    `,
  },
  "api-keys": {
    slug: "api-keys",
    title: "API Keys",
    section: "API Reference",
    tocItems: [
      "Create Testnet API Key",
      "Create Mainnet API Key",
      "Request Body",
      "Response",
      "Rate Limiting",
    ],
    content: `
# API Keys Endpoints

Public endpoint for creating API keys. No authentication required, but rate limited.

> **Note:** You can also request API keys directly from the [ACTA dApp](https://dapp.acta.build/). The dApp provides a user-friendly interface to create and manage your API keys.

## Create API Key

### POST /public/api-keys

Creates an API key (standard role, expires in 6 months). Use the **testnet** or **mainnet** base URL depending on the network you need.

- Testnet: \`https://acta.build/api/testnet/public/api-keys\`
- Mainnet: \`https://acta.build/api/mainnet/public/api-keys\`

**Rate Limit:** 5 requests per minute per IP

**Request Body:**

\`\`\`json
{
  "name": "My API Key",
  "wallet_address": "G...",
  "metadata": {
    "network": "testnet"
  }
}
\`\`\`

Include \`metadata.network\`: \`"testnet"\` or \`"mainnet"\` to match the API base URL you are calling.

**Response:**

\`\`\`json
{
  "message": "API key created successfully. Save this key - it will not be shown again.",
  "api_key": "acta_...",
  "api_key_record": {
    "id": "uuid",
    "name": "My API Key",
    "role": "standard",
    "is_active": true,
    "expires_at": "2024-07-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

**Example (testnet):**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Testnet Key",
    "wallet_address": "G...",
    "metadata": {
      "network": "testnet"
    }
  }'
\`\`\`

**Example (mainnet):**

\`\`\`bash
curl -X POST https://acta.build/api/mainnet/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Mainnet Key",
    "wallet_address": "G...",
    "metadata": {
      "network": "mainnet"
    }
  }'
\`\`\`

## Request Body

- \`name\` (optional): Name for the API key (max 120 chars)
- \`wallet_address\` (optional): Stellar wallet address (G...)
- \`metadata\` (optional): Additional metadata object
  - \`network\` (required): "testnet" or "mainnet"

## Response

- \`api_key\`: The API key string (save this - it won't be shown again)
- \`api_key_record\`: Metadata about the created key

## Rate Limiting

- Maximum 5 requests per minute per IP address
- Rate limit headers included in response:
  - \`X-RateLimit-Limit\`: 5
  - \`X-RateLimit-Remaining\`: Remaining requests
  - \`X-RateLimit-Reset\`: Unix timestamp when limit resets

**Note:** API key creation via these endpoints is only allowed from \`dapp.acta.build\` origin. For the easiest experience, we recommend using the [ACTA dApp](https://dapp.acta.build/) to create and manage your API keys.
    `,
  },
  "api-contract-info": {
    slug: "api-contract-info",
    title: "Contract Info",
    section: "API Reference",
    tocItems: ["Get Contract Version", "Query Parameters", "Response"],
    content: `
# Contract Info Endpoints

Endpoints for retrieving contract information.

## Get Contract Version

### GET /contracts/version

Returns the ACTA contract version string. No authentication required.

**Query Parameters:**

- \`contractId\` (optional): Override contract ID (C...)
- \`sourcePublicKey\` (required): An existing Stellar account (G...) used for Soroban simulation

**Response:**

\`\`\`json
{
  "version": "1.0.0"
}
\`\`\`

**Example:**

\`\`\`bash
curl "https://acta.build/api/testnet/contracts/version?sourcePublicKey=G..."
\`\`\`

## Query Parameters

- **contractId** (optional): Override the default ACTA contract ID
- **sourcePublicKey** (required): Stellar public key (G...) used for contract simulation

## Response

- **version**: Contract version string
    `,
  },
  "api-vault-read": {
    slug: "api-vault-read",
    title: "Vault Operations (Read)",
    section: "API Reference",
    tocItems: [
      "List VC IDs",
      "Get VC",
      "Get VC Parent",
      "Verify VC",
      "Request Body",
      "Responses",
    ],
    content: `
# Vault Operations (Read)

Read-only operations for vault data. No authentication required.

## List VC IDs

### POST /contracts/vault/list-vc-ids

Lists verifiable credential (VC) IDs stored in an owner's vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "contractId": "C..."
}
\`\`\`

**Response:**

\`\`\`json
["credential-1", "credential-2", "credential-3"]
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/list-vc-ids \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## Get VC

### POST /contracts/vault/get-vc

Gets a specific verifiable credential from a vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "contractId": "C..."
}
\`\`\`

**Response:**

\`\`\`json
{
  "vcData": {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": "did:pkh:stellar:testnet:G...",
      "name": "John Doe"
    }
  }
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/get-vc \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Get VC Parent

### POST /contracts/vault/get-vc-parent

Gets the parent VC info for a linked credential. Returns \`null\` if the credential has no parent link. No authentication required.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "linked-credential-456",
  "contractId": "C..."
}
\`\`\`

**Response (with parent):**

\`\`\`json
{
  "parent": {
    "owner": "G...",
    "vc_id": "credential-123"
  }
}
\`\`\`

**Response (no parent):**

\`\`\`json
{
  "parent": null
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/get-vc-parent \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "linked-credential-456"
  }'
\`\`\`

## Verify VC

### POST /contracts/vault/verify-vc

Verifies a VC by checking it exists in the owner's vault and returning its issuance status.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "contractId": "C..."
}
\`\`\`

**Response:**

\`\`\`json
{
  "status": "valid",
  "since": "2024-01-01T00:00:00.000Z"
}
\`\`\`

Or if revoked:

\`\`\`json
{
  "status": "revoked",
  "since": "2024-01-15T00:00:00.000Z"
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/verify-vc \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Request Body

All endpoints require:
- **owner** (required): Vault owner address (G...)
- **vcId** (required for get-vc, get-vc-parent, and verify-vc): Credential identifier
- **contractId** (optional): Override ACTA contract ID (C...)

## Responses

- **List VC IDs**: Array of credential ID strings
- **Get VC**: Credential data object or null if not found
- **Verify VC**: Status object with \`status\` ("valid" | "revoked") and optional \`since\` timestamp
    `,
  },
  "api-vault-write": {
    slug: "api-vault-write",
    title: "Vault Operations (Write)",
    section: "API Reference",
    tocItems: [
      "Create Vault",
      "Authorize Issuer",
      "Authorize Issuers (Multiple)",
      "Revoke Issuer",
      "Revoke Vault",
      "Set New Owner",
      "Migrate",
      "Create Sponsored Vault",
      "Prepare/Submit Flow",
    ],
    content: `
# Vault Operations (Write)

Write operations for vault management. All endpoints support prepare/submit flow. No authentication required.

## Create Vault

### POST /contracts/vault/create

Creates (initializes) a vault for an owner.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Request Body (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Authorize Issuer

### POST /contracts/vault/authorize-issuer

Adds a single authorized issuer to an owner's vault.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Authorize Issuers (Multiple)

### POST /contracts/vault/authorize-issuers

Replaces the full authorized issuer list for a vault with the given array.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuers": ["G...", "G...", "G..."],
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Revoke Issuer

### POST /contracts/vault/revoke-issuer

Revokes an issuer's authorization from a vault.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Revoke Vault

### POST /contracts/vault/revoke-vault

Completely revokes a vault.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Set New Owner

### POST /contracts/vault/set-new-owner

Sets the new vault owner (vault admin). Must be signed by the current owner.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "new_owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Migrate

### POST /contracts/vault/migrate

Migrates legacy vault data for an owner to the current format.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Request Body (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Create Sponsored Vault

### POST /contracts/sponsored-vault/create

Creates a sponsored vault for an owner. A sponsor pays for the vault creation on behalf of the owner. No authentication required.

**Request Body (Prepare):**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Request Body (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

**Parameters:**
- **sponsor** (required): Sponsor address that pays for vault creation (G...)
- **owner** (required): Vault owner address (G...)
- **didUri** (required): DID URI of the vault owner
- **sourcePublicKey** (required): Transaction source that will sign (must be sponsor)
- **contractId** (optional): Override ACTA contract ID (C...)

## Prepare/Submit Flow

All write endpoints follow the same pattern:

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Send request with \`signedXdr\` to execute

**Common Parameters:**
- **owner** (required): Vault owner address (G...)
- **sourcePublicKey** (required): Transaction source that will sign (must be authorized signer)
- **contractId** (optional): Override ACTA contract ID (C...)
    `,
  },
  "api-credentials": {
    slug: "api-credentials",
    title: "Credential Operations",
    section: "API Reference",
    tocItems: [
      "Issue Credential",
      "Issue Linked Credential",
      "Revoke Credential",
      "Request Body",
      "Prepare/Submit Flow",
    ],
    content: `
# Credential Operations

Endpoints for issuing and revoking verifiable credentials. All support prepare/submit flow. **Issue Credential** (\`POST /contracts/vc/issue\`) and **Issue Linked Credential** (\`POST /contracts/vc/issue-linked\`) require an API key; **Revoke Credential** does not require authentication.

## Issue Credential

### POST /contracts/vc/issue

Issues a VC: stores payload in the owner's vault and writes issuance status = valid. **Requires API key.**

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:pkh:stellar:testnet:G...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "holder": "did:pkh:stellar:testnet:G...",
  "issuerDid": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Request Body (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

**Example:**

\`\`\`bash
# Prepare
curl -X POST https://acta.build/api/testnet/contracts/vc/issue \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "holder": "did:pkh:stellar:testnet:G...",
    "sourcePublicKey": "G..."
  }'

# Submit (after signing)
curl -X POST https://acta.build/api/testnet/contracts/vc/issue \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Issue Linked Credential

### POST /contracts/vc/issue-linked

Issues a VC linked to a parent VC: stores payload in the owner's vault with a reference to the parent credential. The parent VC must exist and be valid. **Requires API key.**

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "linked-credential-456",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:pkh:stellar:testnet:G...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "holder": "did:pkh:stellar:testnet:G...",
  "issuerDid": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C...",
  "parentOwner": "G...",
  "parentVcId": "credential-123"
}
\`\`\`

**Request Body (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

**Example:**

\`\`\`bash
# Prepare
curl -X POST https://acta.build/api/testnet/contracts/vc/issue-linked \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "linked-credential-456",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "holder": "did:pkh:stellar:testnet:G...",
    "sourcePublicKey": "G...",
    "parentOwner": "G...",
    "parentVcId": "credential-123"
  }'

# Submit (after signing)
curl -X POST https://acta.build/api/testnet/contracts/vc/issue-linked \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Revoke Credential

### POST /contracts/vc/revoke

Revokes a VC by ID. No authentication required.

**Request Body (Prepare):**

\`\`\`json
{
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Request Body (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Response (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Request Body

### Issue Credential

- **owner** (required): Vault owner address (G...)
- **vcId** (required): Credential identifier
- **vcData** (required): Credential data payload (JSON string). Must include \`@context\` with at least \`"https://www.w3.org/ns/credentials/v2"\`
- **issuer** (required): Issuer address (G...)
- **holder** (required): DID of the credential holder in format \`did:pkh:stellar:{network}:{address}\`
- **issuerDid** (optional): DID of the issuer in format \`did:pkh:stellar:{network}:{address}\`
- **sourcePublicKey** (required): Transaction source that will sign (must be issuer)
- **contractId** (optional): Override ACTA contract ID (C...)

### Issue Linked Credential

- **owner** (required): Vault owner address (G...)
- **vcId** (required): Credential identifier
- **vcData** (required): Credential data payload (JSON string). Must include \`@context\` with at least \`"https://www.w3.org/ns/credentials/v2"\`
- **issuer** (required): Issuer address (G...)
- **holder** (required): DID of the credential holder in format \`did:pkh:stellar:{network}:{address}\`
- **issuerDid** (optional): DID of the issuer in format \`did:pkh:stellar:{network}:{address}\`
- **sourcePublicKey** (required): Transaction source that will sign (must be issuer)
- **contractId** (optional): Override ACTA contract ID (C...)
- **parentOwner** (required): Parent VC owner address (G...)
- **parentVcId** (required): Parent VC identifier

### Revoke Credential

- **vcId** (required): Credential identifier
- **date** (optional): ISO-8601 timestamp (default: now)
- **sourcePublicKey** (required): Transaction source that will sign (must be VC owner or contract admin)
- **contractId** (optional): Override ACTA contract ID (C...)

## Prepare/Submit Flow

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Send request with \`signedXdr\` to execute

**Note:** The \`issue\` endpoint automatically stores the credential in the vault and marks it as valid in a single transaction.
    `,
  },
  // dApp Section
  "dapp-overview": {
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
  },
  "dapp-getting-started": {
    slug: "dapp-getting-started",
    title: "Getting Started",
    section: "dApp",
    tocItems: [
      "Step 1: Connect Wallet",
      "Step 2: Create Vault",
      "Step 3: Authorize Issuers",
      "Step 4: Issue Credentials",
      "Next Steps",
    ],
    content: `
# Getting Started with ACTA dApp

Follow these steps to start using the ACTA dApp for credential management.

## Step 1: Connect Wallet and Choose Network

The first step is to connect your Stellar wallet to the dApp.

1. Visit [https://dapp.acta.build](https://dapp.acta.build)
2. Click on the wallet connection button
3. Select your Stellar wallet (Freighter, WalletConnect, etc.)
4. Approve the connection request
5. Choose your network:
   - **Testnet** - For testing and development
   - **Mainnet** - For production use

Once connected, your wallet address will be displayed in the header.

## Step 2: Create Your Personal Vault

Your vault is your secure storage for credentials. Each wallet address has its own isolated vault.

1. Navigate to the **Dashboard** or **Vault** section
2. If you don't have a vault yet, you'll see an option to create one
3. Click **Create Vault** or **Initialize Vault**
4. Sign the transaction with your wallet
5. Your vault is now ready to store credentials

The vault creation is a one-time operation per wallet address.

## Step 3: Authorize Issuers

Before you can receive credentials, you need to authorize wallets that can issue credentials to your vault.

1. Go to the **Authorize** section in the sidebar
2. Enter the wallet address of the issuer you want to authorize
3. Click **Authorize Issuer**
4. Sign the transaction with your wallet
5. The authorized issuer will appear in your authorized issuers list

**Note:** Only authorized issuers can create credentials in your vault. This gives you control over who can issue credentials to you.

## Step 4: Issue Credentials

Once you have a vault and authorized issuers, you can start issuing credentials.

1. Navigate to the **Issue** section
2. Fill in the credential form:
   - **Credential ID** - Unique identifier
   - **Credential Data** - The actual credential information (JSON format)
   - **Owner** - The wallet address that will receive the credential
   - **Issuer DID** (optional) - Your issuer DID
3. Click **Issue Credential**
4. Sign the transaction with your wallet
5. The credential will be stored in the owner's vault and marked as valid

The credential is now on-chain and can be verified by anyone.

## Next Steps

After completing the initial setup:

- **View Credentials** - Go to the **Vault** or **Credentials** section to see all your credentials
- **Share Credentials** - Use the share feature to create shareable links with ZK proofs
- **Manage API Keys** - Create API keys for programmatic access in the **API Keys** section
- **Explore Tutorials** - Check out the **Tutorials** section for guided walkthroughs

For more information about specific features, see the [dApp Features](#dapp-features) guide.
    `,
  },
  "dapp-features": {
    slug: "dapp-features",
    title: "Features",
    section: "dApp",
    tocItems: [
      "Issue Credentials",
      "Vault Management",
      "Share Credentials",
      "Authorize Issuers",
      "API Key Management",
      "Zero-Knowledge Proofs",
    ],
    content: `
# dApp Features

Detailed overview of all features available in the ACTA dApp.

## Issue Credentials

Create and issue verifiable credentials to any Stellar wallet address.

### How to Issue

1. Navigate to **Issue** in the sidebar
2. Fill in the credential form:
   - **Credential ID**: Unique identifier for the credential
   - **Credential Data**: JSON data containing the credential information
   - **Owner**: Stellar wallet address (G...) that will receive the credential
   - **Issuer DID** (optional): Your DID identifier
3. Click **Issue Credential**
4. Sign the transaction

The credential is automatically:
- Stored in the owner's vault
- Marked as valid on-chain
- Available for verification

## Vault Management

Your vault is your personal credential storage. Each wallet has an isolated vault.

### View Credentials

1. Go to **Vault** or **Credentials** section
2. See all credentials stored in your vault
3. Use search and filters to find specific credentials
4. Click on a credential to view details

### Credential Actions

- **View Details** - See full credential information
- **Share** - Create a shareable link with selective field disclosure
- **Revoke** - Revoke a credential if needed
- **Verify** - Check the on-chain status

## Share Credentials

Share credentials with privacy-preserving zero-knowledge proofs.

### Sharing Flow

1. Go to your **Vault** and select a credential
2. Click **Share** button
3. Choose which fields to reveal
4. Select a ZK predicate (optional):
   - Age ≥ 18
   - Not expired
   - Status is valid
5. Click **Generate ZK Proof**
6. Copy the share link

The share link contains:
- Only the selected revealed fields
- ZK proof for the selected predicate
- Public signals for verification

Recipients can verify the proof without seeing your private data.

## Authorize Issuers

Control who can issue credentials to your vault.

### Authorize an Issuer

1. Go to **Authorize** section
2. Enter the wallet address of the issuer
3. Click **Authorize Issuer**
4. Sign the transaction

### Manage Authorized Issuers

- View all authorized issuers
- Revoke authorization if needed
- Only authorized issuers can create credentials in your vault

## API Key Management

Create and manage API keys for programmatic access to the ACTA API.

### Create API Key

1. Navigate to **API Keys** section
2. Choose network (Testnet or Mainnet)
3. Enter a name for your API key (optional)
4. Click **Create API Key**
5. **Save the key immediately** - it won't be shown again

API keys have:
- **Standard role** - Access to public endpoints
- **6-month expiration** - Keys expire after 6 months
- **Network-specific** - Separate keys for testnet and mainnet

### Use API Keys

Use your API key in API requests:

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

See the [API Reference](#api-overview) for all available endpoints.

## Zero-Knowledge Proofs

The dApp supports sharing credentials with zero-knowledge proofs for privacy-preserving verification. See the [Zero-Knowledge Proofs](#zk-overview) section for detailed information about ZK circuits, predicates, and verification.
    `,
  },
  // Zero-Knowledge Proofs Section
  "zk-overview": {
    slug: "zk-overview",
    title: "Overview",
    section: "Zero-Knowledge Proofs",
    tocItems: [
      "What are Zero-Knowledge Proofs?",
      "How ZK Proofs Work in ACTA",
      "Key Benefits",
      "Architecture",
    ],
    content: `
# Zero-Knowledge Proofs Overview

ACTA supports zero-knowledge proofs (ZK) that allow you to prove credential predicates without revealing private data. This enables privacy-preserving credential sharing and verification.

## What are Zero-Knowledge Proofs?

Zero-knowledge proofs are cryptographic protocols that allow one party (the prover) to prove to another party (the verifier) that a statement is true without revealing any information beyond the validity of the statement itself.

In the context of ACTA:
- **Prover**: The credential holder who wants to prove something about their credential
- **Verifier**: The party who needs to verify the proof (e.g., a service requiring age verification)
- **Statement**: A predicate about the credential (e.g., "age ≥ 18", "not expired", "status is valid")

## How ZK Proofs Work in ACTA

1. **Credential Holder** selects which fields to reveal and chooses a predicate to prove
2. **Proof Generation** happens client-side using Noir circuits and bb.js
3. **Share Link** is created containing the revealed fields and the ZK proof
4. **Verification** happens on-chain via Soroban smart contracts (Protocol 25)

### Generation vs Verification

- **Generation**: Client-side in the browser using Noir and bb.js
- **Verification**: On-chain via Soroban ZK verifier contract
- **Replay Protection**: Uses nullifiers to prevent proof reuse

## Key Benefits

### Privacy

- Only selected fields are revealed to verifiers
- Private data (like exact age or expiration date) remains hidden
- Selective disclosure gives you control over what information to share

### Security

- Cryptographic proofs are mathematically verifiable
- No need to trust a third party
- On-chain verification ensures proof integrity
- Nullifiers prevent replay attacks

### Flexibility

- Multiple predicate types available
- Can combine with selective field disclosure
- Works with any credential structure

## Architecture

### Components

1. **Noir Circuits** - Define the logic for each predicate
   - Written in Noir language
   - Compiled to ACIR (Abstract Circuit Intermediate Representation)
   - Served as JSON files from the dApp

2. **Proof Generation** - Client-side using:
   - \`@noir-lang/noir_js\` - Noir JavaScript bindings
   - \`@aztec/bb.js\` - Barretenberg backend for proof generation

3. **Proof Verification** - On-chain via:
   - Soroban ZK verifier contract
   - Protocol 25 support for ZK verification
   - Verification keys (vk) stored in contract

### Flow

![Client Flow](/client-flow.png)

![Verifier Flow](/verifier-flow.png)

See the [Circuits](#zk-circuits) section for detailed information about available predicates and their implementation.
    `,
  },
  "zk-circuits": {
    slug: "zk-circuits",
    title: "Circuits",
    section: "Zero-Knowledge Proofs",
    tocItems: [
      "Age ≥ 18 (isAdult)",
      "Not Expired (notExpired)",
      "Status is Valid (isValid)",
      "Circuit Structure",
      "ACIR Artifacts",
    ],
    content: `
# ZK Circuits

ACTA uses Noir circuits to define ZK proof predicates. Each circuit is compiled to ACIR (Abstract Circuit Intermediate Representation) and used for proof generation and verification.

## Age ≥ 18 (isAdult)

Proves that a person is at least 18 years old without revealing their exact age.

### Circuit Code

\`\`\`rust
fn main(age: u8) {
    assert(age > 18);
}
\`\`\`

### Inputs

- **Private Input**: \`age: u8\` - The person's age (not revealed)

### Output

- **Public Output**: \`bool\` → \`true\` if \`age >= 18\`, otherwise the circuit fails

### How It Works

1. Extract birth date from credential
2. Calculate age from birth date to current date
3. Pass age to circuit as private input
4. Circuit asserts \`age > 18\`
5. Generate proof without revealing the actual age value

### Use Cases

- Age verification for age-restricted services
- Compliance with legal age requirements
- Privacy-preserving age checks

### ACIR Artifact

\`\`\`
noir_workshop.json
\`\`\`

## Not Expired (notExpired)

Proves that a credential has not expired without revealing the expiration date.

### Circuit Code

\`\`\`rust
fn main(expiry_ts: u64, now_ts: u64) {
    assert(expiry_ts > now_ts);
}
\`\`\`

### Inputs

- **Private Inputs**: 
  - \`expiry_ts: u64\` - Expiration timestamp in milliseconds (not revealed)
  - \`now_ts: u64\` - Current timestamp in milliseconds (computed off-chain)

### Output

- **Public Output**: \`bool\` → \`true\` if \`expiry_ts > now_ts\`, otherwise the circuit fails

### How It Works

1. Extract expiration date from credential
2. Get current timestamp (computed off-chain)
3. Pass both timestamps to circuit as private inputs
4. Circuit asserts \`expiry_ts > now_ts\`
5. Generate proof without revealing the actual expiration date

### Use Cases

- Verify credential is still valid
- Check if credential hasn't expired
- Time-based access control

### ACIR Artifact

\`\`\`
noir_not_expired.json
\`\`\`

## Status is Valid (isValid)

Proves that a credential has a valid status without revealing other status details.

### Circuit Code

\`\`\`rust
fn main(valid: Field) {
    assert(valid == 1);
}
\`\`\`

### Inputs

- **Private Input**: \`valid: Field\` - Status flag (1 for valid, 0 for invalid)

### Output

- **Public Output**: \`bool\` → \`true\` if \`valid == 1\`, otherwise the circuit fails

### How It Works

1. Extract status from credential
2. Convert status to flag: \`status === 'valid' ? 1 : 0\`
3. Pass flag to circuit as private input
4. Circuit asserts \`valid == 1\`
5. Generate proof without revealing other status information

### Use Cases

- Verify credential is not revoked
- Check credential state
- Status-based authorization

### ACIR Artifact

\`\`\`
noir_valid_status.json
\`\`\`

## Circuit Structure

All circuits follow a similar structure:

1. **Input Definition** - Private inputs that won't be revealed
2. **Assertion Logic** - The condition to prove
3. **Compilation** - Compiled to ACIR JSON format
4. **Deployment** - ACIR files served from \`public/zk/\` directory

### Compilation

Circuits are compiled using \`nargo\`:

\`\`\`bash
nargo compile
\`\`\`

This generates the ACIR JSON file in \`target/\` directory.

## ACIR Artifacts

ACIR (Abstract Circuit Intermediate Representation) files are the compiled circuits:

- \`noir_workshop.json\` - Age ≥ 18 circuit
- \`noir_not_expired.json\` - Not expired circuit
- \`noir_valid_status.json\` - Status is valid circuit

These files are:
- Loaded by the dApp from \`public/zk/\` directory
- Used for proof generation in the browser
- Referenced by the on-chain verifier contract

### Publishing Circuits

To publish a circuit for use in the dApp:

1. Compile the circuit: \`nargo compile\`
2. Copy ACIR JSON to \`dApp-ACTA/public/zk/\`
3. The dApp will load it automatically

See the [zk-test repository](https://github.com/ACTA-Team/zk-test) for circuit source code and compilation instructions.
    `,
  },
  "zk-generation": {
    slug: "zk-generation",
    title: "Proof Generation",
    section: "Zero-Knowledge Proofs",
    tocItems: [
      "Overview",
      "Generation Process",
      "Input Preparation",
      "Circuit Execution",
      "Proof Artifacts",
      "Integration in dApp",
    ],
    content: `
# ZK Proof Generation

ZK proofs in ACTA are generated client-side in the browser using Noir circuits and bb.js backend.

## Overview

Proof generation happens entirely in the user's browser:
- No data is sent to servers during generation
- Private inputs remain private
- Proofs are generated using cryptographic libraries

### Technologies

- **Noir** - Circuit language and JavaScript bindings (\`@noir-lang/noir_js\`)
- **bb.js** - Barretenberg backend (\`@aztec/bb.js\`) for proof generation
- **ACIR** - Compiled circuit representation loaded from JSON files

## Generation Process

### Step 1: Select Fields and Predicate

When sharing a credential in the dApp:

1. **Select Fields to Reveal**
   - Choose which credential fields should be visible
   - Other fields remain private

2. **Choose ZK Predicate**
   - Select from available predicates:
     - \`isAdult\` - Age ≥ 18
     - \`notExpired\` - Credential not expired
     - \`isValid\` - Status is valid

### Step 2: Input Preparation

The dApp extracts and prepares inputs based on the selected predicate:

#### For \`isAdult\`:

\`\`\`typescript
// Extract birth date from credential
const dob = credential.birthDate;
const ageYears = calculateAge(dob);

// Input: { age: ageYears }
\`\`\`

#### For \`notExpired\`:

\`\`\`typescript
// Extract expiration and current timestamp
const expiry_ts = Date.parse(credential.expirationDate);
const now_ts = Date.now();

// Input: { expiry_ts, now_ts }
\`\`\`

#### For \`isValid\`:

\`\`\`typescript
// Convert status to flag
const valid = credential.status === 'valid' ? '1' : '0';

// Input: { valid }
\`\`\`

### Step 3: Circuit Execution

1. **Load ACIR** - Fetch the circuit JSON from \`public/zk/\`
2. **Initialize Noir** - Create Noir instance with ACIR
3. **Initialize Backend** - Create bb.js backend
4. **Execute Circuit** - Run circuit with private inputs
5. **Generate Witness** - Create witness from execution result

\`\`\`typescript
const { Noir } = await import('@noir-lang/noir_js');
const { UltraHonkBackend } = await import('@aztec/bb.js');

// Load ACIR
const acir = await fetch('/zk/noir_workshop.json').then(r => r.json());

// Initialize
const noir = new Noir(acir);
const backend = new UltraHonkBackend(acir.bytecode);

// Execute
const execRes = await noir.execute({ age: ageYears });

// Generate proof
const proofData = await backend.generateProof(execRes.witness);
\`\`\`

### Step 4: Proof Artifacts

The generation produces:

- **Proof** - The cryptographic proof (base64 encoded)
- **Public Inputs** - Public signals that are part of the proof
- **Statement** - Metadata about the predicate and revealed fields

\`\`\`typescript
{
  proof: string,           // Base64 encoded proof
  publicInputs: string[],  // Public signals
  statement: {
    kind: 'isAdult' | 'notExpired' | 'isValid',
    selectedKeys: string[],
    // ... predicate-specific parameters
  }
}
\`\`\`

## Proof Artifacts

### Proof Structure

The proof is a JSON object containing:

\`\`\`json
{
  "publicInputs": ["..."],
  "proof": "base64_encoded_proof_bytes"
}
\`\`\`

### Public Inputs

Public inputs are values that are part of the proof but don't reveal private data:
- For \`isAdult\`: Empty (age is private)
- For \`notExpired\`: Empty (timestamps are private)
- For \`isValid\`: Empty (status flag is private)

### Statement Metadata

The statement contains:
- \`kind\` - Predicate type
- \`selectedKeys\` - Fields that were revealed
- Predicate-specific parameters (for reference, not part of proof)

## Integration in dApp

The proof generation is integrated in the dApp's share flow:

1. User selects credential to share
2. Chooses fields to reveal
3. Selects ZK predicate
4. Clicks **Generate ZK Proof**
5. Proof is generated client-side
6. Share link is created with proof included

### Code Location

- **Generation logic (\`zk.ts\`)**: [View on GitHub](https://github.com/ACTA-Team/dApp-ACTA/blob/develop/src/lib/zk.ts)
- **Integration (\`useShareCredential.ts\`)**: [View on GitHub](https://github.com/ACTA-Team/dApp-ACTA/blob/develop/src/components/modules/credentials/hooks/useShareCredential.ts)

### Security Notes

- All generation happens client-side
- Private inputs never leave the browser
- Proofs are cryptographically secure
- No server-side processing required
    `,
  },
  "zk-verification": {
    slug: "zk-verification",
    title: "Proof Verification",
    section: "Zero-Knowledge Proofs",
    tocItems: [
      "Overview",
      "On-Chain Verification",
      "Verification Process",
      "Nullifiers and Replay Protection",
      "Verification Result",
      "API Endpoint",
    ],
    content: `
# ZK Proof Verification

ZK proofs in ACTA are verified on-chain via Soroban smart contracts using Protocol 25 ZK verification support.

## Overview

Unlike proof generation (which is client-side), verification happens on-chain:
- **Location**: Soroban ZK verifier contract
- **Method**: Protocol 25 ZK verification
- **Security**: Cryptographic verification with replay protection
- **Trust**: No need to trust third parties

### Why On-Chain Verification?

- **Immutability** - Verification results are permanently recorded
- **Trustless** - No need to trust verification servers
- **Transparency** - Verification logic is on-chain
- **Replay Protection** - Nullifiers prevent proof reuse

## On-Chain Verification

Verification is performed by the Soroban ZK verifier contract:

1. **Contract Receives**:
   - Circuit ID (identifies which circuit to use)
   - Proof (the cryptographic proof)
   - Public inputs (public signals)
   - Nullifier (for replay protection)

2. **Contract Verifies**:
   - Loads verification key (vk) for the circuit
   - Verifies the proof cryptographically
   - Checks nullifier hasn't been used before
   - Records verification result on-chain

3. **Result**:
   - Transaction hash
   - Ledger number
   - Verification status (verified/not verified)

## Verification Process

### Step 1: Prepare Verification Payload

From the shared credential link, extract:

\`\`\`typescript
{
  statement: {
    kind: 'isAdult' | 'notExpired' | 'isValid',
    // ... other metadata
  },
  proof: string,              // Base64 encoded proof
  publicSignals: string[],    // Public inputs
  commitment: string,          // Credential commitment
  nonce: string,              // Nonce for nullifier
  credentialId: string,       // Credential identifier
  verifierContractId?: string // Optional contract override
}
\`\`\`

### Step 2: Generate Nullifier

Nullifier prevents replay attacks by making each proof unique:

\`\`\`typescript
// Nullifier = hash(commitment + nonce + proof_hash)
const nullifier = await generateNullifier({
  commitment,
  nonce,
  proof
});
\`\`\`

### Step 3: Call Verification API

Send verification request to ACTA API:

\`\`\`bash
POST /contracts/zk-verifier/verify
\`\`\`

**Request Body:**

\`\`\`json
{
  "circuitId": "isAdult",
  "proof": "base64_proof",
  "publicInputs": ["..."],
  "nullifier": "hex_nullifier",
  "verifierContractId": "C..."
}
\`\`\`

### Step 4: On-Chain Verification

The API:
1. Invokes the Soroban ZK verifier contract
2. Contract verifies the proof using stored verification key
3. Checks nullifier hasn't been used
4. Records verification on-chain
5. Returns transaction hash and result

### Step 5: Verification Result

**Response:**

\`\`\`json
{
  "verified": true,
  "txHash": "abc123...",
  "ledger": 12345,
  "network": "testnet"
}
\`\`\`

## Nullifiers and Replay Protection

Nullifiers ensure each proof can only be verified once, preventing replay attacks.

### How Nullifiers Work

1. **Generate Nullifier**:
   \`\`\`
   nullifier = SHA-256(commitment + nonce + proof_hash)
   \`\`\`

2. **Check on-Chain**:
   - Contract maintains a set of used nullifiers
   - If nullifier exists → proof already used → reject
   - If nullifier doesn't exist → add to set → verify proof

3. **Uniqueness**:
   - Each proof instance has unique commitment + nonce
   - Even same credential + predicate = different nullifier
   - Prevents proof reuse

### Benefits

- **Replay Protection** - Same proof can't be verified twice
- **Privacy** - Nullifier doesn't reveal credential content
- **Efficiency** - Simple hash check on-chain

## Verification Result

### Success Response

\`\`\`json
{
  "verified": true,
  "txHash": "transaction_hash",
  "ledger": 12345,
  "network": "testnet",
  "result": { ... }
}
\`\`\`

### Failure Response

\`\`\`json
{
  "verified": false,
  "error": "error_message",
  "network": "testnet"
}
\`\`\`

### Common Errors

- \`Invalid payload\` - Missing required fields
- \`No proof to verify\` - Predicate kind is 'none'
- \`Missing commitment\` - Commitment not provided
- \`Missing nonce\` - Nonce not provided
- \`Invalid proof format\` - Proof structure is invalid
- \`Proof verification failed\` - Cryptographic verification failed
- \`Nullifier already used\` - Proof was already verified

## API Endpoint

### POST /contracts/zk-verifier/verify

Verifies a ZK proof on-chain via Soroban contract.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Request Body:**

\`\`\`json
{
  "circuitId": "isAdult",
  "proof": "base64_encoded_proof",
  "publicInputs": ["public_signal_1", "public_signal_2"],
  "nullifier": "hex_nullifier_string",
  "verifierContractId": "C..."
}
\`\`\`

**Response:**

\`\`\`json
{
  "verified": true,
  "txHash": "abc123...",
  "ledger": 12345,
  "result": {},
  "network": "testnet"
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/zk-verifier/verify \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "circuitId": "isAdult",
    "proof": "...",
    "publicInputs": [],
    "nullifier": "..."
  }'
\`\`\`

### Parameters

- **circuitId** (required): Circuit identifier (\`"isAdult"\`, \`"notExpired"\`, \`"isValid"\`)
- **proof** (required): Base64 encoded proof
- **publicInputs** (required): Array of public input strings
- **nullifier** (required): Hex-encoded nullifier for replay protection
- **verifierContractId** (optional): Override verifier contract ID
    `,
  },
  "scf-42": {
    slug: "scf-42",
    title: "SCF 42",
    section: "SCF",
    tocItems: [
      "Overview",
      "Stellar DID Method (v0.1)",
      "Identifier format & network binding",
      "DID Document model",
      "Native key derivation",
      "Proof of control",
      "Deterministic resolution",
      "Reference resolver tooling",
      "Soroban contracts",
      "Testnet API/SDK",
      "ZK milestone (Stellar X-Ray)",
      "ZK overview",
      "Circuit & predicates",
      "Credential & DID binding",
      "Nullifier & replay protection",
      "Verifier contract interface",
      "BN254 host functions",
      "Trusted setup & artifacts",
      "Threat model & limitations",
      "Minimal executable PoC",
    ],
    content: `
# SCF 42

Technical architecture for SCF 42: Stellar DID method, resolver tooling, Soroban contracts for credentials and vaults, and testnet API/SDK.

## Overview

- **Stellar DID Method (v0.1) + resolution tooling** — Specification and open-source resolver so \`did:stellar\` identifiers resolve to DID Documents for Verifiable Credential issuance and verification.
- **Soroban contracts** — Credential lifecycle, encrypted vaults, holder-controlled issuer acceptance, USDC fee tiers, and versioning.
- **Testnet API/SDK** — Stable, versioned testnet release with wallet signing and reproducible end-to-end flows.

## Stellar DID Method (v0.1)

v0.1 scope is single-signature and ecosystem-ready.

### Identifier format & network binding

Normative identifier syntax bound to Stellar networks:

\`\`\`
did:stellar:<network>:<accountId>
\`\`\`

- **<network>**: \`mainnet\` | \`testnet\`
- **<accountId>**: Stellar StrKey public key (G...)

Chain-agnostic account representation (blockchainAccountId-style):

\`\`\`
stellar:mainnet:<G...>   /   stellar:testnet:<G...>
\`\`\`

### Minimum DID Document model (VC-ready)

The v0.1 DID Document includes the minimum verification material for VC flows and follows the [W3C DID Core](https://w3c.github.io/did/#did-document-properties) data model. Required properties: \`id\`, \`verificationMethod\`, \`authentication\`, \`assertionMethod\`.

Example structure for \`did:stellar\` (v0.1, single-sig, Ed25519). This structure may vary in future versions:

\`\`\`json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM",
  "verificationMethod": [{
    "id": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM",
    "publicKeyMultibase": "z6Mk...",
    "blockchainAccountId": "stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM"
  }],
  "authentication": [
    "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller"
  ],
  "assertionMethod": [
    "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller"
  ]
}
\`\`\`

See [DID Document properties (W3C)](https://w3c.github.io/did/#did-document-properties) for the full normative definition.

### Native key derivation from Stellar account state (single-sig only)

The DID Document is built deterministically from on-ledger account configuration:

- \`verificationMethod\` is derived from the account signer (Ed25519 key).
- v0.1 is limited to single-signature accounts (one effective Ed25519 signer).
- Accounts with multisig (multiple signers and/or thresholds) are out of scope and MUST return a typed error (e.g. \`unsupportedAccountConfiguration\`) or be treated as unsupported by policy.
- In v0.1 only Ed25519 keys are exposed as \`verificationMethod\`; other signer types are unsupported or reflected only in metadata.

### Proof of control (issuer/holder)

Standard mechanism for proving control of a \`did:stellar\` identifier via wallet signing:

- **Option A (simple)**: Ed25519 signature over a canonical challenge (nonce + domain + DID + timestamp).
- **Option B (wallet-friendly)**: SEP-10–style challenge signing for existing Stellar wallet flows.

v0.1 defines one option as recommended and keeps the other as a compatible alternative, with canonicalization and anti-replay rules (nonce, domain binding, expiration).

### Deterministic resolution rules (normative)

Resolution is deterministic and uses only public ledger state:

1. Parse and validate the DID (network, StrKey).
2. Fetch account state via Horizon/RPC.
3. Validate v0.1 account constraints (single-sig).
4. Construct the DID Document from: account signer (verification methods), optional ManageData entries under a reserved namespace (services/attributes). Given ManageData size limits, v0.1 stores mainly pointers and short URIs, not large payloads.
5. Return a DID Resolution Result with:
   - \`didDocument\`
   - \`didResolutionMetadata\` (errors: \`invalidDid\`, \`unknownNetwork\`, \`notFound\`, \`unsupportedFormat\`, \`unsupportedAccountConfiguration\`)
   - \`didDocumentMetadata\` (network, ledger info, updated/versioning where available)

### Reference resolver tooling (OSS)

Open-source resolver compatible with the DIF did-resolver interface (JS/TS):

- Multi-network (mainnet/testnet)
- \`did+json\` and \`did+ld+json\`
- SDK utilities: DID parse/normalize, canonical challenge builder/verifier (proof of control), end-to-end examples for issuers and verifiers in VC flows.

The draft is developed with advisory input from a contributor active in W3C identity standardization (DID Core / DID Resolution alignment).

## Soroban contracts (credentials + encrypted vaults)

Soroban (Rust) contracts provide a clear, production-oriented surface on testnet:

- **Credential lifecycle**: Issue, verify, revoke; on-chain anchoring and status checks, including revocation state.
- **Encrypted vaults**: Per-holder vault operations (store/list/get), controlled credential sharing and transfer where applicable.
- **Holder-controlled issuer acceptance** (permissionless, anti-spam): ACTA does not gate who can issue on Stellar; per-holder issuer controls are enforced at the vault layer:
  - **Required**: Per-holder issuer blocklist enforced on vault write (writes from blocked issuers fail deterministically).
  - **Configurable default**: Vault policy supports a default “accept-all” mode with an extensible path to stricter modes.
- **USDC-denominated fee tiers**: On-chain fee logic in USDC (tier configuration and enforcement), with clear payer and collection semantics.
- **Versioning & deployment**: Published contract IDs, interface documentation, and a clear upgrade/version strategy for testnet.

## Testnet API/SDK

The testnet API/SDK (issuance and on-chain verification) is hardened into a stable, versioned release:

- **API/SDK stability**: Versioning, consistent error handling, and documented request/response contracts.
- **Wallet signing**: Freighter (and WalletConnect where applicable); transactions are prepared server-side and signed client-side.
- **Reproducible demo**: Documented, scriptable end-to-end flow: issuer prepares issuance transaction (XDR), signs via wallet, credential is anchored on-chain, holder stores or uses it via vault, verifier performs on-chain verification (including status and revocation checks), with transaction links for every step.

## ZK milestone (Stellar X-Ray / Protocol 25)

The ZK work delivers a fully specified **selective disclosure** component plus a **minimal executable proof of concept** for privacy‑preserving on‑chain verification on Stellar using Stellar X-Ray (Protocol 25) BN254 primitives. This section expands the Tranche 3 ZK scope for SCF reviewers.

### ZK overview

- **Curve**: BN254 (as exposed by Stellar X-Ray / Protocol 25).
- **Proof system**: Groth16 zk‑SNARK.
- **Host functions used**:
  - \`bn254_g1_mul\`
  - \`bn254_g1_add\`
  - \`bn254_multi_pairing_check\`
  - Poseidon hash host functions (for nullifier derivation, where applicable).
- **On‑chain verifier**: Soroban contract (\`zk_verifier\`) deployed on a Protocol 25+ network (testnet and mainnet for the PoC).
- **Off‑chain tooling**: BN254‑compatible prover stack (e.g. circom + snarkjs or equivalent) that compiles circuits, generates proving/verification keys, and produces Groth16 proofs compatible with the on‑chain encoding.

### Circuit and predicate specification

We implement a concrete, auditable predicate such as:

- **Predicate A (age check)**: “holder is at least 18 years old”, or
- **Predicate B (non‑expired credential)**: “credential has not expired at reference time”.

The chosen predicate is fixed and documented in the PoC.

#### Inputs

- **Private inputs** (known only to holder/prover):
  - \`dob\`: date of birth encoded as an integer (e.g. Unix timestamp or YYYYMMDD).
  - \`salt\`: random salt used in attribute hashing.
  - \`credential_secret_fields\`: additional secret fields that bind the proof to a specific ACTA credential.
- **Public inputs**:
  - \`cred_hash\`: hash of the credential (or selected fields) as stored/referenced in ACTA.
  - Predicate parameters (e.g. \`age_threshold = 18\`).
  - \`nullifier\`: public nullifier derived from private and public values (see below).
  - Optional \`holder_binding\`: representation of the holder’s DID or \`blockchainAccountId\`.

#### Circuit logic (example “age ≥ 18”)

1. Recompute a **binding hash** from private fields and salt:
   - \`h_internal = H(dob || salt || credential_secret_fields)\`
2. Combine with public metadata (issuer, schema, etc.) to recompute \`cred_hash\`:
   - \`cred_hash' = H(h_internal || public_metadata)\`
3. Enforce \`cred_hash' == cred_hash\` (binding proof to a specific credential).
4. Derive age or compare dates to enforce the predicate (e.g. \`age >= 18\` or “dob is at least 18 years before a cut‑off date”).
5. Optionally derive or validate the **nullifier** inside the circuit to align with on‑chain checks.

The circuit clearly documents private vs public variables, hashing strategy, and predicate semantics. Circuit source (e.g. \`.circom\`) and compiled artifacts are versioned and published.

### Credential and DID binding

ACTA credentials are linked to holders via \`did:stellar:<network>:<accountId>\`. The ZK proof must be:

- **Bound to a specific credential**, so it cannot be reused with a different credential body.
- **Bound to a specific holder**, to prevent “proof lending”.

We achieve this via:

- **Credential hash** (\`cred_hash\`):
  - Computed from canonical credential data (issuer DID, holder DID, schema ID, and the private attribute + salt).
  - The same structure is logically reproduced inside the circuit using field‑friendly hashes.
- **Holder binding**:
  - Include a representation of the holder’s DID or \`blockchainAccountId\` (e.g. \`stellar:mainnet:G...\`) in:
    - Credential hash computation.
    - Nullifier derivation.

This prevents reusing a proof for a different credential or a different holder without regenerating the proof.

### Nullifier and replay protection

#### Goals

- **Replay protection** — avoid accepting the same proof (or logical use) multiple times where the application requires one‑time usage.
- **Auditability** — record that a given nullifier has been consumed.

#### Nullifier construction

We derive the nullifier using Poseidon host functions so off‑chain and on‑chain derivations match exactly. Example:

\`\`\`text
nullifier = Poseidon(
  cred_hash
  || predicate_id
  || holder_binding
  || context
)
\`\`\`

Where:

- \`cred_hash\`: binds to the credential.
- \`predicate_id\`: distinguishes different circuits/predicates (e.g. \`"isAdult"\` vs \`"notExpired"\`).
- \`holder_binding\`: binds to the holder (e.g. hash of \`did:stellar:...\` or \`blockchainAccountId\`).
- \`context\`: optional domain separator (application/use‑case ID).

The design document specifies encoding, field mapping, and whether the nullifier is recomputed in the circuit, in the contract, or both.

#### On‑chain handling

The verifier contract:

- Receives \`nullifier\` as a public input.
- Before accepting a proof:
  - Checks if \`nullifier\` is already stored; if so, returns an error (e.g. \`NullifierUsed\`).
  - Otherwise, proceeds with Groth16 verification.
- On success:
  - Stores \`nullifier\` in contract state.
  - Emits an event including \`nullifier\`, \`predicate_id\`, and the outcome.

### Verifier contract interface

The Soroban verifier exposes a minimal, versioned function, for example:

\`\`\`text
fn verify_proof(
  circuit_id: String,      // e.g. "isAdult"
  proof: Bytes,            // serialized Groth16 proof (A, B, C)
  public_inputs: Bytes,    // encoded BN254 field elements
  nullifier: Bytes         // field element used for replay protection
) -> Result<VerificationResult, VerificationError>
\`\`\`

- \`circuit_id\` maps to a specific verification key and expected public input layout.
- \`proof\` encodes G1/G2 points \`A, B, C\` using a documented format compatible with the prover.
- \`public_inputs\` is a concatenation of field elements in a fixed order (e.g. \`[cred_hash, age_threshold, nullifier, holder_binding]\`).
- \`nullifier\` is also passed separately for indexing/replay checks.

The contract returns a structured result and emits events so verifications can be indexed on‑chain. Error variants include \`InvalidProof\`, \`NullifierUsed\`, \`InvalidInputs\`, \`UnsupportedCircuit\`.

### BN254 host functions (on‑chain Groth16 verification)

The on‑chain verifier:

- Uses \`bn254_g1_mul\` and \`bn254_g1_add\` to reconstruct \`vk_x\` from the verification key and public inputs.
- Uses \`bn254_multi_pairing_check\` to evaluate:

  > **e(−A,B) · e(α,β) · e(vkₓ,γ) · e(C,δ) = 1**

No pairing or curve arithmetic is implemented in Rust; all elliptic‑curve operations come from X-Ray host functions. Poseidon host functions are used, where applicable, to derive or check the nullifier.

### Trusted setup and artifact management

Because Groth16 requires a trusted setup, we:

- Define circuits in a public repository (e.g. \`isAdult.circom\`).
- Run a documented ceremony (or reuse a compatible multi‑party ceremony) to generate:
  - Proving key.
  - Verification key.
- Publish:
  - Circuit source and version (e.g. Git commit hash).
  - Hashes of proving and verification keys.
  - Exact encoding of verification key constants used on‑chain.

On‑chain, the contract embeds or references the VK for each supported \`circuit_id\` and maps \`circuit_id -> vk_id\` as needed.

### Threat model and limitations

We explicitly state:

- **Protected**:
  - Private attributes (DOB, expiration) are never revealed on‑chain.
  - Verifiers only see predicate outcomes and public inputs (e.g. credential hash, nullifier).
  - Replay is prevented through the nullifier mechanism.
- **Out of scope**:
  - Network‑level metadata (IP, timing) and cross‑application correlation.
  - Malicious issuers embedding PII in public credential fields.
  - Side‑channel attacks against off‑chain prover environments.
- **Dependencies**:
  - Correctness and security of Stellar’s BN254/Poseidon host functions and the chosen Groth16 stack.

We also set upper bounds for circuit size, number of public inputs, and expected verification cost.

### Minimal executable PoC

The minimal PoC demonstrates, reproducibly:

- **Credential and claim** — A holder owns an ACTA credential (issued and stored via ACTA) with a **private attribute** (e.g. exact DOB or expiration timestamp).
- **Selective disclosure and proof generation** — The holder reveals only what is necessary (e.g. “I am over 18” or “this credential has not expired”) and generates a **ZK proof** using a BN254‑compatible circuit, producing a Groth16 proof and BN254‑compatible public inputs plus a nullifier.
- **On‑chain verification** — A transaction sends \`circuit_id\`, \`proof\`, \`public_inputs\`, and \`nullifier\` to the Soroban verifier contract. The contract reconstructs \`vk_x\`, calls \`bn254_multi_pairing_check\`, checks/stores the nullifier, and records success via state and events.
- **Observable outcome** — A third party can verify **on‑chain** that a valid proof was verified, **without** the verifier or the chain learning the underlying PII. Documentation includes network/protocol version, contract ID, and CLI/SDK commands to reproduce the full flow.
    `,
  }
};

export const navigationItemsEn = {
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

export const docsDataEs: Record<string, DocPage> = {
  // Welcome Section
  introduction: {
    slug: "introduction",
    title: "Introducción",
    section: "Bienvenida",
    tocItems: [
      "Empieza aquí",
      "Qué puedes construir",
      "Casos de uso comunes",
      "Pruébalo ahora",
    ],
    content: `
# Bienvenida

ACTA es **infraestructura de credenciales verificables** para la **blockchain Stellar**. Construye flujos de credenciales **no custodiados** con **emisión**, verificación y almacenamiento. Los contratos corren en **Stellar (Soroban)** y tu app los controla vía API o SDK.

## Empieza aquí

| Tema | Descripción |
|-------|-------------|
      | **Arquitectura** | Componentes del sistema, contratos y flujo de datos |
      | **Primeros Pasos** | Guía rápida de integración con API y SDK |
      | **React SDK** | Hooks para operaciones de credenciales y bóvedas |
      | **Referencia API** | Documentación completa de endpoints públicos de la API |
      | **Enlaces** | Enlaces oficiales, recursos y comunidad |
      | **Flujo de Credenciales** | Entender los flujos de emisión, verificación y almacenamiento |

## Qué puedes construir

- Emitir y verificar **[Credenciales Verificables W3C 2.0](https://www.w3.org/TR/vc-data-model-2.0/)** on-chain  
- Almacenar credenciales cifradas en **bóvedas controladas por el usuario**  
- Añadir **lógica de verificación programable** a tu app  
- Soportar **revocación**, chequeo de estado y transferencia de credenciales  
- Configurar **autorización de emisores** por bóveda  
- Lanzar más rápido sin escribir contratos de credenciales desde cero  

## Casos de uso comunes

- **Identidad digital**: Emitir credenciales verificables de identidad  
- **Educación**: Certificados académicos y diplomas  
- **Profesional**: Licencias, certificaciones y membresías  
- **Salud**: Historial médico y certificados de vacunación  
- **Finanzas**: Credenciales para cumplimiento KYC/AML  
- **Control de acceso**: Membresías y tokens de autorización  

## Pruébalo ahora

- [Abrir dApp](https://dapp.acta.build/) - Explora la dApp de ACTA  
- [Ver GitHub](https://github.com/ACTA-Team) - Revisa el código fuente  
- [Unirte a Discord](https://discord.gg/DsUSE3aMDZ) - Conéctate con la comunidad  
    `,
  },
  architecture: {
    slug: "architecture",
    title: "Arquitectura",
    section: "Bienvenida",
    tocItems: [
      "Componentes del sistema",
      "Contrato de emisión",
      "Contrato de bóveda",
      "Capa de API",
      "Almacenamiento",
      "Modelo de identidad",
      "Flujo de credenciales",
      "Soporte de red",
    ],
    content: `
# Arquitectura

Vista técnica de la arquitectura de ACTA y sus componentes.

## Componentes del sistema

### Contrato de emisión (Soroban)

Gestiona el ciclo de vida de la credencial on-chain:

- **Emitir**: Crea nuevas credenciales y ancla el hash on-chain  
- **Verificar**: Verificación pública del estado de la credencial  
- **Revocar**: Revoca credenciales con fecha de revocación opcional  

Las funciones del contrato se exponen vía endpoints de la API. Revisa la referencia de API para más detalles.

### Contrato de bóveda (Soroban)

Repositorio multi-tenant de almacenamiento de credenciales:

- **Inicializar**: Crea una nueva bóveda para un usuario  
- **Almacenar**: Guarda credenciales cifradas en la bóveda del usuario  
- **Listar/Obtener**: Recupera IDs y datos de credenciales  
- **Verificar**: Verifica credenciales delegando al contrato de emisión  
- **Autorización**: Gestiona las listas de emisores autorizados

Cada usuario tiene una bóveda aislada con controles de administración e autorización de emisores independientes.

### Capa de API

API REST que provee:

- **Operaciones de credenciales**: emitir, verificar, revocar  
- **Operaciones de bóveda**: almacenar, recuperar y gestionar bóvedas  
- **Preparación de transacciones**: genera XDR sin firmar para firma del lado del cliente  
- **Operaciones de lectura**: consulta de credenciales y estado de la bóveda (sin firma)  

Todos los endpoints soportan automáticamente mainnet y testnet vía la configuración de \`NETWORK_TYPE\`.

### Almacenamiento

- **On-chain**: Hashes de credenciales y metadatos de estado (contratos inteligentes Soroban)  
- **Off-chain**: Payload cifrado de la credencial (bóvedas controladas por el usuario)  

## Modelo de identidad 1.0

Usa el formato DID:pkh:

\`\`\`
did:pkh:stellar:{network}:{wallet_address}
\`\`\`

- **network**: \`mainnet\` o \`testnet\`  
- **wallet_address**: clave pública de Stellar (G...)  

No se requiere infraestructura de identidad adicional: las claves de la wallet Stellar actúan como identidad.

> **Nota**: La versión 1.0 es la primera versión en ACTA. Se está trabajando en la versión 2.0 donde se usará el DID oficial de Stellar.

## Flujo de credenciales

![Issuance Flow](/issuance-flow.png)  

![Verification Flow](/credential-verifier.png)  

## Soporte de red

ACTA maneja automáticamente la configuración de red:

- **Testnet**: \`https://acta.build/api/testnet\` o \`NETWORK_TYPE=testnet\`  
- **Mainnet**: \`https://acta.build/api/mainnet\` o \`NETWORK_TYPE=mainnet\`  

Los IDs de contratos, URLs RPC y passphrases de red se configuran automáticamente según el tipo de red.
    `,
  },
  "getting-started": {
    slug: "getting-started",
    title: "Primeros Pasos",
    section: "Bienvenida",
    tocItems: [
      "Integración API",
      "Integración React SDK",
      "Integración de wallet",
      "Configuración Testnet",
      "Siguientes pasos",
    ],
    content: `
# Primeros Pasos

Guías rápidas para distintos escenarios de integración.

## Integración API

Comienza a usar la API de ACTA para emitir y verificar credenciales:

1. **Elegir red**: Testnet (recomendada para desarrollo) o Mainnet  
2. **Obtener acceso API**: URL base y configuración de red  
3. **Emitir credenciales**: Usa el endpoint \`POST /credentials\`  
4. **Verificar credenciales**: Usa \`GET /verify/:vc_id\` o \`POST /verify\`  

Consulta el Developer Quickstart de API para pasos detallados.

## Integración React SDK

Para aplicaciones React/Next.js:

1. **Instalar SDK**:

\`\`\`bash
npm install @acta-team/acta-sdk
\`\`\`

2. **Configurar provider**: Envuelve tu app con \`ActaConfig\`  
3. **Usar hooks**: \`useCredential\`, \`useVault\`, \`useVaultRead\`, etc.  

Revisa la documentación del React SDK para hooks y ejemplos.

## Integración de wallet

Conecta wallets de Stellar para autenticación de usuarios y firma de transacciones:

1. **Instalar Wallet Kit**: integrar el adaptador de wallet  
2. **Conectar wallet**: el usuario conecta Freighter u otra wallet Stellar  
3. **Firmar transacciones**: usa los endpoints de preparación de transacción  

Consulta la guía de integración de Wallet Kit para más detalles.

## Configuración Testnet

Antes de desplegar a mainnet:

1. **Obtener tokens de testnet**: pide XLM en el faucet de Stellar testnet  
2. **Probar operaciones**: emitir, almacenar y verificar credenciales de prueba  
3. **Verificar contratos**: los IDs de contratos de testnet ya vienen preconfigurados  

Revisa la sección de Testnet Tokens para enlaces a faucets.

## Siguientes pasos

- Revisa la referencia de API para todos los endpoints disponibles  
- Consulta la documentación de esquemas para estructuras de datos  
- Explora los hooks del React SDK para integración con React  
- Lee la guía de troubleshooting para problemas comunes  
    `,
  },
  links: {
    slug: "links",
    title: "Enlaces",
    section: "Bienvenida",
    tocItems: ["Oficiales", "Desarrollo", "Redes sociales"],
    content: `
# Enlaces

## Oficiales

- **Sitio web**: [https://acta.build](https://acta.build)  
- **dApp**: [https://dapp.acta.build/](https://dapp.acta.build/)  

## Desarrollo

- **GitHub**: [https://github.com/ACTA-Team](https://github.com/ACTA-Team)  
- **Discord**: [https://discord.gg/DsUSE3aMDZ](https://discord.gg/DsUSE3aMDZ)  

## Redes sociales

- **X/Twitter**: [https://x.com/ActaXyz](https://x.com/ActaXyz)  
- **LinkedIn**: [https://www.linkedin.com/company/acta-org](https://www.linkedin.com/company/acta-org)  
- **Instagram**: [https://www.instagram.com/acta.xyz](https://www.instagram.com/acta.xyz)  
    `,
  },

  // React SDK Section
  "sdk-overview": {
    slug: "sdk-overview",
    title: "Resumen",
    section: "React SDK",
    tocItems: [
      "Exports",
      "Configuración del provider",
      "Acceder al cliente",
      "Resumen de hooks",
    ],
    content: `
# Resumen del React SDK

Librería React que expone un provider, acceso al cliente y hooks para la API de ACTA y transacciones Soroban. La red se infiere desde \`baseURL\`.

## Exports

- Provider \`ActaConfig\` y accessor de contexto \`useActaClient\`  
- Hooks: \`useVault\`, \`useCredential\`, \`useVaultRead\`  
- URLs base: \`mainNet\` y \`testNet\`  

## Configuración del provider

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/acta-sdk";

export function App() {
  return (
    <ActaConfig baseURL={mainNet}>
      {/* tu aplicación */}
    </ActaConfig>
  );
}
\`\`\`

La API key se lee automáticamente desde variables de entorno:

- \`ACTA_API_KEY_MAINNET\` (para mainnet)  
- \`ACTA_API_KEY_TESTNET\` (para testnet)  
- \`ACTA_API_KEY\` (fallback para ambas redes)  

## Acceder al cliente

\`\`\`ts
import { useActaClient } from "@acta-team/acta-sdk";

const client = useActaClient();
const config = await client.getConfig();
// config: { rpcUrl, networkPassphrase, actaContractId }
\`\`\`

## Resumen de hooks

- \`useVault\`: Operaciones de bóveda - crear bóveda, autorizar emisor, revocar emisor
  - \`createVault\`: Inicializar una bóveda para un propietario
  - \`authorizeIssuer\`: Autorizar un emisor en la bóveda
  - \`revokeIssuer\`: Revocar un emisor autorizado de la bóveda

- \`useCredential\`: Operaciones de credenciales - emitir y revocar
  - \`issue\`: Emitir una credencial (almacena en la bóveda y marca como válida)
  - \`revoke\`: Revocar una credencial

- \`useVaultRead\`: Operaciones de lectura de bóveda - listar IDs, obtener VC, verificar VC
  - \`listVcIds\`: Listar los IDs de credenciales propiedad de un propietario
  - \`getVc\`: Obtener una credencial de la bóveda
  - \`verifyVc\`: Verificar el estado de una credencial en la bóveda  
    `,
  },
  useCredential: {
    slug: "useCredential",
    title: "useCredential",
    section: "React SDK",
    tocItems: [
      "Función",
      "issue",
      "Argumentos",
      "Tipo de firmante",
      "Valor de retorno",
      "Ejemplo",
      "issueLinked",
      "revoke",
      "Flujo de transacción",
      "Notas",
    ],
    content: `
# useCredential

Hook para operaciones de credenciales: emitir, emitir vinculada y revocar.

## Función

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
  issueLinked: (args: IssueLinkedArgs) => Promise<{ txId: string }>;
  revoke: (args: RevokeArgs) => Promise<{ txId: string }>;
}
\`\`\`

## issue

Emite una credencial (la guarda en la bóveda y la marca como válida).

### Argumentos

\`\`\`ts
{
  owner: string;                    // Clave pública Stellar del propietario de la bóveda
  vcId: string;                    // Identificador único de la credencial
  vcData: string | object;         // Datos de la credencial (JSON string u objeto). @context se agrega automáticamente
  issuer: string;                  // Clave pública Stellar del emisor
  holder: string;                  // Dirección de wallet o DID del titular (el DID se construye automáticamente desde la dirección)
  issuerDid?: string;              // Dirección de wallet o DID del emisor (el DID se construye automáticamente desde la dirección)
  signTransaction: Signer;         // Función que firma el XDR sin firmar
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Tipo de firmante

\`\`\`ts
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useCredential } from "@acta-team/acta-sdk";

const { issue } = useCredential();

const { txId } = await issue({
  owner: "G...",
  vcId: "credential-123",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:pkh:stellar:testnet:G...",
      name: "John Doe"
    }
  }),
  issuer: "G...",
  holder: "G...",        // dirección de wallet — el DID se construye automáticamente
  issuerDid: "G...",     // dirección de wallet — el DID se construye automáticamente
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## issueLinked

Emite una credencial vinculada a una VC padre. La VC padre debe existir y estar válida en su bóveda. Esto permite relaciones jerárquicas entre credenciales.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Clave pública Stellar del propietario de la bóveda
  vcId: string;                    // Identificador único de la credencial
  vcData: string | object;         // Datos de la credencial (JSON string u objeto). @context se agrega automáticamente
  issuer: string;                  // Clave pública Stellar del emisor
  holder: string;                  // Dirección de wallet o DID del titular (el DID se construye automáticamente desde la dirección)
  issuerDid?: string;              // Dirección de wallet o DID del emisor (el DID se construye automáticamente desde la dirección)
  signTransaction: Signer;         // Función que firma el XDR sin firmar
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
  parentOwner: string;             // Clave pública Stellar del propietario de la VC padre
  parentVcId: string;              // Identificador de la VC padre
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useCredential } from "@acta-team/acta-sdk";

const { issueLinked } = useCredential();

const { txId } = await issueLinked({
  owner: "G...",
  vcId: "linked-credential-456",
  vcData: JSON.stringify({
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:pkh:stellar:testnet:G...",
      name: "John Doe",
      certification: "Nivel Avanzado"
    }
  }),
  issuer: "G...",
  holder: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  },
  parentOwner: "G...",             // Propietario de la VC padre
  parentVcId: "credential-123"    // ID de la VC padre
});
\`\`\`

## revoke

Revoca una credencial.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del titular
  vcId: string;                    // Identificador único de la credencial a revocar
  signTransaction: Signer;         // Función que firma el XDR sin firmar
  date?: string;                   // Fecha de revocación en ISO (opcional, usa la fecha actual por defecto)
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useCredential } from "@acta-team/acta-sdk";

const { revoke } = useCredential();

const { txId } = await revoke({
  owner: "G...",
  vcId: "credential-123",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  },
  date: new Date().toISOString() // Opcional
});
\`\`\`

## Flujo de transacción

Todos los métodos siguen el mismo flujo:

1. **Preparar**: llama a la API para obtener un XDR sin firmar y el network passphrase  
2. **Firmar**: usa \`signTransaction\` para firmar el XDR con el passphrase proporcionado  
3. **Enviar**: envía el XDR firmado a la API para procesarlo en la red  

El hook maneja automáticamente la diferencia entre las respuestas de “prepare” y “submit” usando type guards internos.

## Notas

- El método \`issue\` almacena automáticamente la credencial en la bóveda y la marca como válida en una sola transacción  
- El método \`revoke\` requiere que el \`owner\` firme la transacción  
- La fecha de revocación se establece automáticamente a la fecha actual si no se provee  
    `,
  },
  useVault: {
    slug: "useVault",
    title: "useVault",
    section: "React SDK",
    tocItems: [
      "Función",
      "createVault",
      "Argumentos",
      "Tipo de firmante",
      "Valor de retorno",
      "Ejemplo",
      "authorizeIssuer",
      "revokeIssuer",
      "Flujo de transacción",
    ],
    content: `
# useVault

Hook para operaciones de bóveda: crear bóveda, autorizar emisor, revocar emisor.

## Función

\`\`\`ts
useVault(): {
  createVault: (args: CreateVaultArgs) => Promise<{ txId: string }>;
  authorizeIssuer: (args: AuthorizeIssuerArgs) => Promise<{ txId: string }>;
  revokeIssuer: (args: RevokeIssuerArgs) => Promise<{ txId: string }>;
}
\`\`\`

## createVault

Crea (inicializa) una bóveda para un propietario.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Clave pública Stellar del propietario (G...)
  ownerDid: string;                 // DID asociado al propietario
  signTransaction: Signer;          // Función que firma el XDR sin firmar
  contractId?: string;              // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Tipo de firmante

\`\`\`ts
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useVault } from "@acta-team/acta-sdk";

const { createVault } = useVault();

const { txId } = await createVault({
  owner: "G...",
  ownerDid: "did:stellar:G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## authorizeIssuer

Autoriza un emisor en una bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Clave pública Stellar del propietario de la bóveda
  issuer: string;                   // Clave pública Stellar del emisor a autorizar
  signTransaction: Signer;          // Función que firma el XDR sin firmar
  contractId?: string;              // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useVault } from "@acta-team/acta-sdk";

const { authorizeIssuer } = useVault();

const { txId } = await authorizeIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## revokeIssuer

Revoca (elimina) un emisor autorizado de una bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;                    // Clave pública Stellar del propietario
  issuer: string;                   // Clave pública Stellar del emisor a revocar
  signTransaction: Signer;          // Función que firma el XDR sin firmar
  contractId?: string;              // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<{ txId: string }>\`: ID de la transacción después de enviarse a la red  

### Ejemplo

\`\`\`ts
import { useVault } from "@acta-team/acta-sdk";

const { revokeIssuer } = useVault();

const { txId } = await revokeIssuer({
  owner: "G...",
  issuer: "G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
});
\`\`\`

## Flujo de transacción

Todos los métodos siguen el mismo flujo:

1. **Preparar**: llama a la API para obtener un XDR sin firmar y el network passphrase  
2. **Firmar**: usa \`signTransaction\` para firmar el XDR con el passphrase proporcionado  
3. **Enviar**: envía el XDR firmado a la API para procesarlo en la red  

El hook maneja automáticamente la diferencia entre las respuestas de “prepare” y “submit” usando type guards internos.
    `,
  },
  useVaultRead: {
    slug: "useVaultRead",
    title: "useVaultRead",
    section: "React SDK",
    tocItems: [
      "Función",
      "listVcIds",
      "Argumentos",
      "Valor de retorno",
      "Ejemplo",
      "getVc",
      "getVcParent",
      "verifyVc",
      "Notas",
    ],
    content: `
# useVaultRead

Hook para leer datos de la bóveda: listar IDs de credenciales, obtener credenciales, obtener info de VC padre, verificar credenciales.

## Función

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
  getVcParent: (args: GetVcParentArgs) => Promise<{ owner: string; vc_id: string } | null>;
  verifyVc: (args: VerifyVcArgs) => Promise<VaultVerifyVcResponse>;
}
\`\`\`

## listVcIds

Lista los IDs de credenciales de un propietario.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<string[]>\`: array de IDs de credenciales  

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { listVcIds } = useVaultRead();

const vcIds = await listVcIds({
  owner: "G..."
});
// vcIds: ["credential-1", "credential-2", ...]
\`\`\`

## getVc

Obtiene una credencial desde la bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  vcId: string;                    // Identificador único de la credencial
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

- \`Promise<unknown | null>\`: datos de la credencial o \`null\` si no existe  

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { getVc } = useVaultRead();

const vc = await getVc({
  owner: "G...",
  vcId: "credential-123"
});

if (vc) {
  console.log("Credencial encontrada:", vc);
} else {
  console.log("Credencial no encontrada");
}
\`\`\`

## getVcParent

Obtiene la info de la VC padre para una credencial vinculada. Devuelve \`null\` si la credencial no tiene vínculo padre.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  vcId: string;                    // Identificador único de la credencial
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

\`\`\`ts
Promise<{ owner: string; vc_id: string } | null>
\`\`\`

- Devuelve un objeto con la dirección \`owner\` de la VC padre y su \`vc_id\`, o \`null\` si la credencial no está vinculada a un padre.

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { getVcParent } = useVaultRead();

const parent = await getVcParent({
  owner: "G...",
  vcId: "linked-credential-456"
});

if (parent) {
  console.log("Propietario padre:", parent.owner);
  console.log("ID de VC padre:", parent.vc_id);
} else {
  console.log("Esta credencial no tiene vínculo padre");
}
\`\`\`

## verifyVc

Verifica el estado de una credencial en la bóveda.

### Argumentos

\`\`\`ts
{
  owner: string;                   // Clave pública Stellar del propietario
  vcId: string;                    // Identificador único de la credencial
  contractId?: string;             // ID de contrato (opcional, usa el configurado por defecto)
}
\`\`\`

### Valor de retorno

\`\`\`ts
Promise<{
  status: "valid" | "revoked";
  since?: string;                  // Fecha ISO desde cuándo tiene ese estado (opcional)
}>
\`\`\`

### Ejemplo

\`\`\`ts
import { useVaultRead } from "@acta-team/acta-sdk";

const { verifyVc } = useVaultRead();

const verification = await verifyVc({
  owner: "G...",
  vcId: "credential-123"
});

console.log(\`Estado: \${verification.status}\`); // "valid" o "revoked"
if (verification.since) {
  console.log(\`Desde: \${verification.since}\`);
}
\`\`\`

## Notes

- Todas estas operaciones son **solo lectura** y no requieren firmar transacciones  
- Los métodos manejan automáticamente distintos formatos de respuesta de la API  
- \`getVc\` devuelve \`null\` si la credencial no existe en la bóveda  
- \`getVcParent\` devuelve \`null\` si la credencial no tiene vínculo padre
- \`verifyVc\` siempre devuelve el estado actual de la credencial  
    `,
  },

  // API Reference Section
  "api-overview": {
    slug: "api-overview",
    title: "Resumen",
    section: "Referencia API",
    tocItems: [
      "URLs base",
      "Autenticación",
      "Formato de solicitud",
      "Formato de respuesta",
      "Flujo Prepare/Submit",
      "Manejo de errores",
      "Límites de tasa",
      "Pruébalo en Postman",
    ],
    content: `
# Resumen de Referencia API

API RESTful para la gestión de credenciales ACTA en la blockchain Stellar. Todos los endpoints soportan redes mainnet y testnet.

## URLs base

**Testnet:**

\`\`\`
https://acta.build/api/testnet
\`\`\`

**Mainnet:**

\`\`\`
https://acta.build/api/mainnet
\`\`\`

## Autenticación

Solo la **emisión de credenciales** (\`POST /contracts/vc/issue\`) y los **endpoints de administración** requieren API key. Las operaciones de bóveda (crear, leer, autorizar, revocar, set-new-owner), la versión del contrato (\`GET /contracts/version\`) y la revocación de credenciales (\`POST /contracts/vc/revoke\`) no requieren autenticación.

Cuando sea necesario, envía la API key en el header de la solicitud:

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

### Obtener una API Key

Puedes crear una API key pública (rol estándar, expira en 6 meses) vía:

- **POST** \`/public/api-keys\` en la URL base de la red (ej. \`https://acta.build/api/testnet/public/api-keys\` o \`https://acta.build/api/mainnet/public/api-keys\`)

No requiere autenticación, pero tiene límite de 5 solicitudes por minuto por IP.

## Formato de solicitud

Todas las solicitudes usan formato JSON. El header Content-Type debe ser \`application/json\`.

### Operaciones de escritura (Prepare/Submit)

Las operaciones de escritura soportan dos modos:

1. **Prepare**: Envía solicitud sin \`signedXdr\` → devuelve XDR sin firmar
2. **Submit**: Envía solicitud con \`signedXdr\` → ejecuta la transacción

Ejemplo de solicitud prepare:

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "...",
  "issuer": "G...",
  "sourcePublicKey": "G..."
}
\`\`\`

Ejemplo de solicitud submit:

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

## Formato de respuesta

### Respuesta exitosa

El modo prepare devuelve XDR sin firmar + network passphrase:

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

El modo submit devuelve el ID de la transacción:

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

### Respuesta de error

\`\`\`json
{
  "error": "error_code",
  "message": "Mensaje de error legible"
}
\`\`\`

## Flujo Prepare/Submit

1. **Prepare**: Llama al endpoint con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Llama al mismo endpoint con \`signedXdr\` para ejecutar

## Manejo de errores

Todos los errores devuelven JSON con:
- \`error\`: Identificador del código de error
- \`message\`: Descripción del error legible

Códigos HTTP comunes:
- \`200\`: Éxito
- \`400\`: Solicitud incorrecta (parámetros inválidos)
- \`401\`: No autorizado (API key faltante o inválida)
- \`403\`: Prohibido (permisos insuficientes)
- \`404\`: No encontrado
- \`429\`: Límite de tasa excedido
- \`500\`: Error interno del servidor

## Límites de tasa

- Creación de API key pública: 5 solicitudes por minuto por IP
- Endpoints autenticados: Pueden aplicar límites según el nivel de la API key
- Headers de límite de tasa incluidos en respuestas:
  - \`X-RateLimit-Limit\`: Máximo de solicitudes permitidas
  - \`X-RateLimit-Remaining\`: Solicitudes restantes en la ventana
  - \`X-RateLimit-Reset\`: Timestamp Unix cuando se reinicia el límite

## Pruébalo en Postman

¿Quieres probar la API de ACTA de inmediato? Tenemos una colección pública en Postman con todos los endpoints preconfigurados y listos para usar.

1. Abre la [Colección ACTA en Postman](https://www.postman.com/acta-xyz-1193247/workspace/acta-team/collection/52380013-1a09da17-4bee-4267-b469-610c46969235?action=share&creator=52380013&active-environment=52380013-785bdf1a-3108-4c33-808c-76e31ee3b67f)
2. **Forkea la colección** en tu propio workspace de Postman
3. Selecciona el environment (**testnet** o **mainnet**)
4. ¡Empieza a hacer requests!

> Al forkear obtienes una copia personal que puedes personalizar, y puedes seguir recibiendo actualizaciones cuando agreguemos nuevos endpoints.
    `,
  },
  "api-health-status": {
    slug: "api-health-status",
    title: "Salud y Estado",
    section: "Referencia API",
    tocItems: [
      "Verificación de salud",
      "Configuración de red",
    ],
    content: `
# Endpoints de Salud y Estado

Endpoints para verificar la salud de la API y recuperar la configuración de red.

## Verificación de salud

### GET /health

Verifica el estado de la API. No requiere autenticación.

**Respuesta:**

\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl https://acta.build/api/testnet/health
\`\`\`

## Configuración de red

### GET /config

Obtiene la configuración pública de red (URL RPC, passphrase, ID de contrato). Requiere API key.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Respuesta:**

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "actaContractId": "C..."
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -H "X-ACTA-Key: tu_key" https://acta.build/api/testnet/config
\`\`\`
    `,
  },
  "api-keys": {
    slug: "api-keys",
    title: "API Keys",
    section: "Referencia API",
    tocItems: [
      "Crear API Key de Testnet",
      "Crear API Key de Mainnet",
      "Cuerpo de solicitud",
      "Respuesta",
      "Límites de tasa",
    ],
    content: `
# Endpoints de API Keys

Endpoint público para crear API keys. No requiere autenticación, pero tiene límite de tasa.

> **Nota:** También puedes solicitar API keys directamente desde la [dApp de ACTA](https://dapp.acta.build/). La dApp proporciona una interfaz amigable para crear y gestionar tus API keys.

## Crear API Key

### POST /public/api-keys

Crea una API key (rol estándar, expira en 6 meses). Usa la URL base de **testnet** o **mainnet** según la red que necesites.

- Testnet: \`https://acta.build/api/testnet/public/api-keys\`
- Mainnet: \`https://acta.build/api/mainnet/public/api-keys\`

**Límite de tasa:** 5 solicitudes por minuto por IP

**Cuerpo de solicitud:**

\`\`\`json
{
  "name": "Mi API Key",
  "wallet_address": "G...",
  "metadata": {
    "network": "testnet"
  }
}
\`\`\`

Incluye \`metadata.network\`: \`"testnet"\` o \`"mainnet"\` según la URL base que uses.

**Respuesta:**

\`\`\`json
{
  "message": "API key creada exitosamente. Guarda esta key - no se mostrará de nuevo.",
  "api_key": "acta_...",
  "api_key_record": {
    "id": "uuid",
    "name": "Mi API Key",
    "role": "standard",
    "is_active": true,
    "expires_at": "2024-07-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

**Ejemplo (testnet):**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mi Key de Testnet",
    "wallet_address": "G...",
    "metadata": {
      "network": "testnet"
    }
  }'
\`\`\`

**Ejemplo (mainnet):**

\`\`\`bash
curl -X POST https://acta.build/api/mainnet/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Mi Key de Mainnet",
    "wallet_address": "G...",
    "metadata": {
      "network": "mainnet"
    }
  }'
\`\`\`

## Cuerpo de solicitud

- \`name\` (opcional): Nombre para la API key (máx 120 caracteres)
- \`wallet_address\` (opcional): Dirección de wallet Stellar (G...)
- \`metadata\` (opcional): Objeto de metadatos adicionales
  - \`network\` (requerido): "testnet" o "mainnet"

## Respuesta

- \`api_key\`: La cadena de la API key (guarda esto - no se mostrará de nuevo)
- \`api_key_record\`: Metadatos sobre la key creada

## Límites de tasa

- Máximo 5 solicitudes por minuto por dirección IP
- Headers de límite de tasa incluidos en la respuesta:
  - \`X-RateLimit-Limit\`: 5
  - \`X-RateLimit-Remaining\`: Solicitudes restantes
  - \`X-RateLimit-Reset\`: Timestamp Unix cuando se reinicia el límite

**Nota:** La creación de API keys mediante estos endpoints solo está permitida desde el origen \`dapp.acta.build\`. Para la mejor experiencia, recomendamos usar la [dApp de ACTA](https://dapp.acta.build/) para crear y gestionar tus API keys.
    `,
  },
  "api-contract-info": {
    slug: "api-contract-info",
    title: "Información del Contrato",
    section: "Referencia API",
    tocItems: [
      "Obtener Versión del Contrato",
      "Parámetros de consulta",
      "Respuesta",
    ],
    content: `
# Endpoints de Información del Contrato

Endpoints para recuperar información del contrato.

## Obtener Versión del Contrato

### GET /contracts/version

Devuelve la cadena de versión del contrato ACTA. No requiere autenticación.

**Parámetros de consulta:**

- \`contractId\` (opcional): Sobrescribir ID de contrato (C...)
- \`sourcePublicKey\` (requerido): Una cuenta Stellar existente (G...) usada para simulación Soroban

**Respuesta:**

\`\`\`json
{
  "version": "1.0.0"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl "https://acta.build/api/testnet/contracts/version?sourcePublicKey=G..."
\`\`\`

## Parámetros de consulta

- **contractId** (opcional): Sobrescribir el ID de contrato ACTA por defecto
- **sourcePublicKey** (requerido): Clave pública Stellar (G...) usada para simulación del contrato

## Respuesta

- **version**: Cadena de versión del contrato
    `,
  },
  "api-vault-read": {
    slug: "api-vault-read",
    title: "Operaciones de Bóveda (Lectura)",
    section: "Referencia API",
    tocItems: [
      "Listar IDs de VC",
      "Obtener VC",
      "Obtener VC Padre",
      "Verificar VC",
      "Cuerpo de solicitud",
      "Respuestas",
    ],
    content: `
# Operaciones de Bóveda (Lectura)

Operaciones de solo lectura para datos de bóveda. No requiere autenticación.

## Listar IDs de VC

### POST /contracts/vault/list-vc-ids

Lista los IDs de credenciales verificables (VC) almacenados en la bóveda de un propietario.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "contractId": "C..."
}
\`\`\`

**Respuesta:**

\`\`\`json
["credential-1", "credential-2", "credential-3"]
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/list-vc-ids \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## Obtener VC

### POST /contracts/vault/get-vc

Obtiene una credencial verificable específica de una bóveda.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "contractId": "C..."
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "vcData": {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": "did:pkh:stellar:testnet:G...",
      "name": "John Doe"
    }
  }
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/get-vc \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Obtener VC Padre

### POST /contracts/vault/get-vc-parent

Obtiene la info de la VC padre para una credencial vinculada. Devuelve \`null\` si la credencial no tiene vínculo padre. No requiere autenticación.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "linked-credential-456",
  "contractId": "C..."
}
\`\`\`

**Respuesta (con padre):**

\`\`\`json
{
  "parent": {
    "owner": "G...",
    "vc_id": "credential-123"
  }
}
\`\`\`

**Respuesta (sin padre):**

\`\`\`json
{
  "parent": null
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/get-vc-parent \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "linked-credential-456"
  }'
\`\`\`

## Verificar VC

### POST /contracts/vault/verify-vc

Verifica una VC comprobando que existe en la bóveda del propietario y devolviendo su estado de emisión.

**Cuerpo de solicitud:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "contractId": "C..."
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "status": "valid",
  "since": "2024-01-01T00:00:00.000Z"
}
\`\`\`

O si está revocada:

\`\`\`json
{
  "status": "revoked",
  "since": "2024-01-15T00:00:00.000Z"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/verify-vc \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Cuerpo de solicitud

Todos los endpoints requieren:
- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido para get-vc y verify-vc): Identificador de credencial
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

## Respuestas

- **Listar IDs de VC**: Array de cadenas de ID de credenciales
- **Obtener VC**: Objeto de datos de credencial o null si no se encuentra
- **Verificar VC**: Objeto de estado con \`status\` ("valid" | "revoked") y timestamp opcional \`since\`
    `,
  },
  "api-vault-write": {
    slug: "api-vault-write",
    title: "Operaciones de Bóveda (Escritura)",
    section: "Referencia API",
    tocItems: [
      "Crear Bóveda",
      "Autorizar Emisor",
      "Autorizar Emisores (Múltiples)",
      "Revocar Emisor",
      "Revocar Bóveda",
      "Establecer nuevo propietario",
      "Migrate",
      "Crear Bóveda Patrocinada",
      "Flujo Prepare/Submit",
    ],
    content: `
# Operaciones de Bóveda (Escritura)

Operaciones de escritura para gestión de bóvedas. Todos los endpoints soportan flujo prepare/submit. No requiere autenticación.

## Crear Bóveda

### POST /contracts/vault/create

Crea (inicializa) una bóveda para un propietario.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Autorizar Emisor

### POST /contracts/vault/authorize-issuer

Añade un emisor autorizado a la bóveda de un propietario.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Autorizar Emisores (Múltiples)

### POST /contracts/vault/authorize-issuers

Reemplaza la lista completa de emisores autorizados de la bóveda con el array dado.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuers": ["G...", "G...", "G..."],
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Revocar Emisor

### POST /contracts/vault/revoke-issuer

Revoca la autorización de un emisor de una bóveda.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Revocar Bóveda

### POST /contracts/vault/revoke-vault

Revoca completamente una bóveda.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Establecer nuevo propietario

### POST /contracts/vault/set-new-owner

Establece el nuevo propietario de la bóveda (admin de bóveda). Debe ser firmado por el propietario actual.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "new_owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Migrate

### POST /contracts/vault/migrate

Migra los datos heredados de la bóveda de un propietario al formato actual.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Crear Bóveda Patrocinada

### POST /contracts/sponsored-vault/create

Crea una bóveda patrocinada para un propietario. Un patrocinador paga la creación de la bóveda en nombre del propietario. No requiere autenticación.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

**Parámetros:**
- **sponsor** (requerido): Dirección del patrocinador que paga la creación de la bóveda (G...)
- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **didUri** (requerido): DID URI del propietario de la bóveda
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el patrocinador)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

## Flujo Prepare/Submit

Todos los endpoints de escritura siguen el mismo patrón:

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Parámetros comunes:**
- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser firmante autorizado)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)
    `,
  },
  "api-credentials": {
    slug: "api-credentials",
    title: "Operaciones de Credenciales",
    section: "Referencia API",
    tocItems: [
      "Emitir Credencial",
      "Emitir Credencial Vinculada",
      "Revocar Credencial",
      "Cuerpo de solicitud",
      "Flujo Prepare/Submit",
    ],
    content: `
# Operaciones de Credenciales

Endpoints para emitir y revocar credenciales verificables. Todos soportan flujo prepare/submit. **Emitir Credencial** (\`POST /contracts/vc/issue\`) y **Emitir Credencial Vinculada** (\`POST /contracts/vc/issue-linked\`) requieren API key; **Revocar Credencial** no requiere autenticación.

## Emitir Credencial

### POST /contracts/vc/issue

Emite una VC: almacena el payload en la bóveda del propietario y escribe el estado de emisión = válido. **Requiere API key.**

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:pkh:stellar:testnet:G...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "holder": "did:pkh:stellar:testnet:G...",
  "issuerDid": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

**Ejemplo:**

\`\`\`bash
# Prepare
curl -X POST https://acta.build/api/testnet/contracts/vc/issue \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "holder": "did:pkh:stellar:testnet:G...",
    "sourcePublicKey": "G..."
  }'

# Submit (después de firmar)
curl -X POST https://acta.build/api/testnet/contracts/vc/issue \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Emitir Credencial Vinculada

### POST /contracts/vc/issue-linked

Emite una VC vinculada a una VC padre: almacena el payload en la bóveda del propietario con una referencia a la credencial padre. La VC padre debe existir y estar válida. **Requiere API key.**

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "linked-credential-456",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:pkh:stellar:testnet:G...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "holder": "did:pkh:stellar:testnet:G...",
  "issuerDid": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C...",
  "parentOwner": "G...",
  "parentVcId": "credential-123"
}
\`\`\`

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

**Ejemplo:**

\`\`\`bash
# Prepare
curl -X POST https://acta.build/api/testnet/contracts/vc/issue-linked \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "linked-credential-456",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "holder": "did:pkh:stellar:testnet:G...",
    "sourcePublicKey": "G...",
    "parentOwner": "G...",
    "parentVcId": "credential-123"
  }'

# Submit (después de firmar)
curl -X POST https://acta.build/api/testnet/contracts/vc/issue-linked \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Revocar Credencial

### POST /contracts/vc/revoke

Revoca una VC por ID. No requiere autenticación.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

**Cuerpo de solicitud (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Respuesta (Prepare):**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Cuerpo de solicitud

### Emitir Credencial

- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido): Identificador de credencial
- **vcData** (requerido): Payload de datos de credencial (JSON string). Debe incluir \`@context\` con al menos \`"https://www.w3.org/ns/credentials/v2"\`
- **issuer** (requerido): Dirección del emisor (G...)
- **holder** (requerido): DID del titular de la credencial en formato \`did:pkh:stellar:{network}:{address}\`
- **issuerDid** (opcional): DID del emisor en formato \`did:pkh:stellar:{network}:{address}\`
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el emisor)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

### Emitir Credencial Vinculada

- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido): Identificador de credencial
- **vcData** (requerido): Payload de datos de credencial (JSON string). Debe incluir \`@context\` con al menos \`"https://www.w3.org/ns/credentials/v2"\`
- **issuer** (requerido): Dirección del emisor (G...)
- **holder** (requerido): DID del titular de la credencial en formato \`did:pkh:stellar:{network}:{address}\`
- **issuerDid** (opcional): DID del emisor en formato \`did:pkh:stellar:{network}:{address}\`
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el emisor)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)
- **parentOwner** (requerido): Dirección del propietario de la VC padre (G...)
- **parentVcId** (requerido): Identificador de la VC padre

### Revocar Credencial

- **vcId** (requerido): Identificador de credencial
- **date** (opcional): Timestamp ISO-8601 (por defecto: ahora)
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser propietario de VC o admin del contrato)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

## Flujo Prepare/Submit

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`xdr\` devuelto con tu wallet Stellar usando el \`network\` passphrase
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Nota:** El endpoint \`issue\` almacena automáticamente la credencial en la bóveda y la marca como válida en una sola transacción.
    `,
  },
  // dApp Section
  "dapp-overview": {
    slug: "dapp-overview",
    title: "Resumen",
    section: "dApp",
    tocItems: [
      "¿Qué es el dApp de ACTA?",
      "Características principales",
      "Primeros pasos",
      "Acceder al dApp",
    ],
    content: `
# Resumen del dApp de ACTA

El dApp de ACTA es una aplicación web moderna que proporciona una interfaz amigable para emitir, gestionar, compartir y autorizar credenciales verificables. Construido con Next.js 16, React 19 y el SDK de ACTA, ofrece una solución completa de gestión de credenciales sin requerir conocimientos de programación.

## ¿Qué es el dApp de ACTA?

El dApp de ACTA es una aplicación descentralizada que te permite:

- **Emitir credenciales** a usuarios y gestionar la autorización de emisores
- **Mantener una bóveda** de credenciales con búsqueda, compartición y revocación
- **Compartir credenciales** con pruebas de conocimiento cero para privacidad
- **Autorizar emisores** para controlar quién puede emitir credenciales a tu bóveda
- **Verificar credenciales** on-chain y verificar pruebas ZK
- **Gestionar API keys** para acceso programático

Todas las operaciones se realizan directamente en la blockchain Stellar a través de contratos inteligentes Soroban, garantizando una gestión de credenciales no custodiada.

## Características principales

### Gestión de Credenciales

- Crear y emitir credenciales verificables
- Almacenar credenciales en tu bóveda personal
- Buscar y filtrar credenciales
- Compartir credenciales con divulgación selectiva de campos
- Revocar credenciales cuando sea necesario

### Autorización de Emisores

- Autorizar wallets específicas para emitir credenciales a tu bóveda
- Gestionar la lista de emisores autorizados
- Controlar quién puede crear credenciales para ti

### Pruebas de Conocimiento Cero

- Generar pruebas ZK para predicados de credenciales
- Compartir credenciales con pruebas que preservan la privacidad
- Verificar pruebas sin revelar datos privados
- Soporte para múltiples tipos de predicados (verificación de edad, expiración, estado)

### Gestión de API Keys

- Crear y gestionar API keys para testnet y mainnet
- Keys con rol estándar con expiración de 6 meses
- Integración fácil con la API de ACTA

### Onboarding Guiado

- Tutoriales interactivos para usuarios primerizos
- Guía de inicio rápido con instrucciones paso a paso
- Ayuda contextual en toda la aplicación

## Primeros pasos

Para comenzar a usar el dApp de ACTA:

1. **Conecta tu wallet** - Vincula tu wallet Stellar (Freighter, etc.)
2. **Elige la red** - Selecciona testnet (para pruebas) o mainnet
3. **Crea tu bóveda** - Inicializa tu bóveda personal de credenciales
4. **Autoriza emisores** - Otorga permisos a wallets confiables
5. **Comienza a emitir** - Crea y gestiona tus credenciales

Consulta la [Guía de Primeros Pasos](#dapp-getting-started) para instrucciones detalladas.

## Acceder al dApp

El dApp de ACTA está disponible en:

\`\`\`
https://dapp.acta.build
\`\`\`

No se requiere instalación - simplemente visita la URL en tu navegador web y conecta tu wallet Stellar para comenzar.
    `,
  },
  "dapp-getting-started": {
    slug: "dapp-getting-started",
    title: "Primeros Pasos",
    section: "dApp",
    tocItems: [
      "Paso 1: Conectar Wallet",
      "Paso 2: Crear Bóveda",
      "Paso 3: Autorizar Emisores",
      "Paso 4: Emitir Credenciales",
      "Siguientes pasos",
    ],
    content: `
# Primeros Pasos con el dApp de ACTA

Sigue estos pasos para comenzar a usar el dApp de ACTA para la gestión de credenciales.

## Paso 1: Conectar Wallet y Elegir Red

El primer paso es conectar tu wallet Stellar al dApp.

1. Visita [https://dapp.acta.build](https://dapp.acta.build)
2. Haz clic en el botón de conexión de wallet
3. Selecciona tu wallet Stellar (Freighter, WalletConnect, etc.)
4. Aprueba la solicitud de conexión
5. Elige tu red:
   - **Testnet** - Para pruebas y desarrollo
   - **Mainnet** - Para uso en producción

Una vez conectado, tu dirección de wallet se mostrará en el header.

## Paso 2: Crear tu Bóveda Personal

Tu bóveda es tu almacenamiento seguro para credenciales. Cada dirección de wallet tiene su propia bóveda aislada.

1. Navega a la sección **Dashboard** o **Vault**
2. Si aún no tienes una bóveda, verás una opción para crear una
3. Haz clic en **Create Vault** o **Initialize Vault**
4. Firma la transacción con tu wallet
5. Tu bóveda ahora está lista para almacenar credenciales

La creación de la bóveda es una operación única por dirección de wallet.

## Paso 3: Autorizar Emisores

Antes de poder recibir credenciales, necesitas autorizar wallets que puedan emitir credenciales a tu bóveda.

1. Ve a la sección **Authorize** en el sidebar
2. Ingresa la dirección de wallet del emisor que quieres autorizar
3. Haz clic en **Authorize Issuer**
4. Firma la transacción con tu wallet
5. El emisor autorizado aparecerá en tu lista de emisores autorizados

**Nota:** Solo los emisores autorizados pueden crear credenciales en tu bóveda. Esto te da control sobre quién puede emitir credenciales para ti.

## Paso 4: Emitir Credenciales

Una vez que tengas una bóveda y emisores autorizados, puedes comenzar a emitir credenciales.

1. Navega a la sección **Issue**
2. Completa el formulario de credencial:
   - **Credential ID** - Identificador único
   - **Credential Data** - La información real de la credencial (formato JSON)
   - **Owner** - La dirección de wallet que recibirá la credencial
   - **Issuer DID** (opcional) - Tu DID de emisor
3. Haz clic en **Issue Credential**
4. Firma la transacción con tu wallet
5. La credencial se almacenará en la bóveda del propietario y se marcará como válida

La credencial ahora está on-chain y puede ser verificada por cualquiera.

## Siguientes pasos

Después de completar la configuración inicial:

- **Ver Credenciales** - Ve a la sección **Vault** o **Credentials** para ver todas tus credenciales
- **Compartir Credenciales** - Usa la función de compartir para crear enlaces compartibles con pruebas ZK
- **Gestionar API Keys** - Crea API keys para acceso programático en la sección **API Keys**
- **Explorar Tutoriales** - Revisa la sección **Tutorials** para guías paso a paso

Para más información sobre funcionalidades específicas, consulta la guía de [Funcionalidades del dApp](#dapp-features).
    `,
  },
  "dapp-features": {
    slug: "dapp-features",
    title: "Funcionalidades",
    section: "dApp",
    tocItems: [
      "Emitir Credenciales",
      "Gestión de Bóveda",
      "Compartir Credenciales",
      "Autorizar Emisores",
      "Gestión de API Keys",
      "Pruebas de Conocimiento Cero",
    ],
    content: `
# Funcionalidades del dApp

Vista detallada de todas las funcionalidades disponibles en el dApp de ACTA.

## Emitir Credenciales

Crea y emite credenciales verificables a cualquier dirección de wallet Stellar.

### Cómo Emitir

1. Navega a **Issue** en el sidebar
2. Completa el formulario de credencial:
   - **Credential ID**: Identificador único para la credencial
   - **Credential Data**: Datos JSON que contienen la información de la credencial
   - **Owner**: Dirección de wallet Stellar (G...) que recibirá la credencial
   - **Issuer DID** (opcional): Tu identificador DID
3. Haz clic en **Issue Credential**
4. Firma la transacción

La credencial se:
- Almacena automáticamente en la bóveda del propietario
- Marca como válida on-chain
- Hace disponible para verificación

## Gestión de Bóveda

Tu bóveda es tu almacenamiento personal de credenciales. Cada wallet tiene una bóveda aislada.

### Ver Credenciales

1. Ve a la sección **Vault** o **Credentials**
2. Ve todas las credenciales almacenadas en tu bóveda
3. Usa búsqueda y filtros para encontrar credenciales específicas
4. Haz clic en una credencial para ver detalles

### Acciones de Credenciales

- **Ver Detalles** - Ver información completa de la credencial
- **Compartir** - Crear un enlace compartible con divulgación selectiva de campos
- **Revocar** - Revocar una credencial si es necesario
- **Verificar** - Verificar el estado on-chain

## Compartir Credenciales

Comparte credenciales con pruebas de conocimiento cero que preservan la privacidad.

### Flujo de Compartición

1. Ve a tu **Vault** y selecciona una credencial
2. Haz clic en el botón **Share**
3. Elige qué campos revelar
4. Selecciona un predicado ZK (opcional):
   - Edad ≥ 18
   - No expirado
   - Estado es válido
5. Haz clic en **Generate ZK Proof**
6. Copia el enlace de compartir

El enlace de compartir contiene:
- Solo los campos seleccionados revelados
- Prueba ZK para el predicado seleccionado
- Señales públicas para verificación

Los destinatarios pueden verificar la prueba sin ver tus datos privados.

## Autorizar Emisores

Controla quién puede emitir credenciales a tu bóveda.

### Autorizar un Emisor

1. Ve a la sección **Authorize**
2. Ingresa la dirección de wallet del emisor
3. Haz clic en **Authorize Issuer**
4. Firma la transacción

### Gestionar Emisores Autorizados

- Ver todos los emisores autorizados
- Revocar autorización si es necesario
- Solo los emisores autorizados pueden crear credenciales en tu bóveda

## Gestión de API Keys

Crea y gestiona API keys para acceso programático a la API de ACTA.

### Crear API Key

1. Navega a la sección **API Keys**
2. Elige la red (Testnet o Mainnet)
3. Ingresa un nombre para tu API key (opcional)
4. Haz clic en **Create API Key**
5. **Guarda la key inmediatamente** - no se mostrará de nuevo

Las API keys tienen:
- **Rol estándar** - Acceso a endpoints públicos
- **Expiración de 6 meses** - Las keys expiran después de 6 meses
- **Específicas de red** - Keys separadas para testnet y mainnet

### Usar API Keys

Usa tu API key en solicitudes a la API:

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

Consulta la [Referencia API](#api-overview) para todos los endpoints disponibles.

## Pruebas de Conocimiento Cero

El dApp soporta compartir credenciales con pruebas de conocimiento cero para verificación que preserva la privacidad. Consulta la sección [Pruebas de Conocimiento Cero](#zk-overview) para información detallada sobre circuitos ZK, predicados y verificación.
    `,
  },
  // Sección de Pruebas de Conocimiento Cero
  "zk-overview": {
    slug: "zk-overview",
    title: "Resumen",
    section: "Pruebas de Conocimiento Cero",
    tocItems: [
      "¿Qué son las Pruebas de Conocimiento Cero?",
      "Cómo Funcionan las Pruebas ZK en ACTA",
      "Beneficios Clave",
      "Arquitectura",
    ],
    content: `
# Resumen de Pruebas de Conocimiento Cero

ACTA soporta pruebas de conocimiento cero (ZK) que te permiten probar predicados de credenciales sin revelar datos privados. Esto permite compartir y verificar credenciales preservando la privacidad.

## ¿Qué son las Pruebas de Conocimiento Cero?

Las pruebas de conocimiento cero son protocolos criptográficos que permiten que una parte (el probador) pruebe a otra parte (el verificador) que una declaración es verdadera sin revelar ninguna información más allá de la validez de la declaración misma.

En el contexto de ACTA:
- **Probador**: El titular de la credencial que quiere probar algo sobre su credencial
- **Verificador**: La parte que necesita verificar la prueba (ej: un servicio que requiere verificación de edad)
- **Declaración**: Un predicado sobre la credencial (ej: "edad ≥ 18", "no expirado", "estado es válido")

## Cómo Funcionan las Pruebas ZK en ACTA

1. **Titular de la Credencial** selecciona qué campos revelar y elige un predicado a probar
2. **Generación de Prueba** ocurre del lado del cliente usando circuitos Noir y bb.js
3. **Enlace de Compartir** se crea conteniendo los campos revelados y la prueba ZK
4. **Verificación** ocurre on-chain vía contratos inteligentes de Soroban (Protocolo 25)

### Generación vs Verificación

- **Generación**: Del lado del cliente en el navegador usando Noir y bb.js
- **Verificación**: On-chain vía contrato verificador ZK de Soroban
- **Protección contra Reutilización**: Usa nullifiers para prevenir reutilización de pruebas

## Beneficios Clave

### Privacidad

- Solo los campos seleccionados se revelan a los verificadores
- Los datos privados (como edad exacta o fecha de expiración) permanecen ocultos
- La divulgación selectiva te da control sobre qué información compartir

### Seguridad

- Las pruebas criptográficas son matemáticamente verificables
- No es necesario confiar en un tercero
- La verificación on-chain asegura la integridad de la prueba
- Los nullifiers previenen ataques de reutilización

### Flexibilidad

- Múltiples tipos de predicados disponibles
- Se puede combinar con divulgación selectiva de campos
- Funciona con cualquier estructura de credencial

## Arquitectura

### Componentes

1. **Circuitos Noir** - Definen la lógica para cada predicado
   - Escritos en lenguaje Noir
   - Compilados a ACIR (Abstract Circuit Intermediate Representation)
   - Servidos como archivos JSON desde el dApp

2. **Generación de Prueba** - Del lado del cliente usando:
   - \`@noir-lang/noir_js\` - Bindings de JavaScript para Noir
   - \`@aztec/bb.js\` - Backend de Barretenberg para generación de pruebas

3. **Verificación de Prueba** - On-chain vía:
   - Contrato verificador ZK de Soroban
   - Soporte del Protocolo 25 para verificación ZK
   - Claves de verificación (vk) almacenadas en el contrato

### Flujo

\`\`\`
Titular de Credencial → Seleccionar Campos → Elegir Predicado → Generar Prueba (Cliente) → Enlace de Compartir
                                                                                                      ↓
Verificador ← Verificar Prueba (On-chain) ← Recibir Enlace de Compartir ← Titular de Credencial
\`\`\`

Consulta la sección [Circuitos](#zk-circuits) para información detallada sobre los predicados disponibles y su implementación.
    `,
  },
  "zk-circuits": {
    slug: "zk-circuits",
    title: "Circuitos",
    section: "Pruebas de Conocimiento Cero",
    tocItems: [
      "Edad ≥ 18 (isAdult)",
      "No Expirado (notExpired)",
      "Estado es Válido (isValid)",
      "Estructura del Circuito",
      "Artefactos ACIR",
    ],
    content: `
# Circuitos ZK

ACTA usa circuitos Noir para definir predicados de pruebas ZK. Cada circuito se compila a ACIR (Abstract Circuit Intermediate Representation) y se usa para generación y verificación de pruebas.

## Edad ≥ 18 (isAdult)

Prueba que una persona tiene al menos 18 años sin revelar su edad exacta.

### Código del Circuito

\`\`\`rust
fn main(age: u8) {
    assert(age > 18);
}
\`\`\`

### Entradas

- **Entrada Privada**: \`age: u8\` - La edad de la persona (no revelada)

### Salida

- **Salida Pública**: \`bool\` → \`true\` si \`age >= 18\`, de lo contrario el circuito falla

### Cómo Funciona

1. Extraer fecha de nacimiento de la credencial
2. Calcular edad desde fecha de nacimiento hasta fecha actual
3. Pasar edad al circuito como entrada privada
4. El circuito asevera \`age > 18\`
5. Generar prueba sin revelar el valor real de la edad

### Casos de Uso

- Verificación de edad para servicios con restricción de edad
- Cumplimiento con requisitos legales de edad
- Verificaciones de edad que preservan la privacidad

### Artefacto ACIR

\`\`\`
noir_workshop.json
\`\`\`

## No Expirado (notExpired)

Prueba que una credencial no ha expirado sin revelar la fecha de expiración.

### Código del Circuito

\`\`\`rust
fn main(expiry_ts: u64, now_ts: u64) {
    assert(expiry_ts > now_ts);
}
\`\`\`

### Entradas

- **Entradas Privadas**: 
  - \`expiry_ts: u64\` - Timestamp de expiración en milisegundos (no revelado)
  - \`now_ts: u64\` - Timestamp actual en milisegundos (calculado off-chain)

### Salida

- **Salida Pública**: \`bool\` → \`true\` si \`expiry_ts > now_ts\`, de lo contrario el circuito falla

### Cómo Funciona

1. Extraer fecha de expiración de la credencial
2. Obtener timestamp actual (calculado off-chain)
3. Pasar ambos timestamps al circuito como entradas privadas
4. El circuito asevera \`expiry_ts > now_ts\`
5. Generar prueba sin revelar la fecha de expiración real

### Casos de Uso

- Verificar que la credencial sigue siendo válida
- Verificar si la credencial no ha expirado
- Control de acceso basado en tiempo

### Artefacto ACIR

\`\`\`
noir_not_expired.json
\`\`\`

## Estado es Válido (isValid)

Prueba que una credencial tiene un estado válido sin revelar otros detalles de estado.

### Código del Circuito

\`\`\`rust
fn main(valid: Field) {
    assert(valid == 1);
}
\`\`\`

### Entradas

- **Entrada Privada**: \`valid: Field\` - Bandera de estado (1 para válido, 0 para inválido)

### Salida

- **Salida Pública**: \`bool\` → \`true\` si \`valid == 1\`, de lo contrario el circuito falla

### Cómo Funciona

1. Extraer estado de la credencial
2. Convertir estado a bandera: \`status === 'valid' ? 1 : 0\`
3. Pasar bandera al circuito como entrada privada
4. El circuito asevera \`valid == 1\`
5. Generar prueba sin revelar otra información de estado

### Casos de Uso

- Verificar que la credencial no está revocada
- Verificar estado de la credencial
- Autorización basada en estado

### Artefacto ACIR

\`\`\`
noir_valid_status.json
\`\`\`

## Estructura del Circuito

Todos los circuitos siguen una estructura similar:

1. **Definición de Entradas** - Entradas privadas que no se revelarán
2. **Lógica de Aseveración** - La condición a probar
3. **Compilación** - Compilado a formato JSON ACIR
4. **Despliegue** - Archivos ACIR servidos desde directorio \`public/zk/\`

### Compilación

Los circuitos se compilan usando \`nargo\`:

\`\`\`bash
nargo compile
\`\`\`

Esto genera el archivo JSON ACIR en el directorio \`target/\`.

## Artefactos ACIR

Los archivos ACIR (Abstract Circuit Intermediate Representation) son los circuitos compilados:

- \`noir_workshop.json\` - Circuito de edad ≥ 18
- \`noir_not_expired.json\` - Circuito de no expirado
- \`noir_valid_status.json\` - Circuito de estado válido

Estos archivos son:
- Cargados por el dApp desde el directorio \`public/zk/\`
- Usados para generación de pruebas en el navegador
- Referenciados por el contrato verificador on-chain

### Publicar Circuitos

Para publicar un circuito para uso en el dApp:

1. Compilar el circuito: \`nargo compile\`
2. Copiar JSON ACIR a \`dApp-ACTA/public/zk/\`
3. El dApp lo cargará automáticamente

Consulta el [repositorio zk-test](https://github.com/ACTA-Team/zk-test) para el código fuente de los circuitos e instrucciones de compilación.
    `,
  },
  "zk-generation": {
    slug: "zk-generation",
    title: "Generación de Pruebas",
    section: "Pruebas de Conocimiento Cero",
    tocItems: [
      "Resumen",
      "Proceso de Generación",
      "Preparación de Entradas",
      "Ejecución del Circuito",
      "Artefactos de Prueba",
      "Integración en dApp",
    ],
    content: `
# Generación de Pruebas ZK

Las pruebas ZK en ACTA se generan del lado del cliente en el navegador usando circuitos Noir y backend bb.js.

## Resumen

La generación de pruebas ocurre completamente en el navegador del usuario:
- No se envían datos a servidores durante la generación
- Las entradas privadas permanecen privadas
- Las pruebas se generan usando bibliotecas criptográficas

### Tecnologías

- **Noir** - Lenguaje de circuitos y bindings de JavaScript (\`@noir-lang/noir_js\`)
- **bb.js** - Backend de Barretenberg (\`@aztec/bb.js\`) para generación de pruebas
- **ACIR** - Representación de circuito compilado cargada desde archivos JSON

## Proceso de Generación

### Paso 1: Seleccionar Campos y Predicado

Al compartir una credencial en el dApp:

1. **Seleccionar Campos a Revelar**
   - Elige qué campos de la credencial deben ser visibles
   - Otros campos permanecen privados

2. **Elegir Predicado ZK**
   - Selecciona de los predicados disponibles:
     - \`isAdult\` - Edad ≥ 18
     - \`notExpired\` - Credencial no expirada
     - \`isValid\` - Estado es válido

### Paso 2: Preparación de Entradas

El dApp extrae y prepara entradas basándose en el predicado seleccionado:

#### Para \`isAdult\`:

\`\`\`typescript
// Extraer fecha de nacimiento de la credencial
const dob = credential.birthDate;
const ageYears = calculateAge(dob);

// Entrada: { age: ageYears }
\`\`\`

#### Para \`notExpired\`:

\`\`\`typescript
// Extraer timestamp de expiración y actual
const expiry_ts = Date.parse(credential.expirationDate);
const now_ts = Date.now();

// Entrada: { expiry_ts, now_ts }
\`\`\`

#### Para \`isValid\`:

\`\`\`typescript
// Convertir estado a bandera
const valid = credential.status === 'valid' ? '1' : '0';

// Entrada: { valid }
\`\`\`

### Paso 3: Ejecución del Circuito

1. **Cargar ACIR** - Obtener el JSON del circuito desde \`public/zk/\`
2. **Inicializar Noir** - Crear instancia de Noir con ACIR
3. **Inicializar Backend** - Crear backend bb.js
4. **Ejecutar Circuito** - Ejecutar circuito con entradas privadas
5. **Generar Witness** - Crear witness desde resultado de ejecución

\`\`\`typescript
const { Noir } = await import('@noir-lang/noir_js');
const { UltraHonkBackend } = await import('@aztec/bb.js');

// Cargar ACIR
const acir = await fetch('/zk/noir_workshop.json').then(r => r.json());

// Inicializar
const noir = new Noir(acir);
const backend = new UltraHonkBackend(acir.bytecode);

// Ejecutar
const execRes = await noir.execute({ age: ageYears });

// Generar prueba
const proofData = await backend.generateProof(execRes.witness);
\`\`\`

### Paso 4: Artefactos de Prueba

La generación produce:

- **Prueba** - La prueba criptográfica (codificada en base64)
- **Entradas Públicas** - Señales públicas que son parte de la prueba
- **Declaración** - Metadatos sobre el predicado y campos revelados

\`\`\`typescript
{
  proof: string,           // Prueba codificada en base64
  publicInputs: string[],  // Señales públicas
  statement: {
    kind: 'isAdult' | 'notExpired' | 'isValid',
    selectedKeys: string[],
    // ... parámetros específicos del predicado
  }
}
\`\`\`

## Artefactos de Prueba

### Estructura de la Prueba

La prueba es un objeto JSON que contiene:

\`\`\`json
{
  "publicInputs": ["..."],
  "proof": "base64_encoded_proof_bytes"
}
\`\`\`

### Entradas Públicas

Las entradas públicas son valores que son parte de la prueba pero no revelan datos privados:
- Para \`isAdult\`: Vacío (la edad es privada)
- Para \`notExpired\`: Vacío (los timestamps son privados)
- Para \`isValid\`: Vacío (la bandera de estado es privada)

### Metadatos de la Declaración

La declaración contiene:
- \`kind\` - Tipo de predicado
- \`selectedKeys\` - Campos que fueron revelados
- Parámetros específicos del predicado (para referencia, no parte de la prueba)

## Integración en dApp

La generación de pruebas está integrada en el flujo de compartir del dApp:

1. Usuario selecciona credencial a compartir
2. Elige campos a revelar
3. Selecciona predicado ZK
4. Haz clic en **Generate ZK Proof**
5. La prueba se genera del lado del cliente
6. Se crea enlace de compartir con la prueba incluida

### Ubicación del Código

- Lógica de generación: \`dApp-ACTA/src/lib/zk/generate.ts\`
- Integración: \`dApp-ACTA/src/components/modules/credentials/hooks/useShareCredential.ts\`

### Notas de Seguridad

- Toda la generación ocurre del lado del cliente
- Las entradas privadas nunca salen del navegador
- Las pruebas son criptográficamente seguras
- No se requiere procesamiento del lado del servidor
    `,
  },
  "zk-verification": {
    slug: "zk-verification",
    title: "Verificación de Pruebas",
    section: "Pruebas de Conocimiento Cero",
    tocItems: [
      "Resumen",
      "Verificación On-Chain",
      "Proceso de Verificación",
      "Nullifiers y Protección contra Reutilización",
      "Resultado de Verificación",
      "Endpoint API",
    ],
    content: `
# Verificación de Pruebas ZK

Las pruebas ZK en ACTA se verifican on-chain vía contratos inteligentes de Soroban usando soporte de verificación ZK del Protocolo 25.

## Resumen

A diferencia de la generación de pruebas (que es del lado del cliente), la verificación ocurre on-chain:
- **Ubicación**: Contrato verificador ZK de Soroban
- **Método**: Verificación ZK del Protocolo 25
- **Seguridad**: Verificación criptográfica con protección contra reutilización
- **Confianza**: No es necesario confiar en terceros

### ¿Por Qué Verificación On-Chain?

- **Inmutabilidad** - Los resultados de verificación se registran permanentemente
- **Sin Confianza** - No es necesario confiar en servidores de verificación
- **Transparencia** - La lógica de verificación está on-chain
- **Protección contra Reutilización** - Los nullifiers previenen reutilización de pruebas

## Verificación On-Chain

La verificación es realizada por el contrato verificador ZK de Soroban:

1. **El Contrato Recibe**:
   - ID del Circuito (identifica qué circuito usar)
   - Prueba (la prueba criptográfica)
   - Entradas públicas (señales públicas)
   - Nullifier (para protección contra reutilización)

2. **El Contrato Verifica**:
   - Carga clave de verificación (vk) para el circuito
   - Verifica la prueba criptográficamente
   - Verifica que el nullifier no se ha usado antes
   - Registra resultado de verificación on-chain

3. **Resultado**:
   - Hash de transacción
   - Número de ledger
   - Estado de verificación (verificado/no verificado)

## Proceso de Verificación

### Paso 1: Preparar Payload de Verificación

Desde el enlace de credencial compartida, extraer:

\`\`\`typescript
{
  statement: {
    kind: 'isAdult' | 'notExpired' | 'isValid',
    // ... otros metadatos
  },
  proof: string,              // Prueba codificada en base64
  publicSignals: string[],    // Entradas públicas
  commitment: string,          // Compromiso de credencial
  nonce: string,              // Nonce para nullifier
  credentialId: string,       // Identificador de credencial
  verifierContractId?: string // Sobrescritura opcional de contrato
}
\`\`\`

### Paso 2: Generar Nullifier

El nullifier previene ataques de reutilización haciendo cada prueba única:

\`\`\`typescript
// Nullifier = hash(commitment + nonce + proof_hash)
const nullifier = await generateNullifier({
  commitment,
  nonce,
  proof
});
\`\`\`

### Paso 3: Llamar API de Verificación

Enviar solicitud de verificación a la API de ACTA:

\`\`\`bash
POST /contracts/zk-verifier/verify
\`\`\`

**Cuerpo de Solicitud:**

\`\`\`json
{
  "circuitId": "isAdult",
  "proof": "base64_proof",
  "publicInputs": ["..."],
  "nullifier": "hex_nullifier",
  "verifierContractId": "C..."
}
\`\`\`

### Paso 4: Verificación On-Chain

La API:
1. Invoca el contrato verificador ZK de Soroban
2. El contrato verifica la prueba usando la clave de verificación almacenada
3. Verifica que el nullifier no se ha usado
4. Registra verificación on-chain
5. Devuelve hash de transacción y resultado

### Paso 5: Resultado de Verificación

**Respuesta:**

\`\`\`json
{
  "verified": true,
  "txHash": "abc123...",
  "ledger": 12345,
  "network": "testnet"
}
\`\`\`

## Nullifiers y Protección contra Reutilización

Los nullifiers aseguran que cada prueba solo se puede verificar una vez, previniendo ataques de reutilización.

### Cómo Funcionan los Nullifiers

1. **Generar Nullifier**:
   \`\`\`
   nullifier = SHA-256(commitment + nonce + proof_hash)
   \`\`\`

2. **Verificar On-Chain**:
   - El contrato mantiene un conjunto de nullifiers usados
   - Si el nullifier existe → la prueba ya fue usada → rechazar
   - Si el nullifier no existe → agregar al conjunto → verificar prueba

3. **Unicidad**:
   - Cada instancia de prueba tiene commitment + nonce únicos
   - Incluso misma credencial + predicado = nullifier diferente
   - Previene reutilización de pruebas

### Beneficios

- **Protección contra Reutilización** - La misma prueba no se puede verificar dos veces
- **Privacidad** - El nullifier no revela contenido de la credencial
- **Eficiencia** - Verificación simple de hash on-chain

## Resultado de Verificación

### Respuesta de Éxito

\`\`\`json
{
  "verified": true,
  "txHash": "transaction_hash",
  "ledger": 12345,
  "network": "testnet",
  "result": { ... }
}
\`\`\`

### Respuesta de Falla

\`\`\`json
{
  "verified": false,
  "error": "error_message",
  "network": "testnet"
}
\`\`\`

### Errores Comunes

- \`Invalid payload\` - Faltan campos requeridos
- \`No proof to verify\` - El tipo de predicado es 'none'
- \`Missing commitment\` - No se proporcionó commitment
- \`Missing nonce\` - No se proporcionó nonce
- \`Invalid proof format\` - La estructura de la prueba es inválida
- \`Proof verification failed\` - La verificación criptográfica falló
- \`Nullifier already used\` - La prueba ya fue verificada

## Endpoint API

### POST /contracts/zk-verifier/verify

Verifica una prueba ZK on-chain vía contrato de Soroban.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de Solicitud:**

\`\`\`json
{
  "circuitId": "isAdult",
  "proof": "base64_encoded_proof",
  "publicInputs": ["public_signal_1", "public_signal_2"],
  "nullifier": "hex_nullifier_string",
  "verifierContractId": "C..."
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "verified": true,
  "txHash": "abc123...",
  "ledger": 12345,
  "result": {},
  "network": "testnet"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/zk-verifier/verify \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "circuitId": "isAdult",
    "proof": "...",
    "publicInputs": [],
    "nullifier": "..."
  }'
\`\`\`

### Parámetros

- **circuitId** (requerido): Identificador del circuito (\`"isAdult"\`, \`"notExpired"\`, \`"isValid"\`)
- **proof** (requerido): Prueba codificada en base64
- **publicInputs** (requerido): Array de cadenas de entrada pública
- **nullifier** (requerido): Nullifier codificado en hex para protección contra reutilización
- **verifierContractId** (opcional): Sobrescribir ID del contrato verificador
    `,
  },
  "scf-42": {
    slug: "scf-42",
    title: "SCF 42",
    section: "SCF",
    tocItems: [
      "Resumen",
      "Stellar DID Method (v0.1)",
      "Formato de identificador y binding de red",
      "Modelo DID Document",
      "Derivación de claves nativa",
      "Prueba de control",
      "Resolución determinística",
      "Resolver de referencia (OSS)",
      "Contratos Soroban",
      "API/SDK testnet",
      "Hito ZK (Stellar X-Ray)",
      "Resumen ZK",
      "Circuitos y predicados",
      "Binding de credencial y DID",
      "Nullifier y protección contra replay",
      "Interfaz del contrato verificador",
      "Primitivos BN254",
      "Setup de confianza y artefactos",
      "Modelo de amenazas y límites",
      "PoC ejecutable mínimo",
    ],
    content: `
# SCF 42

Arquitectura técnica de SCF 42: método DID Stellar, tooling de resolución, contratos Soroban para credenciales y bóvedas, y API/SDK en testnet.

## Resumen

- **Stellar DID Method (v0.1) + tooling de resolución** — Especificación y resolver open-source para que los identificadores \`did:stellar\` resuelvan a DID Documents para emisión y verificación de Credenciales Verificables.
- **Contratos Soroban** — Ciclo de vida de credenciales, bóvedas cifradas, aceptación de emisores controlada por el holder, niveles de fee en USDC y versionado.
- **API/SDK testnet** — Release estable y versionada en testnet con firma por wallet y flujos reproducibles de extremo a extremo.

## Stellar DID Method (v0.1)

El alcance v0.1 es single-signature y listo para el ecosistema.

### Formato de identificador y binding de red

Sintaxis normativa del identificador ligada a redes Stellar:

\`\`\`
did:stellar:<network>:<accountId>
\`\`\`

- **<network>**: \`mainnet\` | \`testnet\`
- **<accountId>**: clave pública Stellar StrKey (G...)

Representación de cuenta agnóstica de cadena (estilo blockchainAccountId):

\`\`\`
stellar:mainnet:<G...>   /   stellar:testnet:<G...>
\`\`\`

### Modelo mínimo de DID Document (listo para VC)

El DID Document v0.1 incluye el material de verificación mínimo para flujos VC y sigue el modelo de datos [W3C DID Core](https://w3c.github.io/did/#did-document-properties). Propiedades requeridas: \`id\`, \`verificationMethod\`, \`authentication\`, \`assertionMethod\`.

Ejemplo de estructura para \`did:stellar\` (v0.1, single-sig, Ed25519). Esta estructura puede variar en versiones futuras:

\`\`\`json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM",
  "verificationMethod": [{
    "id": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM",
    "publicKeyMultibase": "z6Mk...",
    "blockchainAccountId": "stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM"
  }],
  "authentication": [
    "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller"
  ],
  "assertionMethod": [
    "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller"
  ]
}
\`\`\`

Consulta [DID Document properties (W3C)](https://w3c.github.io/did/#did-document-properties) para la definición normativa completa.

### Derivación de claves nativa desde estado de cuenta Stellar (solo single-sig)

El DID Document se construye de forma determinística desde la configuración de la cuenta on-ledger:

- \`verificationMethod\` se deriva del signer de la cuenta (clave Ed25519).
- v0.1 se limita a cuentas de una sola firma (un signer Ed25519 efectivo).
- Las cuentas con multisig (múltiples signers y/o umbrales) quedan fuera de alcance y DEBEN devolver un error tipado (ej. \`unsupportedAccountConfiguration\`) o tratarse como no soportadas por política.
- En v0.1 solo se exponen claves Ed25519 como \`verificationMethod\`; otros tipos de signer no se soportan o solo se reflejan en metadata.

### Prueba de control (issuer/holder)

Mecanismo estándar para probar control del identificador \`did:stellar\` vía firma de wallet:

- **Opción A (simple)**: Firma Ed25519 sobre un challenge canónico (nonce + domain + DID + timestamp).
- **Opción B (wallet-friendly)**: Firma de challenge estilo SEP-10 para flujos de wallet Stellar existentes.

En v0.1 se define una opción como recomendada y la otra como alternativa compatible, con canonicalización y reglas anti-replay (nonce, binding de dominio, expiración).

### Reglas de resolución determinística (normativas)

La resolución es determinística y usa solo estado público del ledger:

1. Parsear y validar el DID (network, StrKey).
2. Obtener estado de la cuenta vía Horizon/RPC.
3. Validar restricciones de cuenta v0.1 (single-sig).
4. Construir el DID Document desde: signer de la cuenta (verification methods), entradas ManageData opcionales bajo un namespace reservado (services/attributes). Por límites de tamaño de ManageData, v0.1 almacena sobre todo punteros/URIs cortos, no payloads grandes.
5. Devolver un DID Resolution Result con: \`didDocument\`, \`didResolutionMetadata\` (errores: \`invalidDid\`, \`unknownNetwork\`, \`notFound\`, \`unsupportedFormat\`, \`unsupportedAccountConfiguration\`), \`didDocumentMetadata\` (network, info de ledger, updated/versioning donde exista).

### Resolver de referencia (OSS)

Resolver open-source compatible con la interfaz DIF did-resolver (JS/TS):

- Multi-red (mainnet/testnet)
- \`did+json\` y \`did+ld+json\`
- Utilidades SDK: parse/normalización de DID, builder/verificador de challenge canónico (prueba de control), ejemplos de extremo a extremo para emisores/verificadores en flujos VC.

El borrador se desarrolla con asesoría de un contribuidor activo en estandarización de identidad W3C (alineación con DID Core / DID Resolution).

## Contratos Soroban (credenciales + bóvedas cifradas)

Los contratos Soroban (Rust) ofrecen una superficie clara y orientada a producción en testnet:

- **Ciclo de vida de credenciales**: Emitir, verificar, revocar; anclaje on-chain y chequeos de estado, incluyendo estado de revocación.
- **Bóvedas cifradas**: Operaciones de bóveda por holder (store/list/get), compartición y transferencia controlada de credenciales donde aplique.
- **Aceptación de emisores controlada por el holder** (permissionless, anti-spam): ACTA no restringe quién puede emitir en Stellar; controles por holder a nivel de bóveda: **Requerido**: blocklist de emisores por holder aplicada en escritura de bóveda (las escrituras de emisores bloqueados fallan de forma determinística). **Por defecto configurable**: política de bóveda soporta modo “accept-all” con camino extensible a modos más estrictos.
- **Niveles de fee en USDC**: Lógica de fees on-chain en USDC (configuración de niveles y aplicación), con semántica clara de pagador y cobro.
- **Versionado y despliegue**: Contract IDs publicados, documentación de interfaz y estrategia clara de upgrade/versión para testnet.

## API/SDK testnet

La API/SDK de testnet (emisión y verificación on-chain) se endurece en una release estable y versionada:

- **Estabilidad API/SDK**: Versionado, manejo de errores consistente y contratos request/response documentados.
- **Firma por wallet**: Freighter (y WalletConnect donde aplique); las transacciones se preparan en servidor y se firman en cliente.
- **Demo reproducible**: Flujo documentado y scripteable de extremo a extremo: el emisor prepara la transacción de emisión (XDR), firma vía wallet, la credencial se ancla on-chain, el holder la almacena o usa vía bóveda, el verificador realiza la verificación on-chain (incluyendo estado y revocación), con enlaces de transacción en cada paso.

## Hito ZK (Stellar X-Ray / Protocol 25)

El trabajo ZK entrega un componente de **revelación selectiva** completamente especificado y un **proof of concept ejecutable mínimo** que demuestra verificación on-chain preservando privacidad en Stellar usando los primitivos BN254 de Stellar X-Ray (Protocol 25). Esta sección amplía el alcance ZK del Tranche 3 para revisores técnicos.

### Resumen ZK

- **Curva**: BN254 (tal y como la expone Stellar X-Ray / Protocol 25).
- **Sistema de pruebas**: zk-SNARK Groth16.
- **Host functions utilizadas**:
  - \`bn254_g1_mul\`
  - \`bn254_g1_add\`
  - \`bn254_multi_pairing_check\`
  - Funciones Poseidon (para derivación de nullifier, donde aplique).
- **Verificador on-chain**: contrato Soroban (\`zk_verifier\`) desplegado en una red con Protocolo 25+ (testnet y mainnet para el PoC).
- **Tooling off-chain**: stack de prover compatible con BN254 (p.ej. circom + snarkjs u otro equivalente) que compila circuitos, genera claves de prueba/verificación y produce pruebas Groth16 compatibles con el encoding on-chain.

### Circuitos y predicados

Se implementa un predicado concreto y auditable, por ejemplo:

- **Predicado A (edad)**: “el holder es al menos mayor de 18 años”, o
- **Predicado B (no expirado)**: “la credencial no ha expirado en un instante de referencia”.

El predicado elegido se fija y se documenta explícitamente en el PoC.

#### Inputs

- **Inputs privados** (solo los conoce el holder / prover):
  - \`dob\`: fecha de nacimiento codificada como entero (timestamp Unix o YYYYMMDD).
  - \`salt\`: salt aleatorio usado en el hashing de atributos.
  - \`credential_secret_fields\`: campos secretos adicionales que ligan la prueba a una credencial ACTA concreta.
- **Inputs públicos**:
  - \`cred_hash\`: hash de la credencial (o campos seleccionados) tal como se almacena / referencia en ACTA.
  - Parámetros del predicado (p.ej. \`age_threshold = 18\`).
  - \`nullifier\`: nullifier público derivado de valores privados y públicos (ver más abajo).
  - \`holder_binding\` opcional: representación del DID del holder o de \`blockchainAccountId\`.

#### Lógica del circuito (ejemplo “edad ≥ 18”)

1. Recalcular un **binding hash** a partir de campos privados y salt:
   - \`h_internal = H(dob || salt || credential_secret_fields)\`
2. Combinarlo con metadata pública (issuer, schema, etc.) para recomputar \`cred_hash\`:
   - \`cred_hash' = H(h_internal || public_metadata)\`
3. Forzar \`cred_hash' == cred_hash\` (ligando la prueba a una credencial concreta).
4. Derivar la edad o comparar fechas para hacer cumplir el predicado (p.ej. \`age >= 18\` o “dob es al menos 18 años anterior a una fecha de corte”).
5. Opcionalmente derivar o comprobar el **nullifier** dentro del circuito para alinear la semántica con las comprobaciones on-chain.

El circuito documenta claramente variables privadas vs públicas, estrategia de hashing y semántica del predicado. El código fuente del circuito (p.ej. \`.circom\`) y los artefactos compilados se versionan y publican.

### Binding de credencial y DID

Las credenciales ACTA están ligadas al holder vía \`did:stellar:<network>:<accountId>\`. La prueba ZK debe quedar:

- **Ligada a una credencial concreta**, para que no pueda reutilizarse con otro cuerpo de credencial.
- **Ligada a un holder concreto**, para evitar “préstamo de pruebas”.

Esto se consigue mediante:

- **Hash de credencial** (\`cred_hash\`):
  - Calculado a partir de una forma canónica de la credencial (issuer DID, holder DID, schema ID y el atributo privado + salt).
  - La misma estructura se reproduce lógicamente dentro del circuito usando hashes “field-friendly”.
- **Holder binding**:
  - Se incluye una representación del DID del holder o de \`blockchainAccountId\` (p.ej. \`stellar:mainnet:G...\`) en:
    - El cómputo de \`cred_hash\`.
    - La derivación del nullifier.

Así se evita reutilizar una prueba para otra credencial u otro holder sin regenerarla.

### Nullifier y protección contra replay

#### Objetivos

- **Protección contra replay**: evitar aceptar la misma prueba (o el mismo uso lógico) varias veces cuando la aplicación requiera uso único.
- **Auditabilidad**: registrar que un nullifier concreto ha sido consumido.

#### Construcción del nullifier

El nullifier se deriva con funciones Poseidon de X-Ray para que la derivación sea idéntica off-chain y on-chain. Ejemplo:

\`\`\`text
nullifier = Poseidon(
  cred_hash
  || predicate_id
  || holder_binding
  || context
)
\`\`\`

Donde:

- \`cred_hash\`: liga al contenido de la credencial.
- \`predicate_id\`: distingue circuitos/predicados (p.ej. \`"isAdult"\` vs \`"notExpired"\`).
- \`holder_binding\`: liga al holder (hash de \`did:stellar:...\` o de \`blockchainAccountId\`).
- \`context\`: separador de dominio opcional (ID de aplicación / caso de uso).

La documentación especifica el encoding, el mapeo a campos y si el nullifier se recalcula en el circuito, en el contrato o en ambos.

#### Manejo on-chain

El contrato verificador:

- Recibe \`nullifier\` como input público.
- Antes de aceptar una prueba:
  - Comprueba si \`nullifier\` ya está almacenado; si lo está, devuelve un error (p.ej. \`NullifierUsed\`).
  - Si no, continúa con la verificación Groth16.
- Tras una verificación exitosa:
  - Almacena \`nullifier\` en el estado del contrato.
  - Emite un evento con \`nullifier\`, \`predicate_id\` y el resultado.

### Interfaz del contrato verificador

El contrato Soroban expone una función mínima y versionada, por ejemplo:

\`\`\`text
fn verify_proof(
  circuit_id: String,      // p.ej. "isAdult"
  proof: Bytes,            // prueba Groth16 serializada (A, B, C)
  public_inputs: Bytes,    // elementos de campo BN254 codificados
  nullifier: Bytes         // elemento de campo para protección contra replay
) -> Result<VerificationResult, VerificationError>
\`\`\`

- \`circuit_id\` se mapea a una clave de verificación concreta y a un layout de inputs públicos esperado.
- \`proof\` codifica los puntos G1/G2 \`A, B, C\` con un formato documentado compatible con el prover.
- \`public_inputs\` es una concatenación de elementos de campo en orden fijo (p.ej. \`[cred_hash, age_threshold, nullifier, holder_binding]\`).
- \`nullifier\` se pasa también por separado para indexación/comprobación de replay.

El contrato devuelve un resultado estructurado y emite eventos para que las verificaciones puedan indexarse on-chain. Los errores incluyen \`InvalidProof\`, \`NullifierUsed\`, \`InvalidInputs\`, \`UnsupportedCircuit\`.

### Primitivos BN254 (verificación Groth16 on-chain)

El verificador on-chain:

- Usa \`bn254_g1_mul\` y \`bn254_g1_add\` para reconstruir \`vk_x\` a partir de la verification key y de los inputs públicos.
- Usa \`bn254_multi_pairing_check\` para evaluar:

  > **e(−A,B) · e(α,β) · e(vkₓ,γ) · e(C,δ) = 1**

No se implementa aritmética de curvas ni pairings en Rust; todas las operaciones de curva provienen de las host functions de X-Ray. Las funciones Poseidon se utilizan, donde aplique, para derivar o comprobar el nullifier.

### Setup de confianza y artefactos

Como Groth16 requiere un trusted setup:

- Se definen los circuitos en un repositorio público (p.ej. \`isAdult.circom\`).
- Se ejecuta una ceremonia documentada (o se reutiliza una MPC compatible) para generar:
  - Proving key.
  - Verification key.
- Se publican:
  - Código fuente del circuito y versión (commit hash).
  - Hashes de las claves de prueba/verificación.
  - Encoding exacto de las constantes de la verification key usadas on-chain.

On-chain, el contrato embebe o referencia la VK para cada \`circuit_id\` soportado y mantiene un mapeo \`circuit_id -> vk_id\`.

### Modelo de amenazas y límites

Se explicita:

- **Qué se protege**:
  - Los atributos privados (DOB, expiración) nunca se revelan on-chain.
  - Los verificadores sólo ven el resultado del predicado y los inputs públicos (hash de credencial, nullifier, etc.).
  - La reutilización de pruebas se evita mediante el mecanismo de nullifier.
- **Qué queda fuera de alcance**:
  - Metadata de red (IP, timing) y correlación entre aplicaciones.
  - Issuers maliciosos que metan PII en campos públicos.
  - Ataques de canal lateral sobre el entorno del prover off-chain.
- **Dependencias**:
  - Correctitud y seguridad de las host functions BN254/Poseidon de Stellar y del stack Groth16 elegido.

También se fijan límites superiores razonables para tamaño de circuitos, número de inputs públicos y coste estimado de verificación.

### PoC ejecutable mínimo

El PoC ejecutable mínimo demuestra, de forma reproducible:

- **Credencial y claim** — Un holder posee una credencial ACTA (emitida y almacenada vía ACTA) con un **atributo privado** (ej. DOB exacta o timestamp de expiración).
- **Revelación selectiva y generación de prueba** — El holder revela sólo lo necesario (ej. “soy mayor de 18” o “esta credencial no ha expirado”) y genera una **prueba ZK** usando un circuito compatible con BN254, produciendo una prueba Groth16 e inputs públicos compatibles con BN254 más un nullifier.
- **Verificación on-chain** — Una transacción envía \`circuit_id\`, \`proof\`, \`public_inputs\` y \`nullifier\` al contrato verificador en Soroban. El contrato reconstruye \`vk_x\`, llama a \`bn254_multi_pairing_check\`, comprueba/almacena el nullifier y registra el éxito vía estado y eventos.
- **Resultado observable** — Un tercero puede verificar **on-chain** que una prueba válida fue verificada, **sin** que el verificador o la cadena conozcan el PII subyacente. La documentación incluye red/versión de protocolo, ID de contrato y comandos CLI/SDK para reproducir el flujo completo.
    `,
  },
};

// Combined export for API route (uses English by default)
export const docsData = docsDataEn;

export const navigationItems = navigationItemsEn;

export const navigationItemsEs = {
  welcome: [
    { slug: "introduction", title: "Introducción" },
    { slug: "architecture", title: "Arquitectura" },
    { slug: "getting-started", title: "Primeros Pasos" },
    { slug: "links", title: "Enlaces" },
  ],
  sdk: [
    { slug: "sdk-overview", title: "Resumen" },
    { slug: "useCredential", title: "useCredential" },
    { slug: "useVault", title: "useVault" },
    { slug: "useVaultRead", title: "useVaultRead" },
  ],
  "api-reference": [
    { slug: "api-overview", title: "Resumen" },
    { slug: "api-keys", title: "API Keys" },
    { slug: "api-contract-info", title: "Información del Contrato" },
    { slug: "api-vault-read", title: "Operaciones de Bóveda (Lectura)" },
    { slug: "api-vault-write", title: "Operaciones de Bóveda (Escritura)" },
    { slug: "api-credentials", title: "Operaciones de Credenciales" },
  ],
  dapp: [
    { slug: "dapp-overview", title: "Resumen" },
    { slug: "dapp-getting-started", title: "Primeros Pasos" },
    { slug: "dapp-features", title: "Funcionalidades" },
  ],
  "zk-proofs": [
    { slug: "zk-overview", title: "Resumen" },
    { slug: "zk-circuits", title: "Circuitos" },
    { slug: "zk-generation", title: "Generación de Pruebas" },
    { slug: "zk-verification", title: "Verificación de Pruebas" },
  ],
  scf: [{ slug: "scf-42", title: "SCF 42" }],
  help: [
    { slug: "faq", title: "Preguntas Frecuentes" },
    { slug: "support", title: "Soporte" },
  ],
};
