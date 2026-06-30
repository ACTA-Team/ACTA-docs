import type { DocPage } from "@/@types/docs";

export const architecture: DocPage = {
  slug: "architecture",
  title: "Architecture",
  section: "Welcome",
  tocItems: [
    "System Components",
    "Vault Factory (vc-vault-factory)",
    "Vault Contract (vc-vault)",
    "API Layer",
    "Storage",
    "Identity Model",
    "Credential Flow",
    "Contract Addresses",
    "Network Support",
  ],
  content: `
# Architecture

Technical overview of ACTA's system architecture and components.

## System Components

ACTA's on-chain layer (v0.4.0) is built around two Soroban contracts: a single **Vault Factory** per network and a **single-tenant Vault** owned by each issuer.

### Vault Factory (vc-vault-factory)

There is exactly one \`vc-vault-factory\` per network. It is responsible for deploying and pricing per-owner vaults:

- **Deterministic deployment**: Deploys a new \`vc-vault\` for an owner from a template WASM. The vault address is derived from \`(factory, owner, userSalt)\`.
- **Canonical vault**: The default \`userSalt\` is 32 zero bytes, yielding one canonical vault per owner. Distinct salts allow additional vaults for the same owner.
- **Immutable vaults**: Vaults are deployed from a fixed template WASM and are immutable once created.
- **Fee quoting**: Exposes \`quote_fee\`, the on-chain issuance fee paid by the issuer (on mainnet, 1 USDC per credential).

### Vault Contract (vc-vault)

Each owner has their **own** single-tenant \`vc-vault\` contract. There is no shared, multi-tenant store. The vault holds the full credential lifecycle on-chain:

- **Issue**: Creates new credentials and anchors the hash on-chain. Issuance charges an on-chain fee via the factory's \`quote_fee\`, paid by the issuer.
- **Verify**: Public verification of credential status.
- **Revoke**: Revokes credentials with an optional revocation date.
- **Store / List / Get**: Stores and retrieves credential IDs and data within the owner's vault.
- **Issuer control**: Issuance is **open by default** (deny-by-exception). There is no allow-list. The owner can **block** an issuer with \`deny_issuer\` and **unblock** with \`allow_issuer\`.

Contract functions are exposed via API endpoints. See API Reference for details.

### API Layer

RESTful API providing:

- **Credential Operations**: Issue, verify, revoke
- **Vault Operations**: Deploy, store, retrieve, manage per-owner vaults
- **Transaction Preparation**: Generate unsigned XDR transactions for client-side signing
- **Read Operations**: Query credentials and vault state (no signature required)

All endpoints support both mainnet and testnet automatically via \`NETWORK_TYPE\` configuration.

### Storage

- **On-chain**: Credential hashes and status metadata (Soroban smart contracts)
- **Off-chain**: Encrypted credential payloads (owner-controlled vaults)

## Identity Model

The issuer identity is a registered, resolvable \`did:stellar\`:

\`\`\`
did:stellar:{network}:{address}
\`\`\`

- **Issuer DID**: The issuer must have a \`did:stellar\` registered in a did:stellar registry. A bare wallet key or \`did:pkh\` is no longer used as the issuer DID.
- **Subject / holder**: The credential holder is identified by a DID, expressed as \`credentialSubject.id\` inside the credential.

> **Note**: v0.4.0 uses \`did:stellar\` for issuer identity, resolved through the on-chain did:stellar registry.

## Credential Flow

![Issuance Flow](/issuance-flow.png)

![Verification Flow](/credential-verifier.png)

## Contract Addresses

**Mainnet**

- **vc-vault-factory**: \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\`
- **did:stellar registry**: \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\`
- **vc-vault template WASM hash**: \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\`

**Testnet**

- **vc-vault-factory**: \`CDRFQRIP4FA3WMPWCSAM3XEY6EM6EGKRYZRSCSVZ5NHCF6AGEVR2XEPQ\`
- **did:stellar registry**: \`CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ\`

## Network Support

ACTA automatically handles network configuration:

- **Testnet**: \`https://api.testnet.acta.build\` or \`NETWORK_TYPE=testnet\`
- **Mainnet**: \`https://api.mainnet.acta.build\` or \`NETWORK_TYPE=mainnet\`

Contract IDs, RPC URLs, and network passphrases are configured automatically based on network type.
    `,
};
