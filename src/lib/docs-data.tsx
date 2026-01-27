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
- **Push**: Transfers credentials between vaults
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

### Issuance Flow

1. Issuer calls API with credential data
2. API canonicalizes and creates W3C VC
3. VC hash anchored on Issuance contract
4. Encrypted VC data stored in holder's Vault
5. Credential ID returned to issuer

### Verification Flow

1. Verifier queries credential status via API / dApp
2. API checks Issuance contract on-chain status
3. Status returned (valid, revoked, invalid)
4. Optional: Retrieve full credential data from Vault

### Storage Flow

1. Credentials stored in holder's Vault contract
2. Each vault is isolated per owner address
3. Vault admin controls issuer authorization
4. Only authorized issuers can store in vault
5. Credentials encrypted and accessible only to owner

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
npm install @acta/react-sdk
\`\`\`

2. **Configure Provider**: Wrap app with \`ActaProvider\`
3. **Use Hooks**: \`useCreateCredential\`, \`useVaultApi\`, etc.

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

- **\`useVault\`**: Vault operations - create vault, authorize issuer, revoke issuer
  - \`createVault\`: Initialize a vault for an owner
  - \`authorizeIssuer\`: Authorize an issuer in the vault
  - \`revokeIssuer\`: Revoke an authorized issuer from the vault

- **\`useCredential\`**: Credential operations - issue and revoke
  - \`issue\`: Issue a credential (stores in vault and marks as valid)
  - \`revoke\`: Revoke a credential

- **\`useVaultRead\`**: Vault read operations - list IDs, get VC, verify VC
  - \`listVcIds\`: List credential IDs owned by an owner
  - \`getVc\`: Get a credential from the vault
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
      "revoke",
      "Transaction Flow",
      "Notes",
    ],
    content: `
# useCredential

Hook for credential operations: issue and revoke.

## Function

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
  revoke: (args: RevokeArgs) => Promise<{ txId: string }>;
}
\`\`\`

## issue

Issues a credential (stores it in the vault and marks it as valid).

### Arguments

\`\`\`ts
{
  owner: string;                    // Stellar public key of the credential owner
  vcId: string;                    // Unique credential identifier
  vcData: string;                  // Credential data (JSON stringified)
  issuer: string;                  // Stellar public key of the issuer
  issuerDid?: string;              // Issuer DID URI (optional)
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
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:stellar:G...",
      name: "John Doe"
    }
  }),
  issuer: "G...",
  issuerDid: "did:stellar:G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Sign the XDR with your wallet
    return signedXdr;
  }
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

Both methods follow the same flow:

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
      "verifyVc",
      "Notes",
    ],
    content: `
# useVaultRead

Hook for reading vault data: list credential IDs, get credentials, verify credentials.

## Function

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
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

Most endpoints require an API key in the request header:

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

### Getting an API Key

You can create a public API key (standard role, expires in 6 months) via:

- **POST** \`/testnet/public/api-keys\` - Create testnet API key
- **POST** \`/mainnet/public/api-keys\` - Create mainnet API key

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

\`\`\`json
{
  "unsignedXdr": "AAAA...",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

Or for submit:

\`\`\`json
{
  "txId": "abc123..."
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
2. **Sign**: Sign the returned \`unsignedXdr\` with your Stellar wallet
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
    `,
  },
  "api-health-status": {
    slug: "api-health-status",
    title: "Health & Status",
    section: "API Reference",
    tocItems: ["Health Check", "API Status", "Network Configuration"],
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

## API Status

### GET /

Gets the current API status and network. Requires API key.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Response:**

\`\`\`json
{
  "status": "OK",
  "network": "testnet"
}
\`\`\`

**Example:**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" https://acta.build/api/testnet/
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

Public endpoints for creating API keys. No authentication required, but rate limited.

> **Note:** You can also request API keys directly from the [ACTA dApp](https://dapp.acta.build/). The dApp provides a user-friendly interface to create and manage your API keys.

## Create Testnet API Key

### POST /testnet/public/api-keys

Creates a testnet API key (standard role, expires in 6 months).

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

**Example:**

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

## Create Mainnet API Key

### POST /mainnet/public/api-keys

Creates a mainnet API key (standard role, expires in 6 months).

**Rate Limit:** 5 requests per minute per IP

**Request Body:**

\`\`\`json
{
  "name": "My API Key",
  "wallet_address": "G...",
  "metadata": {
    "network": "mainnet"
  }
}
\`\`\`

**Response:**

Same format as testnet endpoint.

**Example:**

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

Returns the ACTA contract version string. Requires API key.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

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
curl -H "X-ACTA-Key: your_key" \\
  "https://acta.build/api/testnet/contracts/version?sourcePublicKey=G..."
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
      "Verify VC",
      "Request Body",
      "Responses",
    ],
    content: `
# Vault Operations (Read)

Read-only operations for vault data. Requires API key and ownership validation.

## List VC IDs

### POST /contracts/vault/list-vc-ids

Lists verifiable credential (VC) IDs stored in an owner's vault.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

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
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## Get VC

### POST /contracts/vault/get-vc

Gets a specific verifiable credential from a vault.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

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
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": "did:stellar:G...",
      "name": "John Doe"
    }
  }
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/get-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Verify VC

