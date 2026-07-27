import type { DocPage } from "@/@types/docs";

export const registry: DocPage = {
  slug: "did-registry",
  title: "Registry & Resolver",
  section: "DID",
  tocItems: [
    "On-chain registry",
    "The DID record",
    "Record limits",
    "Contract operations",
    "Deployed contracts",
    "Resolution states",
    "Hosted resolver (did.acta.build)",
    "Endpoints",
    "Resolution endpoint",
    "Mutation endpoints",
    "Prepare/Submit",
    "Rate limits & errors",
  ],
  content: `
# Registry & Resolver

The state of every \`did:stellar\` lives in the **did-stellar-registry** Soroban contract. The hosted resolver at **\`https://did.acta.build\`** is a stateless HTTP convenience on top of it: it resolves DIDs, prepares unsigned XDRs, and submits signed ones. It requires **no authentication** and never holds keys.

## On-chain registry

- One entry per DID in **Soroban persistent storage**, keyed by the 16-byte DID id.
- **Reads are free**: resolution uses \`getLedgerEntries\` on Stellar RPC, no transaction or fee involved.
- The contract is a *dumb store*: it persists exactly what \`register\`/\`update\` send. It never fills defaults or invents keys. Bookkeeping fields (\`version\`, \`createdLedger\`, \`updatedLedger\`, \`deactivated\`) are contract-owned and overwrite anything the caller passes.

## The DID record

| Field | Type | Constraint |
|-------|------|-----------|
| \`controller\` | Stellar address | Classic \`G...\` accounts only (v0.1) |
| \`authentication\` | \`DidKey[]\` | 1 to 3 keys (at least 1 required) |
| \`assertionMethod\` | \`DidKey[]\` | 0 to 3 keys |
| \`keyAgreement\` | \`DidKey[]\` | 0 or 1 key |
| \`services\` | \`DidService[]\` | 0 to 3 entries |
| \`metadataUri\` | optional string | HTTPS only, max 255 chars |
| \`metadataHash\` | optional 32 bytes | SHA-256; requires \`metadataUri\` |
| \`version\` | u32 | Starts at 1, +1 per mutation |
| \`createdLedger\` / \`updatedLedger\` | u32 | Ledger sequence numbers |
| \`deactivated\` | bool | One-way flag |

\`DidKey\` is \`{ publicKeyMultibase }\`. \`DidService\` is \`{ idSuffix, serviceType, serviceEndpoint }\`, exposed in the document as \`{did}#service-{idSuffix}\`.

## Record limits

| Limit | Value |
|-------|-------|
| Key multibase length | max 128 chars |
| Service \`idSuffix\` | max 32 chars, \`^[a-z0-9]([a-z0-9-]*[a-z0-9])?$\` |
| Service \`serviceType\` | max 64 chars, non-empty |
| Service / metadata URLs | HTTPS only, max 255 chars |

## Contract operations

| Operation | Auth | Optimistic concurrency |
|-----------|------|------------------------|
| \`register(did_id, initial_record)\` | \`initial_record.controller\` signs | No (new entry) |
| \`update(did_id, expected_version, next_record)\` | Current controller | Yes |
| \`transfer_controller(did_id, expected_version, new_controller)\` | Current controller | Yes |
| \`deactivate(did_id, expected_version)\` | Current controller | Yes |
| \`get(did_id)\` | None (read) | No |

Contract error codes are documented in **[Contract errors](doc:contract-errors)** (did:stellar registry table).

## Deployed contracts

| Network | Registry contract ID |
|---------|----------------------|
| Testnet | \`CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ\` |
| Mainnet | \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\` |

These are the registries used by \`did.acta.build\`, the ACTA API, and the libraries' defaults.

## Resolution states

Resolving a DID that does not exist is not an exception, it is an answer. Every outcome comes back as one of five shapes; the library reports it in \`didResolutionMetadata.error\`, and the hosted resolver additionally maps it onto an HTTP status.

| State | \`didDocument\` | \`didResolutionMetadata.error\` | HTTP |
|-------|----------------|--------------------------------|------|
| **Active** | Full document, \`didDocumentMetadata.deactivated: false\` | absent | \`200\` |
| **Tombstone** | Document with every relationship array empty, \`deactivated: true\` | absent | \`410\` |
| **Not found** | \`null\` | \`notFound\` | \`404\` |
| **Invalid DID** | \`null\` | \`invalidDid\` | \`400\` |
| **RPC unreachable** | \`null\` | \`internalError\` | \`502\` |

- **A tombstone is not a failure.** A deactivated DID still resolves, and it has to: a verifier needs to tell *deactivated* apart from *never existed*. The flag is one-way and cannot be reset.
- **Not found never falls back to another network.** The network is part of the DID, so testnet and mainnet identifiers are read from different registries.
- **Invalid DID is decided before any network call**, by the syntax rules in **[Overview](doc:did-overview)**.
- **\`internalError\` is about the endpoint, not the DID.** The Stellar RPC node did not answer. Retry, or point \`rpcUrl\` at another node.

In the TypeScript library, \`resolveDidStellar()\` reserves thrown errors for caller mistakes: a malformed DID string (\`did_invalid\`) or bad configuration (\`rpc_url_invalid\`, \`contract_id_invalid\`). Everything else is returned as data, so branch on \`didResolutionMetadata.error\` rather than on \`try/catch\`.

## Hosted resolver (did.acta.build)

- **No authentication** and **no key custody**: it only handles unsigned and signed XDRs.
- **Multi-network**: one deployment serves both testnet and mainnet, routing each request by the network inside the DID.
- Stateless and horizontally scalable; resolution results are cached ~30 seconds.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | \`/health\` | Liveness + configured networks |
| GET | \`/docs\` | Swagger UI |
| GET | \`/openapi.json\` | OpenAPI 3.1 spec |
| GET | \`/1.0/identifiers/{did}\` | **DIF Universal Resolver** endpoint (W3C DID resolution) |
| GET | \`/v1/dids/stellar/{did}\` | Raw on-chain DID record |
| POST | \`/v1/dids/stellar\` | Register (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/update\` | Update (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/transfer\` | Transfer controller (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/deactivate\` | Deactivate, irreversible (prepare/submit) |
| POST | \`/v1/dids/stellar/submit\` | Submit any signed XDR |

## Resolution endpoint

### GET /1.0/identifiers/{did}

Returns the W3C DID Resolution Result (\`didDocument\` + \`didDocumentMetadata\` + \`didResolutionMetadata\`). Content negotiation: \`application/did+ld+json\` (default, with \`@context\`) or \`application/did+json\`.

\`\`\`bash
curl https://did.acta.build/1.0/identifiers/did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi
\`\`\`

| Status | Meaning |
|--------|---------|
| 200 | Active DID resolved |
| 400 | Invalid DID (\`didResolutionMetadata.error: "invalidDid"\`) |
| 404 | Not registered |
| 410 | Deactivated (tombstone document) |
| 502 | Stellar RPC unreachable |

### GET /v1/dids/stellar/{did}

Returns the raw on-chain record without W3C wrapping: \`{ did, didId, record: { controller, authentication, assertionMethod, keyAgreement, services, version, createdLedger, updatedLedger, deactivated } }\`. Use it to read the current \`version\` before an update, or the \`controller\` directly.

## Mutation endpoints

All mutations are POST and follow the same **prepare/submit** pattern used across ACTA.

**Register (prepare):**

\`\`\`bash
curl -X POST https://did.acta.build/v1/dids/stellar \\
  -H "Content-Type: application/json" \\
  -d '{
    "did": "did:stellar:testnet:...",
    "sourcePublicKey": "G...",
    "record": {
      "controller": "G...",
      "authentication": [{ "publicKeyMultibase": "z6Mk..." }],
      "assertionMethod": [{ "publicKeyMultibase": "z6Mk..." }],
      "keyAgreement": [],
      "services": []
    }
  }'
\`\`\`

Response: \`{ "xdr": "...", "network": "testnet", "networkPassphrase": "..." }\`

**Submit** (after signing with the controller wallet):

\`\`\`bash
curl -X POST https://did.acta.build/v1/dids/stellar/submit \\
  -H "Content-Type: application/json" \\
  -d '{ "signedXdr": "AAAA..." }'
\`\`\`

Response: \`{ "txId": "..." }\`

- **Update**: \`POST /v1/dids/stellar/{did}/update\` with \`{ expectedVersion, sourcePublicKey, record }\`. Full record replacement; a stale version returns \`409 version_mismatch\`.
- **Transfer**: \`POST /v1/dids/stellar/{did}/transfer\` with \`{ expectedVersion, newController, sourcePublicKey }\`.
- **Deactivate**: \`POST /v1/dids/stellar/{did}/deactivate\` with \`{ expectedVersion, sourcePublicKey }\`. Afterwards the DID resolves with \`410\`.

## Prepare/Submit

Mode is selected by the body: with \`signedXdr\` present, the route submits; without it, the route validates and returns the unsigned \`xdr\` plus the network passphrase. The controller's Stellar wallet signs the transaction envelope; DID keys inside the record are separate material (they sign credentials and Proof of Control challenges, never the registration transaction).

## Rate limits & errors

- Per-IP rate limit: **120 requests per 60 seconds** by default, with \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, and \`Retry-After\` headers; \`429\` returns \`{ "code": "rate_limited" }\`.
- Every error uses a stable envelope \`{ code, message, details? }\` where \`code\` is a machine-readable string shared with the TypeScript library (e.g. \`did_invalid\`, \`did_already_exists\`, \`version_mismatch\`, \`did_deactivated\`, \`tx_submission_failed\`). Branch on \`code\`, never on \`message\`.
- Requests carry an \`X-Request-ID\` correlation header, echoed back in responses.
    `,
};
