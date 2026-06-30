import type { DocPage } from "@/@types/docs";

export const healthStatus: DocPage = {
  slug: "api-health-status",
  title: "Health & Status",
  section: "API Reference",
  tocItems: ["Health Check", "Network Configuration"],
  content: `
# Health & Status Endpoints

Endpoints for checking API health and retrieving network configuration.

## Health Check

### GET /health

Checks the API status. No authentication required.

**Response:**

\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

**Example:**

\`\`\`bash
curl https://api.testnet.acta.build/health
\`\`\`

:::health-try:::

## Network Configuration

### GET /config

Gets public network configuration. Requires API key.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Response:**

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "networkType": "testnet",
  "factoryContractId": "C...",
  "vaultWasmHash": "2bd0323a...",
  "didStellarRegistryId": "C...",
  "actaContractId": "C..."
}
\`\`\`

- **factoryContractId**: the \`vc-vault-factory\` contract id for this network.
- **networkType**: \`testnet\` or \`mainnet\`.
- **vaultWasmHash**: the \`vc-vault\` template WASM hash deployed by the factory.
- **didStellarRegistryId**: the \`did:stellar\` registry contract id used to resolve issuer DIDs.
- **actaContractId**: back-compat alias of \`factoryContractId\`.

**Example:**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" https://api.testnet.acta.build/config
\`\`\`
    `,
};
