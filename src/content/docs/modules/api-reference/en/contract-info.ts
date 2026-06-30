import type { DocPage } from "@/@types/docs";

export const contractInfo: DocPage = {
  slug: "api-contract-info",
  title: "Contract Info",
  section: "API Reference",
  tocItems: [
    "Get Contract Version",
    "Fee Configuration",
    "Query Parameters",
    "Response",
  ],
  content: `
# Contract Info Endpoints

Endpoints for retrieving contract information.

## Get Contract Version

### GET /contracts/version

Returns a contract version string. No authentication required.

With **\`?owner=\`** it returns the **per-vault** version of that owner's derived vault. Without \`owner\`, it reports the version reachable for the configured factory wiring. There is no factory-level version endpoint.

**Query Parameters:**

- \`owner\` (optional): Owner address (\`G...\`) — returns that vault's version.
- \`userSalt\` (optional): Selects which of the owner's vaults to read (default all-zero).
- \`sourcePublicKey\` (required): An existing Stellar account (\`G...\`) used for Soroban simulation.

**Response:**

\`\`\`json
{
  "version": "0.4.0"
}
\`\`\`

**Example:**

\`\`\`bash
curl "https://api.testnet.acta.build/contracts/version?owner=G...&sourcePublicKey=G..."
\`\`\`

## Fee Configuration

Issuance fees live **on the factory** and are read via its **\`quote_fee\`** (the same value charged on-chain at issuance — default 1 USDC per credential, paid by the issuer). There are **no role-based fee reads** (the old fee-admin / fee-early / fee-standard tiers are gone); the factory exposes a single standard fee plus an optional per-issuer custom fee.

\`quote_fee\` resolves the effective fee for a given issuer (custom fee if set and unexpired, otherwise the standard fee).

## Query Parameters

- **owner** (optional): Owner address (\`G...\`) for a per-vault version read.
- **userSalt** (optional): 32-byte salt (hex) selecting the owner's vault (default all-zero).
- **sourcePublicKey** (required): Stellar public key (\`G...\`) used for contract simulation.

## Response

- **version**: Contract version string (per-vault when \`owner\` is supplied).
    `,
};
