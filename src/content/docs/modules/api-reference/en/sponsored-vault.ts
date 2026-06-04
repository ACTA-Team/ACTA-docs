import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "api-sponsored-vault",
  title: "Sponsored Vault",
  section: "API Reference",
  tocItems: [
    "Concept",
    "On-chain contract (vc-vault)",
    "HTTP API",
    "Prepare / submit",
    "Operational notes",
  ],
  content: `
# Sponsored Vault

A **sponsored vault** is a normal ACTA vault (same storage as \`create_vault\`) created through \`create_sponsored_vault\` on the **vc-vault** Soroban contract. The **sponsor** invokes the contract and must satisfy Soroban auth (\`sponsor.require_auth()\`); the **owner** is the vault admin and does not sign this transaction. Use this when an organization pays fees or orchestrates onboarding while the end user only receives the vault.

For comparison, \`POST /contracts/vault/create\` prepares \`create_vault\`, where the **owner** typically signs. The sponsored flow uses \`POST /contracts/sponsored-vault/create\`; the invoke must satisfy on-chain auth for **sponsor**—in practice the prepared XDR is usually signed by the sponsor account (see **sourcePublicKey** below).

## Concept

| Role | Responsibility |
|------|----------------|
| **Sponsor** | Signs the transaction; must be allowed (see below). Pays network/fees like any invoke. |
| **Owner** | Receives the vault; address stored as vault admin; \`didUri\` stored for the vault. |
| **Contract admin** | Soroban “contract admin” (not HTTP): can always sponsor; can toggle open mode and manage the sponsor allowlist on-chain. |

**Authorization modes** (on-chain flag \`sponsored_vault_open_to_all\`, default \`false\`):

- **Restricted (\`open_to_all = false\`)**: Only the contract admin **or** addresses on the **authorized sponsors** list may call \`create_sponsored_vault\`.
- **Open (\`open_to_all = true\`)**: Any sponsor address may call \`create_sponsored_vault\` (still subject to Stellar/Soroban auth and fees).

**Failures you may see on-chain:**

- \`NotAuthorizedSponsor\` (error code **11**): Sponsor not allowed while restricted mode is on.
- \`AlreadyInitialized\` (error code **1**): Owner already has a vault; do not call create again for that owner.
- \`NotInitialized\`: Contract not initialized.

On success the contract emits **\`SponsoredVaultCreated\`** with \`sponsor\`, \`owner\`, and \`did_uri\`.

## On-chain contract (vc-vault)

Relevant Soroban entrypoints on the same **vc-vault** contract as standard vault ops:

| Function | Auth | Description |
|----------|------|-------------|
| \`create_sponsored_vault(sponsor, owner, did_uri)\` | Sponsor | Creates vault state for \`owner\` if allowed and not already initialized. |
| \`get_sponsored_vault_open_to_all\` | Read-only | Returns the boolean open/restricted flag. |
| \`set_sponsored_vault_open_to_all(open)\` | Contract admin | Sets restricted vs open sponsorship mode. |
| \`add_sponsored_vault_sponsor(sponsor)\` | Contract admin | Adds an address to the authorized sponsors set. |
| \`remove_sponsored_vault_sponsor(sponsor)\` | Contract admin | Removes an address from the authorized sponsors set. |

Persistent keys include \`SponsoredVaultOpenToAll\` and per-address \`SponsoredVaultSponsor(Address)\` entries.

**Public HTTP:** the ACTA API documents only **\`POST /contracts/sponsored-vault/create\`** (prepare/submit for \`create_sponsored_vault\`). Admin and read helpers for the flag and sponsor list are **not** part of the public REST surface; contract admins use on-chain invocation (or internal tooling), not these docs.

## HTTP API

This route uses the same middleware as other public \`/contracts/*\` write routes: **\`X-ACTA-Key\`** header, valid API key, and rate limits. Prefix paths with your network base URL (e.g. \`https://api.testnet.acta.build\`).

### POST /contracts/sponsored-vault/create

Prepares or submits \`create_sponsored_vault\`.

**Prepare body:**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

- **sponsor** (required): Stellar address passed to the contract as the sponsor (must satisfy \`sponsor.require_auth()\` when the transaction is signed and submitted).
- **owner** (required): Vault owner (\`G...\`).
- **didUri** (required): DID URI for the vault.
- **sourcePublicKey** (required): Stellar account used as the **transaction source** when the API prepares the XDR. The signed invoke must still authorize **sponsor** on the contract; typically the sponsor account is both \`sponsor\` and the signing/source account.
- **contractId** (optional): vc-vault contract id (\`C...\`); otherwise configured default.

**Submit body:** \`{ "signedXdr": "AAAA..." }\`

**Responses:** Prepare → \`{ "xdr", "network" }\`; Submit → \`{ "tx_id" }\`.

## Prepare / submit

This write endpoint follows the standard two-step flow:

1. **Prepare** — JSON with operation fields (no \`signedXdr\`) → \`xdr\` + \`network\` passphrase.
2. **Sign** — Stellar wallet signs the XDR so the sponsor’s auth requirements are met.
3. **Submit** — POST the same path with \`{ "signedXdr" }\` → \`tx_id\`.

## Operational notes

- In **restricted** mode, confirm out-of-band or via Soroban simulation that your **sponsor** is the contract admin or on the authorized sponsor list before calling **create**; there is no public HTTP helper for the open-to-all flag or allowlist in this reference.
- Avoid calling **create** when the owner already has a vault; prefer an on-chain or API read of vault existence first (see vault read operations).
    `,
};
