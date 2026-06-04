import type { DocPage } from "@/@types/docs";

export const architecture: DocPage = {
  slug: "architecture",
  title: "Architecture",
  section: "Welcome",
  tocItems: [
    "System Components",
    "Issuance Contract",
    "Vault Contract",
    "API Layer",
    "Storage",
    "Identity Model (did:stellar)",
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

## Identity Model

Uses the \`did:stellar\` method — a W3C DID Core 1.1 compliant identity anchored on a Soroban registry contract:

\`\`\`
did:stellar:{network}:{didId}
\`\`\`

- **Network**: \`mainnet\` or \`testnet\`
- **didId**: 26-character base32 identifier (128-bit random, registered on-chain)

Key capabilities: key rotation, multiple verification keys, service endpoints, controller transfer, and irreversible deactivation. See the [DID:Stellar documentation](#did-stellar-overview) for full details.

## Credential Flow

![Issuance Flow](/issuance-flow.png)

![Verification Flow](/credential-verifier.png)

## Network Support

ACTA automatically handles network configuration:

- **Testnet**: \`https://api.testnet.acta.build\` or \`NETWORK_TYPE=testnet\`
- **Mainnet**: \`https://api.mainnet.acta.build\` or \`NETWORK_TYPE=mainnet\`

Contract IDs, RPC URLs, and network passphrases are configured automatically based on network type.
    `,
};
