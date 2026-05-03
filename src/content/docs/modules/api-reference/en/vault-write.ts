import type { DocPage } from "@/@types/docs";

export const vaultWrite: DocPage = {
  slug: "api-vault-write",
  title: "Vault Operations (Write)",
  section: "API Reference",
  tocItems: [
    "Create Vault",
    "Authorize Issuer",
    "Authorize Issuers (Multiple)",
    "Revoke Issuer",
    "Revoke Vault",
    "Set New Owner",
    "Migrate",
    "Sponsored vault",
    "Prepare/Submit Flow",
  ],
  content: `
# Vault Operations (Write)

Write operations for vault management. All endpoints support prepare/submit flow. **Authentication:** same as other \`/contracts/*\` routes — valid \`X-ACTA-Key\` (see API Overview).

## Create Vault

### POST /contracts/vault/create

Creates (initializes) a vault for an owner.

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

## Authorize Issuers (Multiple)

### POST /contracts/vault/authorize-issuers

Replaces the full authorized issuer list for a vault with the given array.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuers": ["G...", "G...", "G..."],
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

Completely revokes a vault.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "sourcePublicKey": "G...",
  "contractId": "C..."
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
  "sourcePublicKey": "G...",
  "contractId": "C..."
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

## Migrate

### POST /contracts/vault/migrate

Migrates legacy vault data for an owner to the current format.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
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

Vault creation where a **sponsor** signs \`create_sponsored_vault\` on the vc-vault contract instead of the owner signing \`create_vault\`. Includes admin-only settings (\`open-to-all\`, sponsor allowlist) and five HTTP routes under \`/contracts/sponsored-vault/*\`.

See the dedicated page **Sponsored Vault** (\`api-sponsored-vault\`) in this API Reference for contract semantics, all endpoints, SDK methods, and error codes.

## Prepare/Submit Flow

All write endpoints follow the same pattern:

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Send request with \`signedXdr\` to execute

**Common Parameters:**
- **owner** (required): Vault owner address (G...)
- **sourcePublicKey** (required): Transaction source that will sign (must be authorized signer)
- **contractId** (optional): Override ACTA contract ID (C...)
    `,
};
