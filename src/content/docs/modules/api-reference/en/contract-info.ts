import type { DocPage } from "@/@types/docs";

export const contractInfo: DocPage = {
  slug: "api-contract-info",
  title: "Contract Info",
  section: "API Reference",
  tocItems: ["Get Contract Version", "Fees", "Query Parameters", "Response"],
  content: `
# Contract Info Endpoints

Endpoints for retrieving contract information.

## Get Contract Version

### GET /contracts/version

Returns the version string of an owner's **vault** contract. Vaults are single-tenant, so the version is per-vault: pass the \`owner\` (and optionally \`userSalt\`) so the factory can resolve the vault to query. **Requires an API key** (\`X-ACTA-Key\`).

**Query Parameters:**

- \`owner\` (optional): Vault owner address (G...) whose vault version you want. Without it, the endpoint returns the factory id and a note instead of a version (there is no factory-level version).
- \`userSalt\` (optional): 32-byte salt selecting the owner's vault; defaults to 32 zero bytes
- \`sourcePublicKey\` (optional): An existing Stellar account (G...) used for Soroban simulation

**Response (with \`owner\`):**

\`\`\`json
{
  "version": "0.4.0"
}
\`\`\`

**Response (without \`owner\`):**

\`\`\`json
{
  "factory_id": "C...",
  "note": "No factory-level version; pass ?owner= for a vault version."
}
\`\`\`

**Example:**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" \\
  "https://api.testnet.acta.build/contracts/version?owner=G...&sourcePublicKey=G..."
\`\`\`

## Fees

The issuance fee is read **on-chain from the factory's \`quote_fee\`** only. There are no role-based fee tiers: a single standard fee applies, with an optional per-issuer custom fee, both resolved on-chain. The fee is paid by the issuer at issuance time (mainnet: 1 USDC per credential; testnet: 5 XLM). The API does not expose a fee-tier endpoint and does not accept a fee override.

## Query Parameters

- **owner** (optional): Vault owner address (G...); omit to get the factory id instead of a vault version
- **userSalt** (optional): 32-byte salt selecting the owner's vault; defaults to 32 zero bytes
- **sourcePublicKey** (optional): Stellar public key (G...) used for contract simulation

## Response

- **version**: Vault contract version string
    `,
};
