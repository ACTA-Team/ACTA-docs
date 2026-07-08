import type { DocPage } from "@/@types/docs";

export const security: DocPage = {
  slug: "security",
  title: "Security & Data Model",
  section: "Welcome",
  tocItems: [
    "Principles",
    "Who signs what",
    "What lives where",
    "Credential encryption",
    "What ACTA can and cannot do",
    "Identity security",
    "API access control",
    "Contract immutability",
    "Share links",
    "Reporting issues",
  ],
  content: `
# Security & Data Model

An honest, precise map of where your data lives, who can read it, and who signs what. This is the page to read before taking ACTA to production.

## Principles

- **Non-custodial**: ACTA never holds private keys. Every state change is a Stellar transaction signed by your wallet.
- **Prepare/submit everywhere**: the API builds an unsigned XDR, your wallet signs it locally, the API submits it. The signing key never leaves your device.
- **No plaintext PII on-chain**: credential payloads are encrypted before they are anchored.
- **Trust-minimized verification**: credential status and DID resolution are on-chain reads anyone can perform.

## Who signs what

| Action | Signer |
|--------|--------|
| Create vault | The vault owner |
| Issue / batch issue | The issuer (also pays the on-chain fee) |
| Revoke credential | The vault owner |
| Block / unblock issuer | The vault admin (owner by default) |
| Register / update / deactivate a DID | The DID controller wallet |
| Sponsored vault deploy | The sponsor |

## What lives where

| Data | Where | Form |
|------|-------|------|
| Credential payload (\`vcData\`) | On-chain, inside the owner's vault contract | **AES-256-GCM ciphertext** |
| Credential status (valid / revoked + date) | On-chain | Public |
| Vault metadata (owner, DID URI, counters) | On-chain | Public |
| Issuer DID record (keys, controller, services) | On-chain (did:stellar registry) | Public by design |
| API keys | ACTA database | **Hashed** (SHA-256 lookup + Argon2id verification); the plaintext is shown once and never stored |
| Share-link payloads | ACTA database, time-limited | **AES-256-GCM sealed**, HMAC-signed links, 7-day default expiry |
| Private keys (wallet or DID) | Your wallet / your browser | Never sent to ACTA |

## Credential encryption

When you issue, \`vcData\` travels to the API over TLS and is encrypted **server-side** with AES-256-GCM under a server-held master key, with the owner address bound as authenticated data (AAD). The ciphertext is what gets anchored on-chain.

Practical consequences:

- Anyone can see **that** a credential exists and its status; nobody can read its contents from the chain.
- \`GET /contracts/vault/get-vc\` decrypts server-side, which is why the API enforces that only the owner's API key (or an admin) can call it.
- \`verify-vc\` exposes **status only** and is open to any valid key: third parties can verify without ever seeing the payload.

## What ACTA can and cannot do

**Can**: process the plaintext payload at issue time and when the owner reads it back (that is inherent to server-side encryption); see issuance metadata (who issued to whom, when); revoke nothing and sign nothing on your behalf.

**Cannot**: read your credentials from the chain without the master key context, move funds, issue in your name, rotate your DID, or revoke your credentials - all of those require signatures from your wallet.

If your threat model requires that ACTA never sees the payload, encrypt \`vcData\` client-side before issuing; the platform treats the payload as opaque.

## Identity security

- Every DID mutation requires the **controller wallet's** signature on-chain (\`require_auth\`); the resolver has no privileged role.
- **Key rotation** without identity loss: \`transfer_controller\` moves control to a new wallet, the DID string stays the same.
- **Deactivation** is one-way: a deactivated DID resolves as a tombstone (HTTP 410) and can no longer sign.
- Issuance enforces **controller binding**: the DID's on-chain controller must equal the signing issuer, so a stolen DID string alone is useless.

## API access control

- API keys are 64-char random hex, stored hashed, with a **6-month expiry** and per-role rate limits (see **[API Overview](doc:api-overview)**).
- **Ownership binding**: endpoints that expose or write a holder's data (\`issue\`, \`batch-issue\`, \`list-vc-ids\`, \`get-vc\`, \`push\`) require the request's \`owner\` to match the key's wallet. Admin-only surfaces (\`/admin/*\`, sponsored vault) require the admin role.
- Writes support \`Idempotency-Key\` for safe retries; all errors carry a \`request_id\` for traceability (see **[Errors](doc:api-errors)**).

## Contract immutability

- Vaults are deployed from a **fixed template WASM** and have **no upgrade entrypoint**: the code that holds your credentials cannot be swapped underneath you.
- The factory cannot change the template either; shipping new vault code means deploying a new factory, never mutating existing vaults.
- Admin handovers (factory, registry) are **two-step** (nominate, then accept), preventing fat-finger transfers.

## Share links

Sharing a credential creates a server-side sealed copy of only the fields you selected. Links are HMAC-signed, expire (7 days by default), and the public verification page always re-checks status **on-chain**, so a revoked credential shows as revoked even through an old link.

## Reporting issues

Found a vulnerability or something that looks wrong? Open an issue on **[GitHub](https://github.com/ACTA-Team/ACTA-docs/issues)** or reach the team on **[Discord](https://discord.gg/DsUSE3aMDZ)**. Please do not publish exploit details before the team has had a chance to respond.
    `,
};
