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

For comparison, \`POST /contracts/vault/create\` prepares \`create_vault\`, where the **owner** typically signs. Sponsored flow uses \`POST /contracts/sponsored-vault/create\` and the **sponsor** must match \`sourcePublicKey\` on prepare/submit.

## Concept

| Role | Responsibility |
|------|----------------|
| **Sponsor** | Signs the transaction; must be allowed (see below). Pays network/fees like any invoke. |
| **Owner** | Receives the vault; address stored as vault admin; \`didUri\` stored for the vault. |
| **Contract admin** | Soroban “contract admin” (not HTTP admin): can always sponsor; can toggle open mode and manage the sponsor allowlist. |

**Authorization modes** (on-chain flag \`sponsored_vault_open_to_all\`, default \`false\`):

- **Restricted (\`open_to_all = false\`)**: Only the contract admin **or** addresses on the **authorized sponsors** list may call \`create_sponsored_vault\`.
- **Open (\`open_to_all = true\`)**: Any sponsor address may call \`create_sponsored_vault\` (still subject to Stellar/Soroban auth and fees).

**Failures you may see on-chain:**

- \`NotAuthorizedSponsor\` (error code **11**): Sponsor not allowed while restricted mode is on.
- \`AlreadyInitialized\` (error code **1**): Owner already has a vault; do not call create again for that owner.
- \`NotInitialized\`: Contract not initialized.

On success the contract emits **\`SponsoredVaultCreated\`** with \`sponsor\`, \`owner\`, and \`did_uri\`.

## On-chain contract (vc-vault)

Soroban entrypoints used by the HTTP API (all live on the same vc-vault contract as standard vault ops):

| Function | Auth | Description |
|----------|------|-------------|
| \`create_sponsored_vault(sponsor, owner, did_uri)\` | Sponsor | Creates vault state for \`owner\` if allowed and not already initialized. |
| \`get_sponsored_vault_open_to_all\` | Read-only | Returns the boolean open/restricted flag. |
| \`set_sponsored_vault_open_to_all(open)\` | Contract admin | Sets restricted vs open sponsorship mode. |
| \`add_sponsored_vault_sponsor(sponsor)\` | Contract admin | Adds an address to the authorized sponsors set. |
| \`remove_sponsored_vault_sponsor(sponsor)\` | Contract admin | Removes an address from the authorized sponsors set. |

Persistent keys include \`SponsoredVaultOpenToAll\` and per-address \`SponsoredVaultSponsor(Address)\` entries.

## HTTP API

These routes use the same middleware as other \`/contracts/*\` user routes: **\`X-ACTA-Key\`** header, valid API key, and rate limits. Prefix paths with your network base URL (e.g. \`https://acta.build/api/testnet\`).

### POST /contracts/sponsored-vault/create

Prepares or submits \`create_sponsored_vault\`.

**Prepare body:**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:pkh:stellar:testnet:G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

- **sponsor** (required): Stellar address of the sponsor (must match the signer / \`sourcePublicKey\`).
- **owner** (required): Vault owner (\`G...\`).
- **didUri** (required): DID URI for the vault.
- **sourcePublicKey** (required): Account that will sign the transaction (must be the sponsor).
- **contractId** (optional): vc-vault contract id (\`C...\`); otherwise configured default.

**Submit body:** \`{ "signedXdr": "AAAA..." }\`

**Responses:** Prepare → \`{ "xdr", "network" }\`; Submit → \`{ "tx_id" }\`.

### GET /contracts/sponsored-vault/open-to-all

Simulates \`get_sponsored_vault_open_to_all\`. **Query parameters:**

- **contractId** (optional)
- **sourcePublicKey** (optional): Account used for simulation; falls back to server config when omitted.

**Response:**

\`\`\`json
{ "open": false }
\`\`\`

### POST /contracts/sponsored-vault/open-to-all

Prepares/submits \`set_sponsored_vault_open_to_all\`. **Prepare body:**

\`\`\`json
{
  "open": true,
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

- **open** (required): boolean.
- **sourcePublicKey** (required): Must be the **contract admin** for the vault contract.

### POST /contracts/sponsored-vault/add-sponsor

Prepares/submits \`add_sponsored_vault_sponsor\`. **Prepare body:**

\`\`\`json
{
  "sponsor": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
}
\`\`\`

\`sourcePublicKey\` must be the contract admin.

### POST /contracts/sponsored-vault/remove-sponsor

Prepares/submits \`remove_sponsored_vault_sponsor\`. Same shape as add-sponsor (\`sponsor\`, \`sourcePublicKey\`, optional \`contractId\`).

## Prepare / submit

Write endpoints follow the standard two-step flow:

1. **Prepare** — JSON with operation fields (no \`signedXdr\`) → \`xdr\` + \`network\` passphrase.
2. **Sign** — Stellar wallet signs the XDR (sponsor or admin as required).
3. **Submit** — POST the same path with \`{ "signedXdr" }\` → \`tx_id\`.

## Operational notes

- Before sponsoring in **restricted** mode, call **GET** \`/contracts/sponsored-vault/open-to-all\` and inspect \`open\`; if \`false\`, ensure the sponsor is the contract admin or has been added with **add-sponsor** (on-chain admin tx).
- Avoid calling **create** when the owner already has a vault; prefer an on-chain or API read of vault existence first (see vault read operations).
- Backoffice or internal tools may wrap these endpoints for governance; the canonical REST surface is under \`/contracts/sponsored-vault/*\` as implemented in the ACTA API.
    `,
};
