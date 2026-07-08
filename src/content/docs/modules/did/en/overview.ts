import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "did-overview",
  title: "Overview",
  section: "DID",
  tocItems: [
    "What is did:stellar?",
    "DID Syntax",
    "Why the DID is not your wallet",
    "Controller model",
    "The DID Document",
    "Key types",
    "DID roles",
    "Lifecycle",
    "Proof of Control",
    "How ACTA uses did:stellar",
  ],
  content: `
# did:stellar

**did:stellar** is a [W3C Decentralized Identifier (DID)](https://www.w3.org/TR/did-1.1/) method built on the **Stellar** network. It gives every issuer and holder a portable, self-controlled identity whose state lives in a Soroban smart contract (the **did-stellar-registry**), so anyone can resolve and verify it with nothing more than a Stellar RPC endpoint.

The method was developed by ACTA and is registered in the **W3C DID Extensions registry** as the \`stellar\` method. It is the mandatory issuer identity for credential issuance in ACTA: bare wallet addresses and \`did:pkh\` are not accepted.

## What is did:stellar?

- **Decentralized**: the source of truth is the on-chain registry contract, not any ACTA server. A DID is valid if and only if it is registered on-chain.
- **Trust-minimized**: any verifier can resolve any \`did:stellar\` using only a Stellar RPC URL and the registry contract id. The hosted resolver at \`https://did.acta.build\` is a stateless convenience, not a gatekeeper.
- **Non-custodial**: neither the resolver nor the libraries ever hold private keys. Every mutation is signed by the controller's own Stellar wallet.

## DID Syntax

\`\`\`
did:stellar:{network}:{didId}
\`\`\`

| Part | Rule |
|------|------|
| \`network\` | \`mainnet\` or \`testnet\` (closed set, no aliases) |
| \`didId\` | 16 random bytes encoded as RFC 4648 base32 **lowercase**, no padding: exactly 26 characters of \`[a-z2-7]\` |

The canonical validation regex is:

\`\`\`
^did:stellar:(mainnet|testnet):([a-z2-7]{26})$
\`\`\`

Example (a real, permanently resolvable testnet DID):

\`\`\`
did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi
\`\`\`

The identifier is generated with Web Crypto (\`crypto.getRandomValues\`); generation fails loudly if a secure random source is unavailable.

## Why the DID is not your wallet

The 128-bit \`didId\` is **opaque**: it is deliberately not derived from any Stellar account. This has three practical consequences:

- The DID string **survives key rotation**: you can hand control to a new wallet with \`transfer_controller\` and the DID does not change.
- One wallet can control **many DIDs**.
- The wallet appears only as the \`controller\` field inside the on-chain record, never in the DID string itself.

## Controller model

The **controller** is a classic Stellar account (\`G...\`). Every mutation of the DID record (\`update\`, \`transfer_controller\`, \`deactivate\`) requires the current controller's signature: the contract enforces \`controller.require_auth()\`. There is no privileged role in the HTTP layer.

## The DID Document

Resolving a \`did:stellar\` produces a W3C DID Core 1.1 compliant document. Keys use the **Multikey** format, verification relationships hold fragment references (\`#auth-1\`, \`#assert-1\`, \`#keyagr-1\`), and there is no root \`controller\` field (the document is self-controlled).

\`\`\`json
{
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/multikey/v1"
    ],
    "id": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
    "verificationMethod": [
      {
        "id": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi#auth-1",
        "type": "Multikey",
        "controller": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
        "publicKeyMultibase": "z6MkwBw2szL21i4Ym1wqzV8bPWwJyp1WDt8oRofTEs9ZntSq"
      }
    ],
    "authentication": [
      "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi#auth-1"
    ],
    "assertionMethod": [],
    "keyAgreement": [],
    "service": []
  },
  "didDocumentMetadata": {
    "versionId": "1",
    "deactivated": false,
    "method": {
      "network": "testnet",
      "stellarAccount": "G..."
    }
  },
  "didResolutionMetadata": { "contentType": "application/did+ld+json" }
}
\`\`\`

\`didDocumentMetadata.method.stellarAccount\` exposes the controller account, so verifiers can bind the DID to the wallet that controls it.

## Key types

| Relationship | Curve | Multibase prefix | Max keys |
|--------------|-------|------------------|----------|
| \`authentication\` | Ed25519 | \`z6Mk...\` | 1 to 3 (at least 1 required) |
| \`assertionMethod\` | Ed25519 | \`z6Mk...\` | 0 to 3 |
| \`keyAgreement\` | X25519 | \`z6LS...\` | 0 or 1 |

Raw keys must be 32 bytes. The **same key may appear in more than one relationship** (the idiomatic issuer shape is one Ed25519 key in both \`authentication\` and \`assertionMethod\`); duplicates **within** a single relationship are rejected with \`duplicate_key\`.

## DID roles

- **Holder**: \`authentication\` key only.
- **Issuer**: \`authentication\` **plus at least one \`assertionMethod\` key** (mandatory; W3C verifiers reject credentials signed without an assertion key).
- **DIDComm recipient**: adds an X25519 \`keyAgreement\` key.

## Lifecycle

| Operation | Signed by | Notes |
|-----------|-----------|-------|
| \`register\` | The record's controller | Creates the DID; \`version\` starts at 1 |
| \`update\` | Current controller | **Full record replacement** (not a patch); requires \`expectedVersion\` |
| \`transfer_controller\` | Current controller | Rotates the controlling wallet; the DID string is unchanged |
| \`deactivate\` | Current controller | **Irreversible**; the DID resolves as a tombstone with HTTP \`410 Gone\` |

Every mutation increments \`version\` (optimistic concurrency): sending a stale \`expectedVersion\` fails with \`version_mismatch\`.

## Proof of Control

did:stellar defines an off-chain **Proof of Control** protocol (e.g. for DID login):

1. The verifier issues a challenge \`{ did, domain, nonce, timestamp }\`.
2. The signer canonicalizes it with JCS (RFC 8785) and signs with an Ed25519 \`authentication\` key (signature base64url, no padding).
3. The verifier checks, in order: timestamp within a 5-minute window, domain match, nonce freshness, and the Ed25519 signature against every \`authentication\` key of the resolved document.

The TypeScript library ships this protocol ready to use (see **[TypeScript Library](doc:did-library)**).

## How ACTA uses did:stellar

- **Issuer identity is mandatory**: \`POST /contracts/vc/issue\` requires an \`issuerDid\` that resolves on the network's registry and whose on-chain **controller equals the signing issuer** (otherwise the API returns \`issuerDid_controller_mismatch\`).
- **The Credentials SDK auto-onboards it**: calling \`issue\` without \`issuerDid\` transparently generates keys, registers a did:stellar with one wallet signature, and reuses it afterwards (see **[Credentials SDK](doc:sdk-overview)**).
- **The dApp guides registration** with a single wallet signature.
- **Separate trust domains**: the credentials API deliberately does not import the DID library; identity and credentials evolve independently.

Continue with **[Registry & Resolver](doc:did-registry)** for the on-chain contract and the HTTP API, or **[TypeScript Library](doc:did-library)** for code.
    `,
};
