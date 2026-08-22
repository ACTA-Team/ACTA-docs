import type { DocPage } from "@/@types/docs";

export const credentials: DocPage = {
  slug: "api-credentials",
  title: "Credential Operations",
  section: "API Reference",
  tocItems: [
    "Issue Credential",
    "Batch Issue",
    "Revoke Credential",
    "Issuer DID requirement",
    "Fees",
    "Request Body",
    "Prepare/Submit Flow",
  ],
  content: `
# Credential Operations

Endpoints for issuing and revoking verifiable credentials. All support prepare/submit flow and **all require an API key** (\`X-ACTA-Key\`). **Issue Credential** (\`POST /contracts/vc/issue\`) and **Batch Issue** (\`POST /contracts/vc/batch-issue\`) additionally require that \`owner\` matches the wallet bound to your API key (admin-role keys are exempt).

## Issue Credential

### POST /contracts/vc/issue

Issues a VC: stores the payload in the owner's vault and writes issuance status = valid. **Requires API key.**

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "issuerDid": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

The credential **holder** is identified by \`credentialSubject.id\` (a DID) inside \`vcData\`. There is no separate \`holder\` field.

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
curl -X POST https://sandbox-api.acta.build/contracts/vc/issue \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "issuerDid": "did:stellar:...",
    "sourcePublicKey": "G..."
  }'

# Submit (after signing)
curl -X POST https://sandbox-api.acta.build/contracts/vc/issue \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Batch Issue

### POST /contracts/vc/batch-issue

Issues several VCs into the same owner's vault in a single transaction. Each entry carries only \`vcId\` and \`vcData\`; the holder of each credential is \`credentialSubject.id\` inside its own \`vcData\` (there is **no** \`holder\` field). **Requires API key.**

**Limits:** 1 to 5 credentials per batch (\`MAX_BATCH_SIZE\` = 5); \`vcId\` up to 64 characters; \`vcData\` up to 10,000 characters. Exceeding them returns \`400 batch_too_large\`, \`400 vcs[i].vcId_too_long\`, or \`400 vcs[i].vcData_too_long\`.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "issuerDid": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G...",
  "vcs": [
    {
      "vcId": "credential-1",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\"}}"
    },
    {
      "vcId": "credential-2",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\"}}"
    }
  ]
}
\`\`\`

**Request Body (Submit):**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Responses:** Prepare returns \`{ xdr, network }\`; Submit returns \`{ tx_id }\`.

## Revoke Credential

### POST /contracts/vc/revoke

Revokes a VC by ID in a specific owner's vault. Requires an API key. The transaction must be signed by the **vault owner** (the contract enforces \`owner.require_auth()\`).

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
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

## Issuer DID requirement

The \`issuerDid\` must be a registered, resolvable **\`did:stellar\`**. Bare wallet addresses and \`did:pkh\` values are **no longer accepted**. The API enforces a controller-to-DID binding: the DID's on-chain controller must equal the signing \`issuer\`. If they differ, the request fails with:

\`\`\`json
{
  "error": "issuerDid_controller_mismatch",
  "message": "The issuer DID controller does not match the signing issuer"
}
\`\`\`

## Fees

Issuance charges an **on-chain fee** computed by the vault via the factory's \`quote_fee\` and **paid by the issuer** (mainnet: 1 USDC per credential; testnet: 5 XLM). The API does **not** accept a fee override: there is a single standard fee plus an optional per-issuer custom fee, both resolved on-chain.

## Request Body

### Issue Credential

- **owner** (required): Vault owner address (G...)
- **vcId** (required): Credential identifier (max 64 characters)
- **vcData** (required): Credential data payload (JSON string, max 10,000 characters). Must include \`@context\` with at least \`"https://www.w3.org/ns/credentials/v2"\`, and \`credentialSubject.id\` (the holder DID). The API encrypts \`vcData\` (AES-256-GCM) before it is stored on-chain
- **issuer** (required): Issuer address (G...)
- **issuerDid** (required): Registered, resolvable \`did:stellar\` whose on-chain controller equals \`issuer\`
- **userSalt** (optional): 32-byte salt selecting the owner's vault; defaults to 32 zero bytes
- **sourcePublicKey** (required): Transaction source that will sign (must be the issuer)

### Batch Issue

- **owner** (required): Vault owner address (G...)
- **issuer** (required): Issuer address (G...)
- **issuerDid** (required): Registered, resolvable \`did:stellar\` whose on-chain controller equals \`issuer\`
- **vcs** (required): Array of \`{ vcId, vcData }\`. Each \`vcData\` carries its own \`credentialSubject.id\` holder DID
- **userSalt** (optional): 32-byte salt selecting the owner's vault
- **sourcePublicKey** (required): Transaction source that will sign (must be the issuer)

### Revoke Credential

- **owner** (required): Vault owner address (G...) whose vault holds the credential
- **vcId** (required): Credential identifier
- **date** (optional): ISO-8601 timestamp (default: now)
- **userSalt** (optional): 32-byte salt selecting the owner's vault
- **sourcePublicKey** (required): Transaction source that will sign (must be the VC owner or contract admin)

## Prepare/Submit Flow

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Send request with \`signedXdr\` to execute

**Note:** \`issue\` stores the credential in the vault and marks it as valid in a single transaction.
    `,
};
