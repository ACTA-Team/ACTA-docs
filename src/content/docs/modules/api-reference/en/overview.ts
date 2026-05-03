import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "api-overview",
  title: "Overview",
  section: "API Reference",
  tocItems: [
    "Base URLs",
    "Authentication",
    "Request Format",
    "Response Format",
    "Prepare/Submit Flow",
    "Error Handling",
    "Rate Limiting",
    "Try it in Postman",
  ],
  content: `
# API Reference Overview

RESTful API for ACTA credential management on Stellar blockchain. All endpoints support both mainnet and testnet networks.

## Base URLs

**Testnet:**

\`\`\`
https://acta.build/api/testnet
\`\`\`

**Mainnet:**

\`\`\`
https://acta.build/api/mainnet
\`\`\`

## Authentication

**Contract routes** (\`/contracts/*\` — vault read/write, sponsored vault, VC operations, contract version, etc.) require a valid API key on every request. Send it in the request header:

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

### Getting an API Key

You can create a public API key (standard role, expires in 6 months) via:

- **POST** \`/public/api-keys\` on the network base URL (e.g. \`https://acta.build/api/testnet/public/api-keys\` or \`https://acta.build/api/mainnet/public/api-keys\`)

No authentication required, but rate limited to 5 requests per minute per IP.

## Request Format

All requests use JSON format. Content-Type header should be \`application/json\`.

### Write Operations (Prepare/Submit)

Write operations support two modes:

1. **Prepare**: Send request without \`signedXdr\` → returns unsigned XDR
2. **Submit**: Send request with \`signedXdr\` → executes the transaction

Example prepare request:

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "...",
  "issuer": "G...",
  "sourcePublicKey": "G..."
}
\`\`\`

Example submit request:

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

## Response Format

### Success Response

Prepare mode returns unsigned XDR + network passphrase:

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

Submit mode returns the transaction ID:

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

### Error Response

\`\`\`json
{
  "error": "error_code",
  "message": "Human readable error message"
}
\`\`\`

## Prepare/Submit Flow

1. **Prepare**: Call endpoint with operation parameters (no \`signedXdr\`)
2. **Sign**: Sign the returned \`xdr\` with your Stellar wallet using the \`network\` passphrase
3. **Submit**: Call the same endpoint with \`signedXdr\` to execute

## Error Handling

All errors return JSON with:
- \`error\`: Error code identifier
- \`message\`: Human-readable error description

Common HTTP status codes:
- \`200\`: Success
- \`400\`: Bad request (invalid parameters)
- \`401\`: Unauthorized (missing or invalid API key)
- \`403\`: Forbidden (insufficient permissions)
- \`404\`: Not found
- \`429\`: Rate limit exceeded
- \`500\`: Internal server error

## Rate Limiting

- Public API key creation: 5 requests per minute per IP
- Authenticated endpoints: Rate limits may apply based on API key tier
- Rate limit headers included in responses:
  - \`X-RateLimit-Limit\`: Maximum requests allowed
  - \`X-RateLimit-Remaining\`: Remaining requests in window
  - \`X-RateLimit-Reset\`: Unix timestamp when limit resets

## Try it in Postman

Want to test the ACTA API right away? We have a public Postman collection with all the endpoints pre-configured and ready to use.

1. Open the [ACTA Postman Collection](https://www.postman.com/acta-xyz-1193247/workspace/acta-team/collection/52380013-1a09da17-4bee-4267-b469-610c46969235?action=share&creator=52380013&active-environment=52380013-785bdf1a-3108-4c33-808c-76e31ee3b67f)
2. **Fork the collection** into your own Postman workspace
3. Select the environment (**testnet** or **mainnet**)
4. Start making requests!

> Forking lets you keep a personal copy you can customize, and still pull updates when we add new endpoints.
    `,
};
