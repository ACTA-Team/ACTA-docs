import type { DocPage } from "@/@types/docs";

export const vaultWrite: DocPage = {
  slug: "api-vault-write",
  title: "Vault Operations (Write)",
  section: "API Reference",
  tocItems: [
    "Create Vault",
    "Deny Issuer",
    "Allow Issuer",
    "Set Vault DID",
    "Push Credential",
    "Revoke Vault",
    "Set New Owner",
    "Sponsored vault",
    "Prepare/Submit Flow",
  ],
  content: `
# Vault Operations (Write)

Write operations for vault management. All endpoints support prepare/submit flow. **Authentication:** same as other \`/contracts/*\` routes - valid \`X-ACTA-Key\` (see API Overview).

Vaults are **single-tenant**: each owner has their own \`vc-vault\` contract, deployed deterministically by the \`vc-vault-factory\`. You identify the vault by \`owner\` (plus an optional \`userSalt\`); there is no per-request vault \`contractId\` override.

## Create Vault

### POST /contracts/vault/create

Deploys (and initializes) the owner's vault **through the factory**. The factory derives the vault address deterministically from \`(factory, owner, userSalt)\`, so the same owner + salt always maps to the same vault.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (required): Vault owner address (G...).
- **didUri** (required): DID URI stored for the vault owner.
- **userSalt** (optional): 32-byte salt selecting which vault for this owner. Defaults to 32 zero bytes (one canonical vault per owner).
- **sourcePublicKey** (required): Transaction source that signs the prepared XDR.

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

Issuance is **open by default**: any issuer may write to the vault unless the owner blocks it. **Deny Issuer** blocks a specific issuer (adds it to the vault's denied set).

> **Back-compat:** \`POST /contracts/vault/revoke-issuer\` remains available as an alias of this route (revoke → deny).

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "00...00",
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

## Allow Issuer

### POST /contracts/vault/allow-issuer

Unblocks a previously denied issuer (removes it from the vault's denied set). Since issuance is open by default, this is only needed to undo a prior **Deny Issuer**.

> **Back-compat:** \`POST /contracts/vault/authorize-issuer\` remains available as an alias of this route (authorize → allow).

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "00...00",
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

## Set Vault DID

### POST /contracts/vault/set-vault-did

Updates the DID URI stored for the owner's vault. Signed by the **vault owner**.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

**Responses:** Prepare returns \`{ xdr, network }\`; Submit (\`{ "signedXdr": "..." }\`) returns \`{ tx_id }\`.

## Push Credential

### POST /contracts/vault/push

Moves a credential from one factory-deployed vault to another vault **with the same owner** (for example, between an owner's canonical vault and a salted vault). The credential is written to the destination vault and removed from the source vault. \`fromOwner\` must match the wallet bound to your API key.

**Request Body (Prepare):**

\`\`\`json
{
  "fromOwner": "G...",
  "toOwner": "G...",
  "vcId": "credential-123",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **sourcePublicKey** (required): must be \`fromOwner\` (the source vault admin signs).

**Responses:** Prepare returns \`{ xdr, network }\`; Submit returns \`{ tx_id }\`.

## Revoke Vault

### POST /contracts/vault/revoke-vault

Completely revokes the owner's vault. **Irreversible**: all writes into the vault are blocked afterwards.

**Request Body (Prepare):**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "00...00",
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
  "userSalt": "00...00",
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

Vault deployment where a **sponsor** invokes \`deploy_sponsored\` on the **vc-vault-factory** instead of the owner deploying their own vault. On-chain, sponsorship is open (any address may sponsor), but the HTTP route **\`POST /contracts/sponsored-vault/create\`** requires an API key with the **admin** role.

See **Sponsored Vault** (\`api-sponsored-vault\`) for contract semantics, the create endpoint, and \`sponsoredVaultCreate\` in the Credentials SDK.

## Prepare/Submit Flow

All write endpoints follow the same pattern:

1. **Prepare**: Send request with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Send request with \`signedXdr\` to execute

**Common Parameters:**
- **owner** (required): Vault owner address (G...)
- **userSalt** (optional): 32-byte salt selecting the owner's vault; defaults to 32 zero bytes (one canonical vault per owner)
- **sourcePublicKey** (required): Transaction source that will sign (must be an authorized signer)
    `,
};
