import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "api-overview",
  title: "Overview",
  section: "API Reference",
  tocItems: [
    "Architecture",
    "Base URLs",
    "Authentication",
    "Request Format",
    "Response Format",
    "Prepare/Submit Flow",
    "Fees",
    "Issuer DID requirement",
    "Network Configuration",
    "Error Handling",
    "Rate Limiting",
    "Idempotency",
    "Try it in Swagger",
  ],
  content: `
# API Reference Overview

RESTful API for ACTA credential management on Stellar blockchain. All endpoints support both mainnet and testnet networks.

## Architecture

ACTA vaults are **single-tenant**: each owner has their own \`vc-vault\` contract. Vaults are deployed deterministically by a single **\`vc-vault-factory\`** per network. Because deployment is deterministic, the API and SDK derive an owner's vault address from \`(factory, owner, userSalt)\` without storing it - you only pass the \`owner\`.

- **\`userSalt\`** (optional): 32-byte salt that distinguishes multiple vaults for the same owner. The default is **32 zero bytes**, which yields one canonical vault per owner. Pass a different \`userSalt\` only if you intentionally run more than one vault per owner.
- **\`vaultContract\`** (optional, reads): the resolved vault contract id (\`C...\`). When omitted, the API resolves it from \`owner\` (and \`userSalt\`) via the factory. Use it to skip resolution if you already know the address.

Most endpoints take \`owner\` (and optionally \`userSalt\`). There is no per-request \`contractId\` override of the vault: the factory owns deployment and address derivation.

## Base URLs

**Testnet:**

\`\`\`
https://api.testnet.acta.build
\`\`\`

**Mainnet:**

\`\`\`
https://api.mainnet.acta.build
\`\`\`

## Authentication

**Contract routes** (\`/contracts/*\` - vault read/write, sponsored vault, VC operations, contract version, etc.) require a valid API key on every request. Send it in the request header:

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

\`X-ACTA-Key\` is the canonical header; \`x-api-key\` and \`Authorization: Bearer <key>\` are also accepted. API keys are 64-character hex strings (no prefix).

**Public routes** need no API key: \`GET /health\`, \`GET /config\`, \`POST /public/api-keys\` (rate limited per IP), and \`GET /share/:id\` (signature-gated).

**Ownership enforcement:** endpoints that expose or write a holder's credential data (\`/contracts/vc/issue\`, \`/contracts/vc/batch-issue\`, \`/contracts/vault/list-vc-ids\`, \`/contracts/vault/get-vc\`, \`/contracts/vault/push\`) additionally require the \`owner\` (or \`fromOwner\`) in the request to match the \`wallet_address\` bound to your API key. Admin-role keys are exempt. \`verify-vc\` is intentionally open to any valid key so third parties can verify credentials.

**Sponsor enforcement:** \`POST /contracts/sponsored-vault/create\` is open to standard keys, but the \`sponsor\` (and \`sourcePublicKey\`, when sent) must match the \`wallet_address\` bound to your API key, so you can only pay for a deployment with your own account. The \`owner\` is deliberately unrestricted: sponsoring somebody else's vault is what the endpoint is for.

**Admin routes** (\`/admin/*\` and \`/contracts/admin/*\`) require an API key with the **admin** role.

### Getting an API Key

You can create a public API key (standard role, expires in 6 months) via:

- **POST** \`/public/api-keys\` on the network base URL (e.g. \`https://api.testnet.acta.build/public/api-keys\` or \`https://api.mainnet.acta.build/public/api-keys\`)

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

## Fees

Issuance fees are charged **on-chain by the vault** via the factory's \`quote_fee\`. The fee is paid by the **issuer** at issuance time (mainnet: 1 USDC per credential; testnet: 5 XLM per credential). The API **no longer accepts a fee override** in any request body. There are no role-based fee tiers: there is a single standard fee plus an optional per-issuer custom fee, both resolved on-chain.

## Issuer DID requirement

The issuer must be a registered, resolvable **\`did:stellar\`**. Bare wallet addresses and \`did:pkh\` values are **no longer accepted** as the issuer DID. The API enforces a controller-to-DID binding: the DID's on-chain controller must equal the signing issuer, otherwise the request fails with error \`issuerDid_controller_mismatch\`.

The credential **holder** is expressed inside \`vcData\` as \`credentialSubject.id\` (a DID). There is no separate \`holder\` or wallet field on issue requests.

## Network Configuration

### GET /config

Returns public network configuration. **No API key required** and no rate limit: it is the public bootstrap endpoint SDKs call once per session.

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

Authenticated endpoints are rate limited **per API key** over a sliding 60-second window, with separate read and write buckets that depend on the key's role:

| Role | Reads / min | Writes / min |
|------|-------------|--------------|
| standard | 60 | 20 |
| early | 300 | 100 |
| admin | 200 | 50 |

- Public API key creation (\`POST /public/api-keys\`): 5 requests per minute per IP
- Response headers: \`X-RateLimit-Limit\` / \`X-RateLimit-Remaining\` (reads), \`X-WriteRateLimit-*\` (writes), and \`Retry-After\` on \`429\` (\`rate_limit_exceeded\` / \`write_rate_limit_exceeded\`)

## Idempotency

Contract write routes accept an optional \`Idempotency-Key\` header (up to 200 chars). The first response for a given key is cached for 24 hours and replayed on retries with the header \`Idempotency-Replayed: true\` - useful for safely retrying submits.

## Try it in Swagger

Use **[Swagger UI (testnet)](https://api.testnet.acta.build/docs)** to browse the OpenAPI spec, inspect request and response schemas, and run **Try it out** requests in the browser for endpoints that allow it.

1. Open **[https://api.testnet.acta.build/docs](https://api.testnet.acta.build/docs)**
2. Expand an operation, review parameters and examples, then use **Try it out** where enabled
3. For routes that require an API key, set the **\`X-ACTA-Key\`** header (or use Swagger’s **Authorize** control when available) after creating a key (see **Getting an API Key** above)

> Swagger UI is available on **testnet only**: on mainnet instances all \`/docs\` routes are disabled and return 404. Use testnet for exploration and the same paths against \`https://api.mainnet.acta.build\` in production.
    `,
};
