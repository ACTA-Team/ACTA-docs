import type { DocPage } from "@/@types/docs";

export const didStellarOverview: DocPage = {
  slug: "did-stellar-overview",
  title: "DID:Stellar Overview",
  section: "DID:Stellar",
  tocItems: [
    "What is did:stellar?",
    "DID syntax",
    "DID Document",
    "Lifecycle operations",
    "Proof of Control",
    "Trust-minimized design",
    "Networks",
    "Record constraints",
  ],
  content: `
# DID:Stellar Overview

\`did:stellar\` is ACTA's Decentralized Identifier method for the Stellar blockchain. It provides a W3C DID Core 1.1 compliant identity layer anchored on Soroban smart contracts.

> **Required for issuance:** ACTA credential issuance now requires the **issuer to control a registered \`did:stellar\`**. The API enforces a controller↔issuer binding - the DID's on-chain controller must equal the signing issuer account. \`did:pkh\` and bare wallet addresses are no longer accepted as the issuer DID.

## What is did:stellar?

A \`did:stellar\` identifier is a globally unique, self-sovereign identity tied to the Stellar blockchain. Unlike \`did:pkh\` (which derives the DID from a wallet address), \`did:stellar\` uses a **128-bit random identifier** registered on-chain via a Soroban registry contract. This enables:

- **Key rotation** without changing identity
- **Multiple verification keys** (authentication, assertion, key agreement)
- **Service endpoints** for discovery
- **Controller transfer** to a different Stellar account
- **Irreversible deactivation** (tombstone)

## DID syntax

\`\`\`
did:stellar:{network}:{didId}
\`\`\`

| Part | Description |
|------|-------------|
| \`did:stellar\` | Method prefix |
| \`{network}\` | \`mainnet\` or \`testnet\` |
| \`{didId}\` | 26-character base32 lowercase identifier (128 bits, no padding) |

**Example:**

\`\`\`
did:stellar:testnet:aaaqeayeaudaocajbifqydiob4
\`\`\`

The \`didId\` is generated from 16 bytes of cryptographically secure randomness, encoded as base32 lowercase without padding.

**Regex:** \`/^did:stellar:(mainnet|testnet):([a-z2-7]{26})$/\`

## DID Document

A resolved \`did:stellar\` produces a W3C DID Core 1.1 document:

\`\`\`json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/multikey/v1"
  ],
  "id": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  "verificationMethod": [
    {
      "id": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4#auth-1",
      "type": "Multikey",
      "controller": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
      "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    }
  ],
  "authentication": ["#auth-1"],
  "assertionMethod": ["#assert-1"],
  "keyAgreement": [],
  "service": []
}
\`\`\`

### Verification methods

All keys use the **Multikey** type with multibase-encoded public keys:

| Relationship | Curve | Multibase prefix | Use |
|---|---|---|---|
| \`authentication\` | Ed25519 | \`z6Mk...\` | Signing, login |
| \`assertionMethod\` | Ed25519 | \`z6Mk...\` | Credential issuance |
| \`keyAgreement\` | X25519 | \`z6LS...\` | Encryption |

### Service endpoints

Services are referenced by fragment ID \`#service-{idSuffix}\`:

\`\`\`json
{
  "id": "did:stellar:testnet:aaaq...#service-api",
  "type": "LinkedDomains",
  "serviceEndpoint": "https://example.com"
}
\`\`\`

### Document metadata

\`\`\`json
{
  "versionId": "1",
  "deactivated": false,
  "method": {
    "network": "testnet",
    "stellarAccount": "GXXXXXX..."
  }
}
\`\`\`

## Lifecycle operations

| Operation | Description |
|-----------|-------------|
| **Register** | Create a new DID with keys, services, and a controller |
| **Resolve** | Read the DID Document from on-chain state |
| **Update** | Modify keys, services, or metadata (with optimistic concurrency) |
| **Transfer** | Change the controller to a different Stellar account |
| **Deactivate** | Permanently tombstone the DID (irreversible) |

All mutations require the controller's \`require_auth()\` on-chain. Updates use **optimistic concurrency** via \`expectedVersion\` to prevent lost updates.

## Proof of Control

\`did:stellar\` supports a challenge-response protocol to prove that a party controls an authentication key listed in the DID Document:

1. **Build challenge** with DID, domain, nonce, and timestamp
2. **Canonicalize** using JCS (RFC 8785)
3. **Sign** with an Ed25519 authentication key
4. **Verify** against the resolved DID Document

The default timestamp window is **5 minutes**. Nonce replay protection is caller-managed.

## Trust-minimized design

- The SDK reads directly from Stellar RPC - **no ACTA infrastructure required** for resolution
- The HTTP API is optional and stateless
- All mutations are enforced by the on-chain registry contract via \`require_auth()\`
- No authentication on the HTTP API by design

## Networks

| Network | RPC URL | Registry contract |
|---------|---------|-------------------|
| Testnet | \`https://soroban-testnet.stellar.org\` | \`CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ\` |
| Mainnet | \`https://mainnet.sorobanrpc.com\` | Not deployed yet |

## Record constraints

All enforced both client-side and on-chain:

| Constraint | Limit |
|------------|-------|
| Authentication keys | 1 to 3 |
| Assertion method keys | 0 to 3 |
| Key agreement keys | 0 to 1 |
| Services | 0 to 3 |
| Key multibase length | 128 chars max |
| Service ID length | 32 chars max |
| Service type length | 64 chars max |
| URL length (endpoints, metadata URI) | 255 chars max |
| Metadata hash | 32 bytes (64 hex chars) |
    `,
};
