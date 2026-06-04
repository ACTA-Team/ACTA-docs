import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Vault Operations (Read)",
  section: "API Reference",
  tocItems: [
    "List VC IDs",
    "Get VC",
    "Get VC Parent",
    "Verify VC",
    "Request Body",
    "Responses",
  ],
  content: `
# Vault Operations (Read)

Read-only operations for vault data. No authentication required.

## List VC IDs

### POST /contracts/vault/list-vc-ids

Lists verifiable credential (VC) IDs stored in an owner's vault.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "contractId": "C..."
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
  "contractId": "C..."
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

## Get VC Parent

### POST /contracts/vault/get-vc-parent

Gets the parent VC info for a linked credential. Returns \`null\` if the credential has no parent link. No authentication required.

**Request Body:**

\`\`\`json
{
  "owner": "G...",
  "vcId": "linked-credential-456",
  "contractId": "C..."
}
\`\`\`

**Response (with parent):**

\`\`\`json
{
  "parent": {
    "owner": "G...",
    "vc_id": "credential-123"
  }
}
\`\`\`

**Response (no parent):**

\`\`\`json
{
  "parent": null
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/get-vc-parent \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "linked-credential-456"
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
  "contractId": "C..."
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

## Request Body

All endpoints require:
- **owner** (required): Vault owner address (G...)
- **vcId** (required for get-vc, get-vc-parent, and verify-vc): Credential identifier
- **contractId** (optional): Override ACTA contract ID (C...)

## Responses

- **List VC IDs**: Array of credential ID strings
- **Get VC**: Credential data object or null if not found
- **Verify VC**: Status object with \`status\` ("valid" | "revoked") and optional \`since\` timestamp
    `,
};
