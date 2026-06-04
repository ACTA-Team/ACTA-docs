import type { DocPage } from "@/@types/docs";

export const credentials: DocPage = {
  slug: "api-credentials",
  title: "Credential Operations",
  section: "API Reference",
  tocItems: [
    "Issue Credential",
    "Issue Linked Credential",
    "Revoke Credential",
    "Request Body",
    "Prepare/Submit Flow",
  ],
  content: `
# Credential Operations

Endpoints for issuing and revoking verifiable credentials. All support prepare/submit flow. **Issue Credential** (\`POST /contracts/vc/issue\`) and **Issue Linked Credential** (\`POST /contracts/vc/issue-linked\`) require an API key; **Revoke Credential** does not require authentication.

## Issue Credential

### POST /contracts/vc/issue

Issues a VC: stores payload in the owner's vault and writes issuance status = valid. **Requires API key.**

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "holder": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "issuerDid": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
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

**Example:**

\`\`\`bash
# Prepare
curl -X POST https://api.testnet.acta.build/contracts/vc/issue \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "holder": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
    "sourcePublicKey": "G..."
  }'

# Submit (after signing)
curl -X POST https://api.testnet.acta.build/contracts/vc/issue \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Issue Linked Credential

### POST /contracts/vc/issue-linked

Issues a VC linked to a parent VC: stores payload in the owner's vault with a reference to the parent credential. The parent VC must exist and be valid. **Requires API key.**

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "linked-credential-456",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "holder": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "issuerDid": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "sourcePublicKey": "G...",
  "contractId": "C...",
  "parentOwner": "G...",
  "parentVcId": "credential-123"
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

**Example:**

\`\`\`bash
# Prepare
curl -X POST https://api.testnet.acta.build/contracts/vc/issue-linked \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "linked-credential-456",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "holder": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
    "sourcePublicKey": "G...",
    "parentOwner": "G...",
    "parentVcId": "credential-123"
  }'

# Submit (after signing)
curl -X POST https://api.testnet.acta.build/contracts/vc/issue-linked \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Revoke Credential

### POST /contracts/vc/revoke

Revokes a VC by ID. No authentication required.

**Request Body (Prepare):**

\`\`\`json
{
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
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

## Request Body

### Issue Credential

- **owner** (required): Vault owner address (G...)
- **vcId** (required): Credential identifier
- **vcData** (required): Credential data payload (JSON string). Must include \`@context\` with at least \`"https://www.w3.org/ns/credentials/v2"\`
- **issuer** (required): Issuer address (G...)
- **holder** (required): DID of the credential holder in format \`did:stellar:{network}:{didId}\`
- **issuerDid** (optional): DID of the issuer in format \`did:stellar:{network}:{didId}\`
- **sourcePublicKey** (required): Transaction source that will sign (must be issuer)
- **contractId** (optional): Override ACTA contract ID (C...)

### Issue Linked Credential

- **owner** (required): Vault owner address (G...)
- **vcId** (required): Credential identifier
- **vcData** (required): Credential data payload (JSON string). Must include \`@context\` with at least \`"https://www.w3.org/ns/credentials/v2"\`
- **issuer** (required): Issuer address (G...)
- **holder** (required): DID of the credential holder in format \`did:stellar:{network}:{didId}\`
- **issuerDid** (optional): DID of the issuer in format \`did:stellar:{network}:{didId}\`
- **sourcePublicKey** (required): Transaction source that will sign (must be issuer)
- **contractId** (optional): Override ACTA contract ID (C...)
- **parentOwner** (required): Parent VC owner address (G...)
- **parentVcId** (required): Parent VC identifier

### Revoke Credential

- **vcId** (required): Credential identifier
- **date** (optional): ISO-8601 timestamp (default: now)
- **sourcePublicKey** (required): Transaction source that will sign (must be VC owner or contract admin)
- **contractId** (optional): Override ACTA contract ID (C...)

## Prepare/Submit Flow

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Send request with \`signedXdr\` to execute

**Note:** The \`issue\` endpoint automatically stores the credential in the vault and marks it as valid in a single transaction.
    `,
};
