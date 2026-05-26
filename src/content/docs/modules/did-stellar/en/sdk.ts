import type { DocPage } from "@/@types/docs";

export const didStellarSdk: DocPage = {
  slug: "did-stellar-sdk",
  title: "SDK (@acta-team/did-stellar)",
  section: "DID:Stellar",
  tocItems: [
    "Installation",
    "Identifier generation",
    "Parsing and validation",
    "Resolving a DID",
    "Register a DID",
    "Update a DID",
    "Transfer controller",
    "Deactivate a DID",
    "Read raw record",
    "DIF did-resolver driver",
    "React hook (useDid)",
    "HTTP client (ActaDidClient)",
    "Error handling",
    "Multikey codec",
    "Constants and configuration",
  ],
  content: `
# SDK (\`@acta-team/did-stellar\`)

The \`@acta-team/did-stellar\` package is the official TypeScript SDK for the \`did:stellar\` method. It provides identifier generation, resolution, record management, proof-of-control, and transaction preparation - all with zero ACTA-hosted dependencies in the hot path.

## Installation

\`\`\`bash
npm install @acta-team/did-stellar
\`\`\`

**Peer dependencies** (optional):

\`\`\`bash
# Only if using the React hook
npm install react
\`\`\`

## Identifier generation

\`\`\`typescript
import {
  generateDidId,
  generateDidIdBytes,
  buildDidStellar,
  buildDidStellarFromBytes,
  encodeDidId,
  decodeDidId,
} from "@acta-team/did-stellar";

// Generate a random 26-char base32 DID ID
const didId = generateDidId();
// => "aaaqeayeaudaocajbifqydiob4"

// Generate raw 16 bytes
const didIdBytes = generateDidIdBytes();

// Build a full DID string
const did = buildDidStellar("testnet", didId);
// => "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4"

// Build from raw bytes
const didFromBytes = buildDidStellarFromBytes("testnet", didIdBytes);

// Encode/decode between bytes and base32
const encoded = encodeDidId(didIdBytes);
const decoded = decodeDidId(encoded);
\`\`\`

## Parsing and validation

\`\`\`typescript
import {
  parseDidStellar,
  isValidDidStellar,
  isNetworkType,
} from "@acta-team/did-stellar";

// Parse a DID string into components
const parsed = parseDidStellar("did:stellar:testnet:aaaqeayeaudaocajbifqydiob4");
// => { network: "testnet", didId: "aaaqeayeaudaocajbifqydiob4", didIdBytes: Uint8Array }

// Validate DID format
const valid = isValidDidStellar("did:stellar:testnet:aaaqeayeaudaocajbifqydiob4");
// => true

// Validate network type
const isNet = isNetworkType("testnet");
// => true
\`\`\`

## Resolving a DID

Resolution reads the on-chain record and builds a W3C DID Document.

\`\`\`typescript
import { resolveDidStellar } from "@acta-team/did-stellar";

const result = await resolveDidStellar(
  "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  {
    rpcUrl: "https://soroban-testnet.stellar.org", // optional, uses default
    registryContractId: "CB7ATU7...", // optional, uses default
  }
);

// result.didDocument       - W3C DID Document (null if not found)
// result.didDocumentMetadata  - version, deactivated flag, network, controller
// result.didResolutionMetadata - contentType
\`\`\`

### Resolution result shape

\`\`\`typescript
interface DidResolutionResult {
  didDocument: DidDocument | null;
  didDocumentMetadata: DidDocumentMetadata;
  didResolutionMetadata: DidResolutionMetadata;
}
\`\`\`

## Register a DID

Registration is a two-step process: **prepare** the unsigned XDR, then **sign and submit**.

\`\`\`typescript
import {
  generateDidId,
  buildDidStellar,
  prepareRegisterDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";
import type { DidRecordInput } from "@acta-team/did-stellar";

// 1. Generate identifier
const didId = generateDidId();
const did = buildDidStellar("testnet", didId);

// 2. Define the record
const record: DidRecordInput = {
  controller: "GXXXXXX...",
  authentication: [{ publicKeyMultibase: "z6Mk..." }],
  assertionMethod: [{ publicKeyMultibase: "z6Mk..." }],
  keyAgreement: [],
  services: [],
};

// 3. Prepare unsigned XDR
const prepared = await prepareRegisterDidXdr({
  did,
  record,
  sourcePublicKey: "GXXXXXX...",
});

// 4. Sign with wallet (Freighter, Albedo, Hana, etc.)
const signedXdr = await wallet.sign(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});

// 5. Submit to blockchain
const { txId } = await submitSignedXdr({
  signedXdr,
  network: "testnet",
});
\`\`\`

### DidRecordInput

\`\`\`typescript
interface DidRecordInput {
  controller: string;            // Stellar account (G...)
  authentication: DidKey[];      // 1-3 Ed25519 keys (required)
  assertionMethod: DidKey[];     // 0-3 Ed25519 keys
  keyAgreement: DidKey[];        // 0-1 X25519 keys
  services: DidService[];        // 0-3 service endpoints
  metadataUri?: string;          // HTTPS URI
  metadataHash?: string;         // SHA-256 hex (64 chars)
}

interface DidKey {
  publicKeyMultibase: string;    // z6Mk... (Ed25519) or z6LS... (X25519)
}

interface DidService {
  idSuffix: string;              // Alphanumeric + hyphen
  serviceType: string;
  serviceEndpoint: string;       // HTTPS URL
}
\`\`\`

## Update a DID

Updates use **optimistic concurrency** - you must provide the current version to prevent lost updates.

\`\`\`typescript
import {
  resolveDidStellar,
  prepareUpdateDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";

// 1. Get current version
const { didDocumentMetadata } = await resolveDidStellar(did);
const currentVersion = parseInt(didDocumentMetadata.versionId);

// 2. Prepare update
const prepared = await prepareUpdateDidXdr({
  did,
  expectedVersion: currentVersion,
  nextRecord: {
    controller: "GXXXXXX...",
    authentication: [{ publicKeyMultibase: "z6Mk...newKey" }],
    assertionMethod: [],
    keyAgreement: [],
    services: [
      {
        idSuffix: "api",
        serviceType: "LinkedDomains",
        serviceEndpoint: "https://example.com",
      },
    ],
  },
  sourcePublicKey: "GXXXXXX...",
});

// 3. Sign and submit
const signedXdr = await wallet.sign(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

## Transfer controller

Transfer ownership to a different Stellar account.

\`\`\`typescript
import {
  resolveDidStellar,
  prepareTransferControllerXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";

const { didDocumentMetadata } = await resolveDidStellar(did);
const currentVersion = parseInt(didDocumentMetadata.versionId);

const prepared = await prepareTransferControllerXdr({
  did,
  expectedVersion: currentVersion,
  newController: "GYYYYYY...", // New Stellar account
  sourcePublicKey: "GXXXXXX...", // Current controller
});

const signedXdr = await wallet.sign(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

## Deactivate a DID

Deactivation is **irreversible**. The DID becomes a tombstone with empty crypto arrays.

\`\`\`typescript
import {
  resolveDidStellar,
  prepareDeactivateDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";

const { didDocumentMetadata } = await resolveDidStellar(did);
const currentVersion = parseInt(didDocumentMetadata.versionId);

const prepared = await prepareDeactivateDidXdr({
  did,
  expectedVersion: currentVersion,
  sourcePublicKey: "GXXXXXX...",
});

const signedXdr = await wallet.sign(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

## Read raw record

Read the on-chain \`DidRecord\` directly (without W3C document wrapping).

\`\`\`typescript
import { readDidRecord, parseDidStellar } from "@acta-team/did-stellar";
import { rpc } from "@stellar/stellar-sdk";

const { didIdBytes } = parseDidStellar(did);
const rpcServer = new rpc.Server("https://soroban-testnet.stellar.org");

const record = await readDidRecord({
  rpcServer,
  registryContractId: "CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ",
  didIdBytes,
});

if (record) {
  console.log(record.version);        // number
  console.log(record.controller);     // Stellar account
  console.log(record.deactivated);    // boolean
  console.log(record.createdLedger);  // Ledger at registration
  console.log(record.updatedLedger);  // Ledger at last mutation
}
\`\`\`

## DIF did-resolver driver

Plug into the DIF Universal Resolver ecosystem.

\`\`\`typescript
import { Resolver } from "did-resolver";
import { getResolver } from "@acta-team/did-stellar";

const resolver = new Resolver(getResolver());

const result = await resolver.resolve(
  "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4"
);
\`\`\`

## React hook (\`useDid\`)

Import from \`@acta-team/did-stellar/hooks\`. Requires \`react\` as a peer dependency.

\`\`\`typescript
import { useDid } from "@acta-team/did-stellar/hooks";

function MyComponent() {
  const { register, update, transfer, deactivate, resolve, getRecord } = useDid();

  const handleRegister = async () => {
    const { txId } = await register({
      did: "did:stellar:testnet:...",
      record: { /* DidRecordInput */ },
      sourcePublicKey: "GXXXXXX...",
      sign: async (xdr, { networkPassphrase }) => {
        // Sign with your wallet
        return signedXdr;
      },
    });
  };
}
\`\`\`

### Hook methods

| Method | Description |
|--------|-------------|
| \`register\` | Create a new DID (prepare, sign, submit) |
| \`update\` | Update an existing DID |
| \`transfer\` | Transfer controller to a new account |
| \`deactivate\` | Permanently deactivate a DID |
| \`resolve\` | Resolve a DID to a W3C document |
| \`getRecord\` | Read the raw on-chain record |

All mutation methods accept a \`sign\` callback:

\`\`\`typescript
type Signer = (
  unsignedXdr: string,
  opts: { networkPassphrase: string }
) => Promise<string>;
\`\`\`

## HTTP client (\`ActaDidClient\`)

Optional HTTP client for non-RPC consumers.

\`\`\`typescript
import { ActaDidClient } from "@acta-team/did-stellar";

const client = new ActaDidClient({
  baseUrl: "https://did.acta.build",
  timeoutMs: 10_000, // optional, default 10s
});

// Resolve
const result = await client.resolve("did:stellar:testnet:...");

// Resolve document only (throws if not found)
const doc = await client.resolveDocument("did:stellar:testnet:...");

// Get raw record
const { did, didId, record } = await client.getDidRecord("did:stellar:testnet:...");

// Prepare registration
const { xdr, network } = await client.prepareRegister({
  record: { /* DidRecordInput */ },
  network: "testnet",
  sourcePublicKey: "GXXXXXX...",
});

// Submit signed XDR
const { txId } = await client.submit({ signedXdr: "AAAA..." });
\`\`\`

## Error handling

All SDK errors are instances of \`DidError\` with a stable \`code\` string.

\`\`\`typescript
import { DidError } from "@acta-team/did-stellar";
import type { DidErrorCode } from "@acta-team/did-stellar";

try {
  await resolveDidStellar("invalid-did");
} catch (err) {
  if (DidError.is(err)) {
    console.log(err.code);    // DidErrorCode string
    console.log(err.message); // Human-readable message
    console.log(err.details); // Optional additional context
  }
}
\`\`\`

### Error codes

| Category | Codes |
|----------|-------|
| **DID syntax** | \`did_invalid\`, \`did_id_invalid\`, \`network_invalid\` |
| **Contract registry** | \`did_already_exists\`, \`did_not_found\`, \`version_mismatch\`, \`did_deactivated\`, \`invalid_auth_key_count\`, \`invalid_assertion_key_count\`, \`invalid_key_agreement_count\`, \`invalid_service_count\`, \`duplicate_key\`, \`key_too_long\`, \`key_empty\`, \`service_type_too_long\`, \`service_id_too_long\`, \`service_id_invalid_format\`, \`service_endpoint_invalid\`, \`metadata_uri_invalid\`, \`no_proposed_admin\`, \`service_type_empty\`, \`version_overflow\`, \`metadata_inconsistent\` |
| **Client-side** | \`controller_invalid\`, \`multibase_invalid\`, \`multikey_unsupported\`, \`contract_id_invalid\`, \`rpc_url_invalid\`, \`expected_version_required\` |
| **Proof of Control** | \`challenge_invalid\`, \`challenge_expired\`, \`challenge_nonce_invalid\`, \`challenge_domain_mismatch\`, \`signature_invalid\` |
| **Transport** | \`rpc_error\`, \`tx_simulation_failed\`, \`tx_submission_failed\`, \`http_error\`, \`unknown\` |

## Multikey codec

Encode and decode multibase-encoded public keys.

\`\`\`typescript
import {
  encodeMultikey,
  decodeMultikey,
  detectCurve,
} from "@acta-team/did-stellar";

// Detect curve from multibase string
const curve = detectCurve("z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK");
// => "Ed25519"

// Decode multibase to raw public key
const { curve, publicKey } = decodeMultikey("z6Mk...");
// curve: "Ed25519", publicKey: Uint8Array (32 bytes)

// Encode raw public key to multibase
const multibase = encodeMultikey(publicKey, "Ed25519");
// => "z6Mk..."
\`\`\`

### Multicodec prefixes

| Curve | Prefix bytes | Multibase | Use |
|-------|-------------|-----------|-----|
| Ed25519 | \`0xed 0x01\` | \`z6Mk...\` | authentication, assertionMethod |
| X25519 | \`0xec 0x01\` | \`z6LS...\` | keyAgreement |

## Constants and configuration

\`\`\`typescript
import {
  DEFAULT_RPC_URLS,
  DEFAULT_REGISTRY_CONTRACT_IDS,
  NETWORK_PASSPHRASES,
  DID_RECORD_LIMITS,
} from "@acta-team/did-stellar";

// Default RPC endpoints
DEFAULT_RPC_URLS.mainnet; // "https://mainnet.sorobanrpc.com"
DEFAULT_RPC_URLS.testnet; // "https://soroban-testnet.stellar.org"

// Registry contract IDs
DEFAULT_REGISTRY_CONTRACT_IDS.testnet;
// "CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ"

// Network passphrases
NETWORK_PASSPHRASES.mainnet; // "Public Global Stellar Network ; September 2015"
NETWORK_PASSPHRASES.testnet; // "Test SDF Network ; September 2015"

// Record field limits
DID_RECORD_LIMITS.MIN_KEY_COUNT_AUTH;   // 1
DID_RECORD_LIMITS.MAX_KEY_COUNT_AUTH;   // 3
DID_RECORD_LIMITS.MAX_KEY_COUNT_ASSERT; // 3
DID_RECORD_LIMITS.MAX_KEY_COUNT_AGREEMENT; // 1
DID_RECORD_LIMITS.MAX_SERVICE_COUNT;    // 3
DID_RECORD_LIMITS.MAX_KEY_MULTIBASE_LEN; // 128
DID_RECORD_LIMITS.MAX_SERVICE_ID_LEN;  // 32
DID_RECORD_LIMITS.MAX_SERVICE_TYPE_LEN; // 64
DID_RECORD_LIMITS.MAX_URL_LEN;         // 255
DID_RECORD_LIMITS.METADATA_HASH_LEN;   // 32
\`\`\`
    `,
};
