import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Vault Operations (Read)",
  section: "API Reference",
  tocItems: [
    "List VC IDs",
    "VC Count",
    "Get VC",
    "Verify VC",
    "Vault Metadata",
    "Denied Issuers",
    "Denied Issuer Count",
    "Request Body",
    "Responses",
  ],
  content: `
# Vault Operations (Read)

Read-only operations for vault data. No authentication required.

Reads identify the vault by **\`owner\`** (plus an optional **\`userSalt\`**). You may also pass **\`vaultContract\`** (the resolved \`C...\` address) to skip factory resolution. There is no \`contractId\` override.

## List VC IDs

### POST /contracts/vault/list-vc-ids

Lists verifiable credential (VC) IDs stored in an owner's vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "00...00"
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

## VC Count

### POST /contracts/vault/vc-count

Returns the number of VCs stored in an owner's vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "00...00"
}
\`\`\`

**Response:**

\`\`\`json
{
  "count": 3
}
\`\`\`

## Get VC

### POST /contracts/vault/get-vc

Gets a specific verifiable credential from a vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "00...00"
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
      "id": "did:stellar:...",
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
  "userSalt": "00...00"
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

## Vault Metadata

### GET /contracts/vault/:owner

Returns metadata for the owner's vault. Accepts an optional \`userSalt\` query parameter to select a non-default vault.

**Response:**

\`\`\`json
{
  "owner": "G...",
  "vault_address": "C...",
  "did_uri": "did:stellar:...",
  "version": "0.4.0",
  "vc_count": 3,
  "denied_issuer_count": 1
}
\`\`\`

**Example:**

\`\`\`bash
curl "https://api.testnet.acta.build/contracts/vault/G..."
\`\`\`

## Denied Issuers

### GET /contracts/vault/:owner/issuers/denied

Lists the issuer addresses currently blocked (denied) for the owner's vault. Issuance is open by default, so this is the set of explicit exceptions.

**Response:**

\`\`\`json
["G...", "G..."]
\`\`\`

## Denied Issuer Count

### GET /contracts/vault/:owner/issuers/denied/count

Returns the number of denied issuers for the owner's vault.

**Response:**

\`\`\`json
{
  "count": 1
}
\`\`\`

## Request Body

POST reads require:
- **owner** (required): Vault owner address (G...)
- **vcId** (required for get-vc and verify-vc): Credential identifier
- **userSalt** (optional): 32-byte salt selecting the owner's vault; defaults to 32 zero bytes (one canonical vault per owner)
- **vaultContract** (optional): Resolved vault address (C...) to skip factory resolution

GET reads take \`owner\` as a path segment and accept \`userSalt\` as a query parameter.

## Responses

- **List VC IDs**: Array of credential ID strings
- **VC Count**: \`{ count }\`
- **Get VC**: Credential data object or null if not found
- **Verify VC**: Status object with \`status\` ("valid" | "revoked") and optional \`since\` timestamp
- **Vault Metadata**: \`{ owner, vault_address, did_uri, version, vc_count, denied_issuer_count }\`
- **Denied Issuers**: Array of issuer addresses; **Denied Issuer Count**: \`{ count }\`
    `,
};
