import type { DocPage } from "@/@types/docs";

export const didStellarApi: DocPage = {
  slug: "did-stellar-api",
  title: "HTTP API",
  section: "DID:Stellar",
  tocItems: [
    "Base URL",
    "Health and OpenAPI",
    "Resolve a DID",
    "Get raw record",
    "Register (create)",
    "Update",
    "Transfer controller",
    "Deactivate",
    "Submit signed XDR",
    "Error responses",
    "Configuration",
  ],
  content: `
# HTTP API

The \`did-stellar-api\` is a stateless HTTP service that wraps the \`@acta-team/did-stellar\` SDK for non-JavaScript consumers. It is DIF Universal Resolver compatible and requires no authentication.

## Base URL

\`\`\`
https://did.acta.build
\`\`\`

## Health and OpenAPI

| Method | Path | Description |
|--------|------|-------------|
| \`GET\` | \`/health\` | Returns \`{ "status": "ok" }\` |
| \`GET\` | \`/openapi.json\` | Full OpenAPI 3.1 specification |

## Resolve a DID

DIF Universal Resolver compatible endpoint.

\`\`\`
GET /1.0/identifiers/{did}
\`\`\`

**Content negotiation:**

| Accept header | Response format |
|--------------|-----------------|
| \`application/did+ld+json\` (default) | JSON-LD with \`@context\` |
| \`application/did+json\` | Plain JSON, no \`@context\` |

**Success response (200):**

\`\`\`json
{
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/multikey/v1"
    ],
    "id": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
    "verificationMethod": [
      {
        "id": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4#auth-1",
        "type": "Multikey",
        "controller": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
        "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
      }
    ],
    "authentication": ["#auth-1"],
    "assertionMethod": [],
    "keyAgreement": [],
    "service": []
  },
  "didDocumentMetadata": {
    "versionId": "1",
    "method": {
      "network": "testnet",
      "stellarAccount": "GXXXXXX..."
    }
  },
  "didResolutionMetadata": {
    "contentType": "application/did+ld+json"
  }
}
\`\`\`

**Status codes:**

| Code | Meaning |
|------|---------|
| \`200\` | Active DID |
| \`400\` | Invalid DID syntax |
| \`404\` | DID not found |
| \`406\` | Unsupported \`Accept\` header |
| \`410\` | DID deactivated (tombstone) |

## Get raw record

Returns the on-chain \`DidRecord\` without W3C document wrapping.

\`\`\`
GET /v1/dids/stellar/{did}
\`\`\`

**Response (200):**

\`\`\`json
{
  "did": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  "didId": "aaaqeayeaudaocajbifqydiob4",
  "record": {
    "version": 1,
    "createdLedger": 2661630,
    "updatedLedger": 2661630,
    "deactivated": false,
    "controller": "GXXXXXX...",
    "authentication": [{ "publicKeyMultibase": "z6Mk..." }],
    "assertionMethod": [{ "publicKeyMultibase": "z6Mk..." }],
    "keyAgreement": [],
    "services": []
  }
}
\`\`\`

## Register (create)

All mutation endpoints follow a **prepare/submit** pattern. First prepare to get unsigned XDR, then submit after signing.

\`\`\`
POST /v1/dids/stellar
\`\`\`

### Prepare

**Request body:**

\`\`\`json
{
  "did": "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  "record": {
    "controller": "GXXXXXX...",
    "authentication": [{ "publicKeyMultibase": "z6Mk..." }],
    "assertionMethod": [{ "publicKeyMultibase": "z6Mk..." }],
    "keyAgreement": [],
    "services": []
  },
  "sourcePublicKey": "GXXXXXX..."
}
\`\`\`

**Response (200):**

\`\`\`json
{
  "xdr": "AAAAAgAAAAA...",
  "network": "testnet",
  "networkPassphrase": "Test SDF Network ; September 2015"
}
\`\`\`

### Submit

\`\`\`json
{
  "signedXdr": "AAAAAgAAAAA..."
}
\`\`\`

**Response (200):**

\`\`\`json
{
  "txId": "9c3234a8a9c9b3cc9a24fa7751cd4a4cfda167763343fa5a9888388d4a57119c"
}
\`\`\`

## Update

\`\`\`
PATCH /v1/dids/stellar/{did}
\`\`\`

**Request body (prepare):**

\`\`\`json
{
  "expectedVersion": 1,
  "record": {
    "controller": "GXXXXXX...",
    "authentication": [{ "publicKeyMultibase": "z6Mk...newKey" }],
    "assertionMethod": [],
    "keyAgreement": [],
    "services": []
  },
  "sourcePublicKey": "GXXXXXX..."
}
\`\`\`

## Transfer controller

\`\`\`
POST /v1/dids/stellar/{did}/transfer
\`\`\`

**Request body (prepare):**

\`\`\`json
{
  "expectedVersion": 1,
  "newController": "GYYYYYY...",
  "sourcePublicKey": "GXXXXXX..."
}
\`\`\`

## Deactivate

\`\`\`
POST /v1/dids/stellar/{did}/deactivate
\`\`\`

**Request body (prepare):**

\`\`\`json
{
  "expectedVersion": 1,
  "sourcePublicKey": "GXXXXXX..."
}
\`\`\`

## Submit signed XDR

Generic endpoint to submit any signed mutation XDR.

\`\`\`
POST /v1/dids/stellar/submit
\`\`\`

**Request body:**

\`\`\`json
{
  "signedXdr": "AAAAAgAAAAA..."
}
\`\`\`

**Response (200):**

\`\`\`json
{
  "txId": "9c3234a8..."
}
\`\`\`

## Error responses

All errors follow a consistent shape:

\`\`\`json
{
  "code": "version_mismatch",
  "message": "the on-chain version drifted...",
  "details": { "contractErrorNumber": 3 }
}
\`\`\`

Error codes match the SDK's \`DidErrorCode\` type. See the [SDK error codes](#did-stellar-sdk) for the full list.

## Configuration

The API service is configured via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| \`PORT\` | \`8080\` | HTTP listen port |
| \`NETWORK_TYPE\` | \`testnet\` | \`mainnet\` or \`testnet\` |
| \`STELLAR_RPC_URL\` | SDF public endpoint | Override Stellar RPC URL |
| \`DID_REGISTRY_CONTRACT_ID\` | Testnet default | Registry contract ID |
| \`REDIS_URL\` | (none) | Optional Redis for caching and rate limiting |
| \`RESOLVER_CACHE_TTL_SECONDS\` | \`30\` | Resolution result cache TTL |
| \`RATE_LIMIT_MAX\` | \`120\` | Max requests per window |
| \`RATE_LIMIT_WINDOW_SECONDS\` | \`60\` | Rate limit window in seconds |
| \`CORS_ORIGINS\` | \`*\` | CORS allow-list (comma-separated) |
| \`LOG_LEVEL\` | \`info\` | Pino log level |

### Redis

When \`REDIS_URL\` is set:

- DID resolutions are cached per \`RESOLVER_CACHE_TTL_SECONDS\`
- Rate limiting uses a Redis sliding-window (shared across replicas)

When unset:

- In-memory cache per process
- Rate limiting per process (not shared)
    `,
};