### POST /contracts/vault/verify-vc

Verifies a VC by checking it exists in the owner's vault and returning its issuance status.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

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
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Request Body

All endpoints require:
- **owner** (required): Vault owner address (G...)
- **vcId** (required for get-vc and verify-vc): Credential identifier
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
      "Set Admin",
      "Push",
      "Prepare/Submit Flow",
    ],
    content: `
# Vault Operations (Write)

Write operations for vault management. All endpoints support prepare/submit flow. Requires API key.

## Create Vault

### POST /contracts/vault/create

Creates (initializes) a vault for an owner.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

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
  "unsignedXdr": "AAAA...",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "txId": "abc123..."
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

## Authorize Issuers (Multiple)

### POST /contracts/vault/authorize-issuers

Authorizes multiple issuers in a vault.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuers": ["G...", "G...", "G..."],
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Set Admin

### POST /contracts/vault/set-admin

Sets the vault administrator.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "admin": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

## Push

### POST /contracts/vault/push

Pushes data to a vault.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

## Prepare/Submit Flow

All write endpoints follow the same pattern:

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`unsignedXdr\` with your Stellar wallet
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
      "Revoke Credential",
      "Request Body",
      "Prepare/Submit Flow",
    ],
    content: `
# Credential Operations

Endpoints for issuing and revoking verifiable credentials. All endpoints support prepare/submit flow. Requires API key.

## Issue Credential

### POST /contracts/vc/issue

Issues a VC: stores payload in the owner's vault and writes issuance status = valid.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/2018/credentials/v1\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:G...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
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
  "unsignedXdr": "AAAA...",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "txId": "abc123..."
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
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/2018/credentials/v1\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
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

## Revoke Credential

### POST /contracts/vc/revoke

Revokes a VC by ID.

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
  "unsignedXdr": "AAAA...",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "txId": "abc123..."
}
\`\`\`

## Request Body

### Issue Credential

- **owner** (required): Vault owner address (G...)
- **vcId** (required): Credential identifier
- **vcData** (required): Credential data payload (string, will be automatically encrypted with AES-256 before storage)
- **issuer** (required): Issuer address (G...)
- **issuerDid** (optional): Issuer DID metadata
- **sourcePublicKey** (required): Transaction source that will sign (must be issuer)
- **contractId** (optional): Override ACTA contract ID (C...)

### Revoke Credential

- **vcId** (required): Credential identifier
- **date** (optional): ISO-8601 timestamp (default: now)
- **sourcePublicKey** (required): Transaction source that will sign (must be VC owner or contract admin)
- **contractId** (optional): Override ACTA contract ID (C...)

## Prepare/Submit Flow

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`unsignedXdr\` with your Stellar wallet
3. **Submit**: Send request with \`signedXdr\` to execute

**Note:** The \`issue\` method automatically stores the credential in the vault and marks it as valid in a single transaction.
    `,
  },
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
    { slug: "api-health-status", title: "Health & Status" },
    { slug: "api-keys", title: "API Keys" },
    { slug: "api-contract-info", title: "Contract Info" },
    { slug: "api-vault-read", title: "Vault Operations (Read)" },
    { slug: "api-vault-write", title: "Vault Operations (Write)" },
    { slug: "api-credentials", title: "Credential Operations" },
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
- **Enviar (Push)**: Transfiere credenciales entre bóvedas  
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

### Flujo de emisión

1. El emisor llama a la API con los datos de la credencial  
2. La API canonicaliza y crea la VC W3C  
3. El hash de la VC se ancla en el contrato de Emisión  
4. Los datos cifrados de la VC se almacenan en la bóveda del titular  
5. Se devuelve el ID de la credencial al emisor  

### Flujo de verificación

1. El verificador consulta el estado de la credencial vía API / dApp  
2. La API revisa el estado on-chain en el contrato de Emisión  
3. Se devuelve el estado (válida, revocada, inválida)  
4. Opcional: se recupera la credencial completa desde la bóveda  

### Flujo de almacenamiento

