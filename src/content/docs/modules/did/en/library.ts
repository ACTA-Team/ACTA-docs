import type { DocPage } from "@/@types/docs";

export const library: DocPage = {
  slug: "did-library",
  title: "TypeScript Library",
  section: "DID",
  tocItems: [
    "Install",
    "What's inside",
    "Register a DID",
    "Resolve a DID",
    "React hook (useDid)",
    "HTTP client (ActaDidClient)",
    "Proof of Control",
    "Validation & errors",
    "Relationship to the Credentials SDK",
  ],
  content: `
# TypeScript Library

**\`@acta-team/did-stellar\`** is the official TypeScript library for the did:stellar method: identifier helpers, W3C resolution, record validation, prepare/submit transaction building, Proof of Control, an HTTP client for \`did.acta.build\`, and a React hook.

## Install

\`\`\`bash
npm install @acta-team/did-stellar
\`\`\`

- Dual **ESM + CJS** build with TypeScript declarations.
- Subpath exports: \`@acta-team/did-stellar/resolver\` (resolution only, smaller bundle) and \`@acta-team/did-stellar/hooks\` (React).
- React is an **optional** peer dependency (only needed for the hook).
- Works against the public defaults out of the box: Stellar RPC URLs and registry contract ids for both networks are built in.

## What's inside

| Area | Key exports |
|------|-------------|
| Identifier | \`generateDidId\`, \`buildDidStellar\`, \`parseDidStellar\`, \`isValidDidStellar\`, \`DID_STELLAR_REGEX\` |
| Resolution | \`resolveDidStellar\`, \`getResolver\` (DIF \`did-resolver\` driver) |
| Record | \`validateDidRecordInput\`, \`readDidRecord\`, \`DID_RECORD_LIMITS\`, types \`DidRecord\`, \`DidKey\`, \`DidService\` |
| Keys | \`encodeMultikey\`, \`decodeMultikey\`, \`detectCurve\` (Ed25519 / X25519) |
| Transactions | \`prepareRegisterDidXdr\`, \`prepareUpdateDidXdr\`, \`prepareTransferControllerXdr\`, \`prepareDeactivateDidXdr\`, \`submitSignedXdr\` |
| Proof of Control | \`buildChallenge\`, \`generateNonce\`, \`jcsCanonicalize\`, \`verifyProofOfControl\` |
| HTTP client | \`ActaDidClient\` (wraps did.acta.build) |
| React | \`useDid()\` hook |
| Errors | \`DidError\` with stable \`code\` strings |

## Register a DID

The canonical self-service flow: generate keys, prepare the XDR, sign with the controller wallet, submit.

\`\`\`ts
import {
  generateDidId,
  buildDidStellar,
  encodeMultikey,
  prepareRegisterDidXdr,
  submitSignedXdr,
} from "@acta-team/did-stellar";
import * as ed from "@noble/ed25519";

// 1. Generate an Ed25519 key for the DID
const privateKey = ed.utils.randomPrivateKey();
const publicKey = await ed.getPublicKeyAsync(privateKey);
const publicKeyMultibase = encodeMultikey("Ed25519", publicKey);

// 2. Mint the DID and prepare the registration transaction
const did = buildDidStellar("testnet", generateDidId());
const prepared = await prepareRegisterDidXdr({
  did,
  sourcePublicKey: "G...", // the controller wallet
  record: {
    controller: "G...",
    authentication: [{ publicKeyMultibase }],
    assertionMethod: [{ publicKeyMultibase }], // issuers need this
    keyAgreement: [],
    services: [],
  },
});

// 3. Sign with your wallet, then submit
const signedXdr = await signTransaction(prepared.xdr, {
  networkPassphrase: prepared.networkPassphrase,
});
const { txId } = await submitSignedXdr({ signedXdr, network: "testnet" });
\`\`\`

The controller wallet signs the **transaction**; the Ed25519 key goes **inside the record** and is what later signs credentials. Issuers must include at least one \`assertionMethod\` key.

\`update\`, \`transfer\` and \`deactivate\` follow the same shape with their \`prepare*Xdr\` counterparts plus \`expectedVersion\`.

## Resolve a DID

\`\`\`ts
import { resolveDidStellar } from "@acta-team/did-stellar/resolver";

const result = await resolveDidStellar(
  "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi"
);
// result.didDocument, result.didDocumentMetadata, result.didResolutionMetadata
\`\`\`

For ecosystems built on the DIF \`did-resolver\` package:

\`\`\`ts
import { Resolver } from "did-resolver";
import { getResolver } from "@acta-team/did-stellar/resolver";

const resolver = new Resolver({ ...getResolver() });
const result = await resolver.resolve("did:stellar:mainnet:...");
\`\`\`

Both accept overrides for \`rpcUrl\` and \`registryContractId\` per network.

## React hook (useDid)

\`\`\`ts
import { useDid } from "@acta-team/did-stellar/hooks";

const { register, update, transfer, deactivate, resolve, getRecord } =
  useDid();

const { txId } = await register({
  did,
  sourcePublicKey: "G...",
  record,
  sign: async (xdr, { networkPassphrase }) => {
    // any Stellar wallet: Freighter, Albedo, WalletConnect...
    return signedXdr;
  },
});
\`\`\`

Each mutation takes the prepare arguments plus a wallet-agnostic \`sign\` callback and returns \`{ txId }\`.

## HTTP client (ActaDidClient)

A thin client for the hosted resolver, useful when you prefer HTTP over direct RPC:

\`\`\`ts
import { ActaDidClient } from "@acta-team/did-stellar";

const client = new ActaDidClient({ baseUrl: "https://did.acta.build" });

const resolution = await client.resolve(did);
const record = await client.getDidRecord(did);
const prepared = await client.prepareRegister({
  record,
  network: "testnet",
  sourcePublicKey: "G...",
});
const { txId } = await client.submit({ signedXdr });
\`\`\`

## Proof of Control

Verify that a party controls a DID (e.g. DID login) without any transaction:

\`\`\`ts
import {
  buildChallenge,
  generateNonce,
  verifyProofOfControl,
} from "@acta-team/did-stellar";

// Verifier side
const challenge = buildChallenge({
  did,
  domain: "myapp.com",
  nonce: generateNonce(),
});

// ...the signer canonicalizes (JCS) and signs with an authentication key...

const result = await verifyProofOfControl({
  challenge,
  signature,
  isNonceFresh: async nonce => myNonceStore.checkAndBurn(nonce),
});
// result: { valid, reason?, matchedKeyId? }
\`\`\`

Checks run in spec order: timestamp within a 5-minute window, domain match, nonce freshness (pluggable store), then the Ed25519 signature against every \`authentication\` key.

## Validation & errors

- \`validateDidRecordInput(record)\` mirrors the contract's validation rule-for-rule, so you can fail fast **before** any network call.
- Every failure is a \`DidError\` with a stable \`code\` (\`did_invalid\`, \`did_already_exists\`, \`version_mismatch\`, \`did_deactivated\`, \`multikey_unsupported\`, \`tx_submission_failed\`, ...), the same codes the resolver API returns. Branch on \`code\`, never on \`message\`.

## Relationship to the Credentials SDK

- **\`@acta-team/credentials\` builds on this library** for issuer auto-onboarding: the first \`issue\` call without \`issuerDid\` generates an Ed25519 key, registers a did:stellar (same key in \`authentication\` and \`assertionMethod\`) with one wallet signature, and persists the identity. See **[Credentials SDK](doc:sdk-overview)**.
- Use \`@acta-team/did-stellar\` directly when you need full control over keys, records, services, key rotation, or DID login.
- The ACTA credentials API deliberately does **not** import this library: identity and credentials are separate trust domains.
    `,
};
