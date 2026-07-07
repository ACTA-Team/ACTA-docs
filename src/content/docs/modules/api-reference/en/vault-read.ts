import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Vault Operations (Read)",
  section: "API Reference",
  tocItems: [
    "Authentication & Ownership",
    "List VC IDs",
    "VC Count",
    "Get VC",
    "Verify VC",
    "Vault Metadata",
    "Denied Issuers",
    "Denied Issuer Count",
    "Request Parameters",
    "Responses",
  ],
  content: `
# Vault Operations (Read)

Read-only operations for vault data.

Reads identify the vault by **\`owner\`** (plus an optional **\`userSalt\`**); the API derives the vault address through the factory. There is no \`contractId\` override.

## Authentication & Ownership

All read endpoints require a valid API key (\`X-ACTA-Key\` header).

- **\`list-vc-ids\`** and **\`get-vc\`** additionally require that \`owner\` matches the \`wallet_address\` bound to your API key (admin-role keys are exempt), because they enumerate and return decrypted credential contents.
- **\`verify-vc\`** and the GET reads are open to **any valid API key**, so third parties can verify credentials and read public vault metadata.

## List VC IDs

### POST /contracts/vault/list-vc-ids

Lists verifiable credential (VC) IDs stored in an owner's vault, paginated.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "offset": 0,
  "limit": 50,
  "userSalt": "00...00"
}
\`\`\`

- \`offset\` (optional): zero-based start index, default \`0\`
- \`limit\` (optional): page size, default \`50\`, maximum \`200\` (larger values return \`400 limit_too_large\`)

**Response:**

\`\`\`json
{
  "result": ["credential-1", "credential-2", "credential-3"],
  "offset": 0,
  "limit": 50
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/list-vc-ids \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## VC Count

### GET /contracts/vault/vc-count

Returns the number of VCs stored in an owner's vault. Use it to size pagination for \`list-vc-ids\`.

**Query Parameters:** \`owner\` (required), \`userSalt\` (optional)

**Response:**

\`\`\`json
{
  "count": 3
}
\`\`\`

**Example:**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" \\
  "https://api.testnet.acta.build/contracts/vault/vc-count?owner=G..."
\`\`\`

## Get VC

### POST /contracts/vault/get-vc

Gets a specific verifiable credential from a vault. Credential data is stored encrypted on-chain and is decrypted by the API before returning it, which is why this endpoint enforces key-to-owner binding.

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
  "result": {
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
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Verify VC

### POST /contracts/vault/verify-vc

Verifies a VC by checking it exists in the owner's vault and returning its on-chain issuance status. Open to any valid API key (no ownership check) - this is the endpoint third-party verifiers use.

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

\`status\` is one of \`"valid"\`, \`"revoked"\`, or \`"invalid"\` (with \`"unknown"\` as a fallback when the contract returns an unexpected shape).

**Example:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
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
curl -H "X-ACTA-Key: your_key" \\
  "https://api.testnet.acta.build/contracts/vault/G..."
\`\`\`

## Denied Issuers

### GET /contracts/vault/issuers/denied

Lists the issuer addresses currently blocked (denied) for the owner's vault, paginated. Issuance is open by default, so this is the set of explicit exceptions.

**Query Parameters:** \`owner\` (required), \`offset\` (optional), \`limit\` (optional, max 200), \`userSalt\` (optional)

**Response:**

\`\`\`json
{
  "issuers": ["G...", "G..."],
  "offset": 0,
  "limit": 50
}
\`\`\`

## Denied Issuer Count

### GET /contracts/vault/issuers/denied/count

Returns the number of denied issuers for the owner's vault.

**Query Parameters:** \`owner\` (required), \`userSalt\` (optional)

**Response:**

\`\`\`json
{
  "count": 1
}
\`\`\`

## Request Parameters

POST reads take a JSON body:
- **owner** (required): Vault owner address (G...)
- **vcId** (required for get-vc and verify-vc): Credential identifier
- **offset** / **limit** (optional, list-vc-ids only): pagination, limit ≤ 200
- **userSalt** (optional): 32-byte salt (64 hex chars) selecting the owner's vault; defaults to 32 zero bytes (one canonical vault per owner)

GET reads take \`owner\` as a query parameter (or as the path segment for vault metadata) and accept \`userSalt\` as a query parameter.

## Responses

- **List VC IDs**: \`{ result, offset, limit }\` with \`result\` an array of credential ID strings
- **VC Count**: \`{ count }\`
- **Get VC**: \`{ result }\` with the decrypted credential data
- **Verify VC**: \`{ status, since? }\` with \`status\` "valid" | "revoked" | "invalid"
- **Vault Metadata**: \`{ owner, vault_address, did_uri, version, vc_count, denied_issuer_count }\`
- **Denied Issuers**: \`{ issuers, offset, limit }\`; **Denied Issuer Count**: \`{ count }\`
    `,
};
