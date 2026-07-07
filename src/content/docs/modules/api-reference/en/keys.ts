import type { DocPage } from "@/@types/docs";

export const keys: DocPage = {
  slug: "api-keys",
  title: "API Keys",
  section: "API Reference",
  tocItems: [
    "Create Testnet API Key",
    "Create Mainnet API Key",
    "Request Body",
    "Response",
    "Rate Limiting",
  ],
  content: `
# API Keys Endpoints

Public endpoint for creating API keys. No authentication required, but rate limited.

> **Note:** You can also request API keys directly from the [ACTA dApp](https://dapp.acta.build/). The dApp provides a user-friendly interface to create and manage your API keys.

## Create API Key

### POST /public/api-keys

Creates an API key (standard role, expires in 6 months). Use the **testnet** or **mainnet** base URL depending on the network you need.

- Testnet: \`https://api.testnet.acta.build/public/api-keys\`
- Mainnet: \`https://api.mainnet.acta.build/public/api-keys\`

**Rate Limit:** 5 requests per minute per IP

**Request Body:**

\`\`\`json
{
  "name": "My API Key",
  "wallet_address": "G...",
  "metadata": {
    "network": "testnet"
  }
}
\`\`\`

Include \`metadata.network\`: \`"testnet"\` or \`"mainnet"\` to match the API base URL you are calling.

**Response:**

\`\`\`json
{
  "message": "API key created successfully. Save this key - it will not be shown again.",
  "api_key": "64-character hex string",
  "api_key_record": {
    "id": "uuid",
    "name": "My API Key",
    "role": "standard",
    "is_active": true,
    "expires_at": "2024-07-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

**Example (testnet):**

\`\`\`bash
curl -X POST https://api.testnet.acta.build/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Testnet Key",
    "wallet_address": "G...",
    "metadata": {
      "network": "testnet"
    }
  }'
\`\`\`

**Example (mainnet):**

\`\`\`bash
curl -X POST https://api.mainnet.acta.build/public/api-keys \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Mainnet Key",
    "wallet_address": "G...",
    "metadata": {
      "network": "mainnet"
    }
  }'
\`\`\`

## Request Body

- \`name\` (optional): Name for the API key (max 120 chars)
- \`wallet_address\` (optional): Stellar wallet address (G...)
- \`metadata\` (optional): Additional metadata object
  - \`network\` (required): "testnet" or "mainnet"

## Response

- \`api_key\`: The API key - a 64-character hex string with no prefix (save this - it won't be shown again)
- \`api_key_record\`: Metadata about the created key

**One key per wallet:** creating a key again for the same wallet rotates it - the previous key is revoked and replaced. \`metadata.network\` must match the network of the base URL you call; a mismatch returns \`400 network_mismatch\`.

## Rate Limiting

- Maximum 5 requests per minute per IP address
- Rate limit headers included in response:
  - \`X-RateLimit-Limit\`: 5
  - \`X-RateLimit-Remaining\`: Remaining requests
  - \`X-RateLimit-Reset\`: Unix timestamp when limit resets

**Note:** API key creation via these endpoints is restricted by an Origin allowlist (\`https://dapp.acta.build\`, plus \`localhost\` for development); other origins receive \`403 forbidden_origin\`. For the easiest experience, we recommend using the [ACTA dApp](https://dapp.acta.build/) to create and manage your API keys.
    `,
};
