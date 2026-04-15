import type { DocPage } from "@/@types/docs";

export const contractInfo: DocPage = {
  slug: "api-contract-info",
  title: "Contract Info",
  section: "API Reference",
  tocItems: ["Get Contract Version", "Query Parameters", "Response"],
  content: `
# Contract Info Endpoints

Endpoints for retrieving contract information.

## Get Contract Version

### GET /contracts/version

Returns the ACTA contract version string. No authentication required.

**Query Parameters:**

- \`contractId\` (optional): Override contract ID (C...)
- \`sourcePublicKey\` (required): An existing Stellar account (G...) used for Soroban simulation

**Response:**

\`\`\`json
{
  "version": "1.0.0"
}
\`\`\`

**Example:**

\`\`\`bash
curl "https://acta.build/api/testnet/contracts/version?sourcePublicKey=G..."
\`\`\`

## Query Parameters

- **contractId** (optional): Override the default ACTA contract ID
- **sourcePublicKey** (required): Stellar public key (G...) used for contract simulation

## Response

- **version**: Contract version string
    `,
};