1. Las credenciales se almacenan en el contrato de Bóveda del titular  
2. Cada bóveda está aislada por dirección de propietario  
3. El admin de la bóveda controla la autorización de emisores  
4. Solo emisores autorizados pueden escribir en la bóveda  
5. Las credenciales están cifradas y solo el dueño puede acceder  

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
npm install @acta/react-sdk
\`\`\`

2. **Configurar provider**: Envuelve tu app con \`ActaConfig\`  
3. **Usar hooks**: \`useCreateCredential\`, \`useVaultApi\`, etc.  

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

- **\`useVault\`**: operaciones de bóveda — crear bóveda, autorizar emisor, revocar emisor  
- **\`useCredential\`**: operaciones de credenciales — emitir y revocar  
- **\`useVaultRead\`**: lectura de bóveda — listar IDs, obtener VC, verificar VC  
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
      "revoke",
      "Flujo de transacción",
      "Notas",
    ],
    content: `
# useCredential

Hook para operaciones de credenciales: emitir y revocar.

## Función

\`\`\`ts
useCredential(): {
  issue: (args: IssueArgs) => Promise<{ txId: string }>;
  revoke: (args: RevokeArgs) => Promise<{ txId: string }>;
}
\`\`\`

## issue

Emite una credencial (la guarda en la bóveda y la marca como válida).

### Argumentos

\`\`\`ts
{
  owner: string;                    // Clave pública Stellar del titular de la credencial
  vcId: string;                    // Identificador único de la credencial
  vcData: string;                  // Datos de la credencial (JSON stringify)
  issuer: string;                  // Clave pública Stellar del emisor
  issuerDid?: string;              // DID del emisor (opcional)
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
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    credentialSubject: {
      id: "did:stellar:G...",
      name: "John Doe"
    }
  }),
  issuer: "G...",
  issuerDid: "did:stellar:G...",
  signTransaction: async (xdr, { networkPassphrase }) => {
    // Firma el XDR con tu wallet
    return signedXdr;
  }
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

Ambos métodos siguen el mismo flujo:

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
      "verifyVc",
      "Notas",
    ],
    content: `
# useVaultRead

Hook para leer datos de la bóveda: listar IDs de credenciales, obtener credenciales, verificar credenciales.

## Función

\`\`\`ts
useVaultRead(): {
  listVcIds: (args: ListVcIdsArgs) => Promise<string[]>;
  getVc: (args: GetVcArgs) => Promise<unknown | null>;
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

La mayoría de los endpoints requieren una API key en el header de la solicitud:

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

### Obtener una API Key

Puedes crear una API key pública (rol estándar, expira en 6 meses) vía:

- **POST** \`/testnet/public/api-keys\` - Crear API key de testnet
- **POST** \`/mainnet/public/api-keys\` - Crear API key de mainnet

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

\`\`\`json
{
  "unsignedXdr": "AAAA...",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

O para submit:

\`\`\`json
{
  "txId": "abc123..."
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
2. **Firmar**: Firma el \`unsignedXdr\` devuelto con tu wallet Stellar
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
    `,
  },
  "api-health-status": {
    slug: "api-health-status",
    title: "Salud y Estado",
    section: "Referencia API",
    tocItems: [
      "Verificación de salud",
      "Estado de la API",
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

## Estado de la API

### GET /

Obtiene el estado actual de la API y la red. Requiere API key.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Respuesta:**

\`\`\`json
{
  "status": "OK",
  "network": "testnet"
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -H "X-ACTA-Key: tu_key" https://acta.build/api/testnet/
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

Endpoints públicos para crear API keys. No requiere autenticación, pero tiene límite de tasa.

> **Nota:** También puedes solicitar API keys directamente desde la [dApp de ACTA](https://dapp.acta.build/). La dApp proporciona una interfaz amigable para crear y gestionar tus API keys.

## Crear API Key de Testnet

### POST /testnet/public/api-keys

Crea una API key de testnet (rol estándar, expira en 6 meses).

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

**Ejemplo:**

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

## Crear API Key de Mainnet

### POST /mainnet/public/api-keys

Crea una API key de mainnet (rol estándar, expira en 6 meses).

**Límite de tasa:** 5 solicitudes por minuto por IP

**Cuerpo de solicitud:**

\`\`\`json
{
  "name": "Mi API Key",
  "wallet_address": "G...",
  "metadata": {
    "network": "mainnet"
  }
}
\`\`\`

**Respuesta:**

Mismo formato que el endpoint de testnet.

**Ejemplo:**

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

Devuelve la cadena de versión del contrato ACTA. Requiere API key.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

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
curl -H "X-ACTA-Key: tu_key" \\
  "https://acta.build/api/testnet/contracts/version?sourcePublicKey=G..."
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
      "Verificar VC",
      "Cuerpo de solicitud",
      "Respuestas",
    ],
    content: `
# Operaciones de Bóveda (Lectura)

Operaciones de solo lectura para datos de bóveda. Requiere API key y validación de propiedad.

## Listar IDs de VC

### POST /contracts/vault/list-vc-ids

Lista los IDs de credenciales verificables (VC) almacenados en la bóveda de un propietario.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

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
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## Obtener VC

### POST /contracts/vault/get-vc

Obtiene una credencial verificable específica de una bóveda.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

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
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": "did:stellar:G...",
      "name": "John Doe"
    }
  }
}
\`\`\`

**Ejemplo:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/vault/get-vc \\
  -H "X-ACTA-Key: tu_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Verificar VC

### POST /contracts/vault/verify-vc

Verifica una VC comprobando que existe en la bóveda del propietario y devolviendo su estado de emisión.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

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
  -H "X-ACTA-Key: tu_key" \\
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
      "Establecer Admin",
      "Push",
      "Flujo Prepare/Submit",
    ],
    content: `
