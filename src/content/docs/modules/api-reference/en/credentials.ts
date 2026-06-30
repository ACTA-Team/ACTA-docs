import type { DocPage } from "@/@types/docs";

export const credentials: DocPage = {
  slug: "api-credentials",
  title: "Credential Operations",
  section: "API Reference",
  tocItems: [
    "Issuer DID requirement",
    "Issue Credential",
    "Batch Issue",
    "Revoke Credential",
    "Fees",
    "Request Body",
    "Prepare/Submit Flow",
  ],
  content: `
# Credential Operations

Endpoints for issuing and revoking verifiable credentials. All support prepare/submit flow. **Issue Credential** (\`POST /contracts/vc/issue\`) and **Batch Issue** (\`POST /contracts/vc/batch-issue\`) require an API key; **Revoke Credential** does not require authentication.

> **Single-tenant vaults (v0.4.0):** issuance targets the **owner's derived vault** (\`(factory, owner, userSalt)\`). Pass **\`owner\`** plus the optional **\`userSalt\`** / **\`vaultContract\`** — there is no vault \`contractId\` for issuance.

## Issuer DID requirement

The issuer must control a **registered, resolvable \`did:stellar\`**:

- **\`issuerDid\`** is **required** and must be a \`did:stellar:{network}:{didId}\` that resolves on-chain. \`did:pkh\` and bare wallet addresses are **no longer accepted**.
- The API enforces a **controller↔DID binding**: the DID's on-chain controller must equal the signing issuer. If they differ, the request fails with **\`issuerDid_controller_mismatch\`**.

## Issue Credential

### POST /contracts/vc/issue

Issues a VC: stores payload in the owner's derived vault and writes issuance status = valid. The on-chain fee is charged via the factory's \`quote_fee\` and paid by the issuer. **Requires API key.**

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
  "issuerDid": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "userSalt": "0000...0000",
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
    "issuerDid": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
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

## Batch Issue

### POST /contracts/vc/batch-issue

Issues multiple VCs into the owner's derived vault in a single transaction. Same issuer DID requirement and on-chain fee per credential apply. **Requires API key.**

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "issuerDid": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G...",
  "vcs": [
    {
      "vcId": "credential-1",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}"
    },
    {
      "vcId": "credential-2",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}"
    }
  ]
}
\`\`\`

**Response (Submit):**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Revoke Credential

### POST /contracts/vc/revoke

Revokes a VC by ID in the owner's derived vault. No authentication required. **Requires \`owner\`** so the API can derive the correct vault.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
  "userSalt": "0000...0000",
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

## Fees

Issuance fees are charged **on-chain** by the vault via the factory's \`quote_fee\` (default **1 USDC per credential**, paid by the **issuer**). The API **no longer accepts a fee override**, and there are no role-based fee tiers — the factory has a single standard fee plus an optional per-issuer custom fee (with optional expiry).

## Request Body

### Issue Credential

- **owner** (required): Vault owner address (\`G...\`); the vault is derived from it.
- **vcId** (required): Credential identifier
- **vcData** (required): Credential data payload (JSON string). Must include \`@context\` with at least \`"https://www.w3.org/ns/credentials/v2"\`. The holder is expressed inside \`vcData\` as \`credentialSubject.id\` (e.g. a \`did:stellar\`), not as a separate field.
- **issuer** (required): Issuer address (\`G...\`)
- **issuerDid** (required): The issuer's resolvable \`did:stellar\`; its on-chain controller must equal \`issuer\`
- **userSalt** (optional): 32-byte salt (hex) selecting the owner's vault (default all-zero)
- **vaultContract** (optional): Explicit vault \`C...\` id, bypassing derivation
- **sourcePublicKey** (required): Transaction source that will sign (must be issuer)

### Batch Issue

- **owner**, **issuer**, **issuerDid**, **sourcePublicKey**: as above
- **userSalt** / **vaultContract** (optional): as above
- **vcs** (required): Array of \`{ vcId, vcData }\` entries (the holder lives inside each \`vcData\` as \`credentialSubject.id\`)

### Revoke Credential

- **owner** (required): Vault owner address (\`G...\`); the vault is derived from it.
- **vcId** (required): Credential identifier
- **date** (optional): ISO-8601 timestamp (default: now)
- **userSalt** (optional): Selects the owner's vault (default all-zero)
- **sourcePublicKey** (required): Transaction source that will sign

## Prepare/Submit Flow

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Send request with \`signedXdr\` to execute

**Note:** The \`issue\` endpoint stores the credential in the derived vault and marks it as valid in a single transaction; the on-chain fee is charged at this step.
    `,
};
