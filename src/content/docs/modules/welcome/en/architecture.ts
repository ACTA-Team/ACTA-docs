import type { DocPage } from "@/@types/docs";

export const architecture: DocPage = {
  slug: "architecture",
  title: "Architecture",
  section: "Welcome",
  tocItems: [
    "System Components",
    "Vault Factory",
    "Single-tenant Vault",
    "API Layer",
    "Storage",
    "Identity Model (did:stellar)",
    "Contract IDs",
    "Credential Flow",
    "Network Support",
  ],
  content: `
# Architecture

Technical overview of ACTA's system architecture and components (v0.4.0).

## System Components

ACTA's on-chain layer is a **\`vc-vault-factory\`** plus per-owner **\`vc-vault\`** contracts. There is one factory per network; each owner gets their own vault, deployed deterministically by the factory.

### Vault Factory (Soroban)

The **\`vc-vault-factory\`** deploys and tracks single-tenant vaults:

- **Deploy**: Deterministically deploys a vault for an owner from \`(factory, owner, userSalt)\`; the default \`userSalt\` (32 zero bytes) yields one canonical vault per owner.
- **Sponsored deploy**: \`deploy_sponsored\` lets any sponsor deploy a vault for an owner (open, no whitelist).
- **Fees**: \`quote_fee\` resolves the issuance fee charged on-chain (default 1 USDC per credential, paid by the issuer). A single standard fee applies, with an optional per-issuer custom fee (with optional expiry).

### Single-tenant Vault (Soroban)

Each owner's **\`vc-vault\`** is an immutable, single-tenant credential store:

- **Issue / Batch issue**: Stores credentials and marks them valid; charges the fee via the factory.
- **List / Get / Verify / Count**: Reads credential IDs, data, status, and counts.
- **Revoke**: Revokes a credential with an optional date.
- **Issuer access (deny-by-exception)**: Issuance is **open by default**. The owner can **block** issuers (\`deny_issuer\`) and **unblock** them (\`allow_issuer\`); there is no allow-list.

Issuers must control a registered, resolvable \`did:stellar\` (the DID's on-chain controller must equal the issuing account).

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

Uses the \`did:stellar\` method - a W3C DID Core 1.1 compliant identity anchored on a Soroban registry contract:

\`\`\`
did:stellar:{network}:{didId}
\`\`\`

- **Network**: \`mainnet\` or \`testnet\`
- **didId**: 26-character base32 identifier (128-bit random, registered on-chain)

Key capabilities: key rotation, multiple verification keys, service endpoints, controller transfer, and irreversible deactivation. See the [DID:Stellar documentation](#did-stellar-overview) for full details.

## Contract IDs

**Mainnet:**

| Contract | ID |
|----------|----|
| \`vc-vault-factory\` | \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\` |
| \`did-stellar-registry\` | \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\` |
| Vault template Wasm hash | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |

Mainnet issuance fee: **1 USDC per credential**, paid by the issuer.

**Testnet:**

| Contract | ID |
|----------|----|
| \`vc-vault-factory\` | \`CDRFQRIP4FA3WMPWCSAM3XEY6EM6EGKRYZRSCSVZ5NHCF6AGEVR2XEPQ\` |
| \`did-stellar-registry\` | \`CBUNQ3GX3ZQ4MF64H7JCYZMXLGOS47VPIQQS7NCR6V3KX6YP7O72L5QF\` |

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