# Operaciones de Bóveda (Escritura)

Operaciones de escritura para gestión de bóvedas. Todos los endpoints soportan flujo prepare/submit. Requiere API key.

## Crear Bóveda

### POST /contracts/vault/create

Crea (inicializa) una bóveda para un propietario.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

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
  "unsignedXdr": "AAAA...",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "txId": "abc123..."
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

## Autorizar Emisores (Múltiples)

### POST /contracts/vault/authorize-issuers

Autoriza múltiples emisores en una bóveda.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuers": ["G...", "G...", "G..."],
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Establecer Admin

### POST /contracts/vault/set-admin

Establece el administrador de la bóveda.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "admin": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

## Push

### POST /contracts/vault/push

Envía datos a una bóveda.

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

## Flujo Prepare/Submit

Todos los endpoints de escritura siguen el mismo patrón:

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`unsignedXdr\` devuelto con tu wallet Stellar
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
      "Revocar Credencial",
      "Cuerpo de solicitud",
      "Flujo Prepare/Submit",
    ],
    content: `
# Operaciones de Credenciales

Endpoints para emitir y revocar credenciales verificables. Todos los endpoints soportan flujo prepare/submit. Requiere API key.

## Emitir Credencial

### POST /contracts/vc/issue

Emite una VC: almacena el payload en la bóveda del propietario y escribe el estado de emisión = válido.

**Headers:**

\`\`\`
X-ACTA-Key: tu_api_key_aqui
\`\`\`

**Cuerpo de solicitud (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/2018/credentials/v1\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:G...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
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
  "unsignedXdr": "AAAA...",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "txId": "abc123..."
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
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/2018/credentials/v1\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
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

## Revocar Credencial

### POST /contracts/vc/revoke

Revoca una VC por ID.

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
  "unsignedXdr": "AAAA...",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

**Respuesta (Submit):**

\`\`\`json
{
  "txId": "abc123..."
}
\`\`\`

## Cuerpo de solicitud

### Emitir Credencial

- **owner** (requerido): Dirección del propietario de la bóveda (G...)
- **vcId** (requerido): Identificador de credencial
- **vcData** (requerido): Payload de datos de credencial (cadena, se cifrará automáticamente con AES-256 antes del almacenamiento)
- **issuer** (requerido): Dirección del emisor (G...)
- **issuerDid** (opcional): Metadatos DID del emisor
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser el emisor)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

### Revocar Credencial

- **vcId** (requerido): Identificador de credencial
- **date** (opcional): Timestamp ISO-8601 (por defecto: ahora)
- **sourcePublicKey** (requerido): Fuente de transacción que firmará (debe ser propietario de VC o admin del contrato)
- **contractId** (opcional): Sobrescribir ID de contrato ACTA (C...)

## Flujo Prepare/Submit

1. **Prepare**: Envía solicitud con parámetros de operación (sin \`signedXdr\`)
2. **Firmar**: Firma el \`unsignedXdr\` devuelto con tu wallet Stellar
3. **Submit**: Envía solicitud con \`signedXdr\` para ejecutar

**Nota:** El método \`issue\` almacena automáticamente la credencial en la bóveda y la marca como válida en una sola transacción.
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
    { slug: "api-health-status", title: "Salud y Estado" },
    { slug: "api-keys", title: "API Keys" },
    { slug: "api-contract-info", title: "Información del Contrato" },
    { slug: "api-vault-read", title: "Operaciones de Bóveda (Lectura)" },
    { slug: "api-vault-write", title: "Operaciones de Bóveda (Escritura)" },
    { slug: "api-credentials", title: "Operaciones de Credenciales" },
  ],
};
