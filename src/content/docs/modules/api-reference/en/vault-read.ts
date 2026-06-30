import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Vault Operations (Read)",
  section: "API Reference",
  tocItems: [
    "List VC IDs",
    "Get VC",
    "Verify VC",
    "VC Count",
    "Denied Issuers",
    "Denied Issuer Count",
    "Vault Metadata",
    "Request Body",
    "Responses",
  ],
  content: `
# Vault Operations (Read)

Read-only operations for vault data. No authentication required.

> **Single-tenant vaults (v0.4.0):** read routes take **\`owner\`** and derive the vault from \`(factory, owner, userSalt)\`. Pass the optional **\`userSalt\`** (32-byte hex, default all-zero) to target a non-canonical vault, or **\`vaultContract\`** (\`C...\`) to address a vault directly and skip derivation.

## List VC IDs

### POST /contracts/vault/list-vc-ids

Lists verifiable credential (VC) IDs stored in an owner's vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "0000...0000"
}
\`\`\`

**Response:**

\`\`\`json
["credential-1", "credential-2", "credential-3"]
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/list-vc-ids \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## Get VC

### POST /contracts/vault/get-vc

Gets a specific verifiable credential from a vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "0000...0000"
}
\`\`\`

**Response:**

\`\`\`json
{
  "vcData": {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
      "name": "John Doe"
    }
  }
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/get-vc \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Verify VC

### POST /contracts/vault/verify-vc

Verifies a VC by checking it exists in the owner's vault and returning its issuance status.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "0000...0000"
}
\`\`\`

**Response:**

\`\`\`json
{
  "status": "valid",
  "since": "2024-01-01T00:00:00.000Z"
}
\`\`\`

Or if revoked:

\`\`\`json
{
  "status": "revoked",
  "since": "2024-01-15T00:00:00.000Z"
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## VC Count

### POST /contracts/vault/vc-count

Returns the number of VCs stored in an owner's vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "0000...0000"
}
\`\`\`

**Response:**

\`\`\`json
{
  "count": 12
}
\`\`\`

## Denied Issuers

### GET /contracts/vault/issuers/denied

Lists the issuers an owner has **blocked** (deny-by-exception). Issuance is open by default, so this list is empty unless the owner has explicitly blocked someone.

**Query Parameters:**

- \`owner\` (required): Vault owner address (\`G...\`)
- \`userSalt\` (optional): Selects the vault. Defaults to all-zero.
- \`vaultContract\` (optional): Explicit vault \`C...\` id.

**Response:**

\`\`\`json
["G...blocked-1", "G...blocked-2"]
\`\`\`

**Example:**

\`\`\`bash
curl "https://api.testnet.acta.build/contracts/vault/issuers/denied?owner=G..."
\`\`\`

## Denied Issuer Count

### GET /contracts/vault/issuers/denied/count

Returns the number of blocked issuers for an owner's vault.

**Query Parameters:**

- \`owner\` (required): Vault owner address (\`G...\`)
- \`userSalt\` (optional): Selects the vault. Defaults to all-zero.
- \`vaultContract\` (optional): Explicit vault \`C...\` id.

**Response:**

\`\`\`json
{
  "count": 2
}
\`\`\`

## Vault Metadata

### GET /contracts/vault/:owner

Returns the derived vault's metadata for an owner.

**Path / Query Parameters:**

- \`:owner\` (required): Vault owner address (\`G...\`)
- \`userSalt\` (optional, query): Selects the vault. Defaults to all-zero.
- \`vaultContract\` (optional, query): Explicit vault \`C...\` id.

**Response:**

\`\`\`json
{
  "owner": "G...",
  "vault_address": "C...",
  "did_uri": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "version": "0.4.0",
  "vc_count": 12,
  "denied_issuer_count": 2
}
\`\`\`

**Example:**

\`\`\`bash
curl "https://api.testnet.acta.build/contracts/vault/G..."
\`\`\`

## Request Body

VC operations require:
- **owner** (required): Vault owner address (\`G...\`)
- **vcId** (required for get-vc and verify-vc): Credential identifier
- **userSalt** (optional): 32-byte salt (hex) selecting which of the owner's vaults to target (default all-zero)
- **vaultContract** (optional): Explicit vault \`C...\` id, bypassing derivation

## Responses

- **List VC IDs**: Array of credential ID strings
- **Get VC**: Credential data object or null if not found
- **Verify VC**: Status object with \`status\` ("valid" | "revoked") and optional \`since\` timestamp
- **VC Count / Denied Issuer Count**: \`{ "count": number }\`
- **Denied Issuers**: Array of blocked issuer addresses
- **Vault Metadata**: \`{ owner, vault_address, did_uri, version, vc_count, denied_issuer_count }\`
    `,
};
