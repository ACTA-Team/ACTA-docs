import type { DocPage } from "@/@types/docs";

export const vaultWrite: DocPage = {
  slug: "api-vault-write",
  title: "Vault Operations (Write)",
  section: "API Reference",
  tocItems: [
    "Create Vault",
    "Deny Issuer",
    "Allow Issuer",
    "Revoke Vault",
    "Set New Owner",
    "Sponsored vault",
    "Prepare/Submit Flow",
  ],
  content: `
# Vault Operations (Write)

Write operations for vault management. All endpoints support prepare/submit flow. **Authentication:** same as other \`/contracts/*\` routes - valid \`X-ACTA-Key\` (see API Overview).

> **Single-tenant vaults (v0.4.0):** each owner has their own \`vc-vault\`, deployed by the \`vc-vault-factory\`. The API derives the vault address from \`(factory, owner, userSalt)\`, so you pass **\`owner\`** (not a vault \`contractId\`). The optional **\`userSalt\`** (32-byte hex, default all-zero) selects which of an owner's vaults to target.

## Create Vault

### POST /contracts/vault/create

Deploys a new single-tenant vault for an owner **via the factory** (\`factory.deploy\`). The vault address is deterministic for \`(factory, owner, userSalt)\`.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "userSalt": "0000000000000000000000000000000000000000000000000000000000000000",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (required): Vault owner address (\`G...\`).
- **didUri** (required): DID URI stored for the vault.
- **userSalt** (optional): 32-byte salt (hex) selecting the vault. Defaults to all-zero (the canonical vault).
- **sourcePublicKey** (required): Transaction source that will sign.

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

## Deny Issuer

### POST /contracts/vault/deny-issuer

Issuance is **open by default**. To stop a specific issuer from writing to your vault, **block** it with \`deny_issuer\`. (Back-compat alias: \`POST /contracts/vault/revoke-issuer\` maps to deny.)

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (required): Vault owner address (\`G...\`).
- **issuer** (required): Issuer address to block (\`G...\`).
- **userSalt** (optional): Selects the vault. Defaults to all-zero.
- **sourcePublicKey** (required): Transaction source that will sign (the owner).

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

## Allow Issuer

### POST /contracts/vault/allow-issuer

Removes an issuer from the vault's deny list, restoring its (default) ability to issue. (Back-compat alias: \`POST /contracts/vault/authorize-issuer\` maps to allow.)

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (required): Vault owner address (\`G...\`).
- **issuer** (required): Issuer address to unblock (\`G...\`).
- **userSalt** (optional): Selects the vault. Defaults to all-zero.
- **sourcePublicKey** (required): Transaction source that will sign (the owner).

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

Revokes the owner's vault (writes that require an active vault are blocked afterwards).

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
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
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
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

## Sponsored vault

Vault creation where a **sponsor** signs \`deploy_sponsored\` on the factory instead of the owner signing \`deploy\`. The owner still receives a single-tenant vault at the deterministic \`(factory, owner, userSalt)\` address. The **public** HTTP surface is only **\`POST /contracts/sponsored-vault/create\`** (same \`X-ACTA-Key\` middleware as other public \`/contracts/*\` writes). Sponsored deploy is **open** - there is no sponsor whitelist.

See **Sponsored Vault** (\`api-sponsored-vault\`) for contract semantics, the create endpoint, and \`sponsoredVaultCreate\` in the Credentials SDK.

## Prepare/Submit Flow

All write endpoints follow the same pattern:

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Send request with \`signedXdr\` to execute

**Common Parameters:**
- **owner** (required): Vault owner address (\`G...\`); the API derives the vault from it.
- **sourcePublicKey** (required): Transaction source that will sign (must be an authorized signer).
- **userSalt** (optional): 32-byte salt (hex) selecting which of the owner's vaults to target. Defaults to all-zero.
    `,
};
