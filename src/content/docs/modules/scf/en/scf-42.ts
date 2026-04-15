import type { DocPage } from "@/@types/docs";

export const scf42: DocPage = {
  slug: "scf-42",
  title: "SCF 42",
  section: "SCF",
  tocItems: [
    "Overview",
    "Stellar DID Method (v0.1)",
    "Identifier format & network binding",
    "DID Document model",
    "Native key derivation",
    "Proof of control",
    "Deterministic resolution",
    "Reference resolver tooling",
    "Soroban contracts",
    "Testnet API/SDK",
    "ZK milestone (Stellar X-Ray)",
    "ZK overview",
    "Circuit & predicates",
    "Credential & DID binding",
    "Nullifier & replay protection",
    "Verifier contract interface",
    "BN254 host functions",
    "Trusted setup & artifacts",
    "Threat model & limitations",
    "Minimal executable PoC",
  ],
  content: `
# SCF 42

Technical architecture for SCF 42: Stellar DID method, resolver tooling, Soroban contracts for credentials and vaults, and testnet API/SDK.

## Overview

- **Stellar DID Method (v0.1) + resolution tooling** — Specification and open-source resolver so \`did:stellar\` identifiers resolve to DID Documents for Verifiable Credential issuance and verification.
- **Soroban contracts** — Credential lifecycle, encrypted vaults, holder-controlled issuer acceptance, USDC fee tiers, and versioning.
- **Testnet API/SDK** — Stable, versioned testnet release with wallet signing and reproducible end-to-end flows.

## Stellar DID Method (v0.1)

v0.1 scope is single-signature and ecosystem-ready.

### Identifier format & network binding

Normative identifier syntax bound to Stellar networks:

\`\`\`
did:stellar:<network>:<accountId>
\`\`\`

- **<network>**: \`mainnet\` | \`testnet\`
- **<accountId>**: Stellar StrKey public key (G...)

Chain-agnostic account representation (blockchainAccountId-style):

\`\`\`
stellar:mainnet:<G...>   /   stellar:testnet:<G...>
\`\`\`

### Minimum DID Document model (VC-ready)

The v0.1 DID Document includes the minimum verification material for VC flows and follows the [W3C DID Core](https://w3c.github.io/did/#did-document-properties) data model. Required properties: \`id\`, \`verificationMethod\`, \`authentication\`, \`assertionMethod\`.

Example structure for \`did:stellar\` (v0.1, single-sig, Ed25519). This structure may vary in future versions:

\`\`\`json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM",
  "verificationMethod": [{
    "id": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM",
    "publicKeyMultibase": "z6Mk...",
    "blockchainAccountId": "stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM"
  }],
  "authentication": [
    "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller"
  ],
  "assertionMethod": [
    "did:stellar:testnet:GEXAMPLE1234567890ABCDEFGHIJKLM#controller"
  ]
}
\`\`\`

See [DID Document properties (W3C)](https://w3c.github.io/did/#did-document-properties) for the full normative definition.

### Native key derivation from Stellar account state (single-sig only)

The DID Document is built deterministically from on-ledger account configuration:

- \`verificationMethod\` is derived from the account signer (Ed25519 key).
- v0.1 is limited to single-signature accounts (one effective Ed25519 signer).
- Accounts with multisig (multiple signers and/or thresholds) are out of scope and MUST return a typed error (e.g. \`unsupportedAccountConfiguration\`) or be treated as unsupported by policy.
- In v0.1 only Ed25519 keys are exposed as \`verificationMethod\`; other signer types are unsupported or reflected only in metadata.

### Proof of control (issuer/holder)

Standard mechanism for proving control of a \`did:stellar\` identifier via wallet signing:

- **Option A (simple)**: Ed25519 signature over a canonical challenge (nonce + domain + DID + timestamp).
- **Option B (wallet-friendly)**: SEP-10–style challenge signing for existing Stellar wallet flows.

v0.1 defines one option as recommended and keeps the other as a compatible alternative, with canonicalization and anti-replay rules (nonce, domain binding, expiration).

### Deterministic resolution rules (normative)

Resolution is deterministic and uses only public ledger state:

1. Parse and validate the DID (network, StrKey).
2. Fetch account state via Horizon/RPC.
3. Validate v0.1 account constraints (single-sig).
4. Construct the DID Document from: account signer (verification methods), optional ManageData entries under a reserved namespace (services/attributes). Given ManageData size limits, v0.1 stores mainly pointers and short URIs, not large payloads.
5. Return a DID Resolution Result with:
   - \`didDocument\`
   - \`didResolutionMetadata\` (errors: \`invalidDid\`, \`unknownNetwork\`, \`notFound\`, \`unsupportedFormat\`, \`unsupportedAccountConfiguration\`)
   - \`didDocumentMetadata\` (network, ledger info, updated/versioning where available)

### Reference resolver tooling (OSS)

Open-source resolver compatible with the DIF did-resolver interface (JS/TS):

- Multi-network (mainnet/testnet)
- \`did+json\` and \`did+ld+json\`
- SDK utilities: DID parse/normalize, canonical challenge builder/verifier (proof of control), end-to-end examples for issuers and verifiers in VC flows.

The draft is developed with advisory input from a contributor active in W3C identity standardization (DID Core / DID Resolution alignment).

## Soroban contracts (credentials + encrypted vaults)

Soroban (Rust) contracts provide a clear, production-oriented surface on testnet:

- **Credential lifecycle**: Issue, verify, revoke; on-chain anchoring and status checks, including revocation state.
- **Encrypted vaults**: Per-holder vault operations (store/list/get), controlled credential sharing and transfer where applicable.
- **Holder-controlled issuer acceptance** (permissionless, anti-spam): ACTA does not gate who can issue on Stellar; per-holder issuer controls are enforced at the vault layer:
  - **Required**: Per-holder issuer blocklist enforced on vault write (writes from blocked issuers fail deterministically).
  - **Configurable default**: Vault policy supports a default “accept-all” mode with an extensible path to stricter modes.
- **USDC-denominated fee tiers**: On-chain fee logic in USDC (tier configuration and enforcement), with clear payer and collection semantics.
- **Versioning & deployment**: Published contract IDs, interface documentation, and a clear upgrade/version strategy for testnet.

## Testnet API/SDK

The testnet API/SDK (issuance and on-chain verification) is hardened into a stable, versioned release:

- **API/SDK stability**: Versioning, consistent error handling, and documented request/response contracts.
- **Wallet signing**: Freighter (and WalletConnect where applicable); transactions are prepared server-side and signed client-side.
- **Reproducible demo**: Documented, scriptable end-to-end flow: issuer prepares issuance transaction (XDR), signs via wallet, credential is anchored on-chain, holder stores or uses it via vault, verifier performs on-chain verification (including status and revocation checks), with transaction links for every step.

## ZK milestone (Stellar X-Ray / Protocol 25)

The ZK work delivers a fully specified **selective disclosure** component plus a **minimal executable proof of concept** for privacy‑preserving on‑chain verification on Stellar using Stellar X-Ray (Protocol 25) BN254 primitives. This section expands the Tranche 3 ZK scope for SCF reviewers.

### ZK overview

- **Curve**: BN254 (as exposed by Stellar X-Ray / Protocol 25).
- **Proof system**: Groth16 zk‑SNARK.
- **Host functions used**:
  - \`bn254_g1_mul\`
  - \`bn254_g1_add\`
  - \`bn254_multi_pairing_check\`
  - Poseidon hash host functions (for nullifier derivation, where applicable).
- **On‑chain verifier**: Soroban contract (\`zk_verifier\`) deployed on a Protocol 25+ network (testnet and mainnet for the PoC).
- **Off‑chain tooling**: BN254‑compatible prover stack (e.g. circom + snarkjs or equivalent) that compiles circuits, generates proving/verification keys, and produces Groth16 proofs compatible with the on‑chain encoding.

### Circuit and predicate specification

We implement a concrete, auditable predicate such as:

- **Predicate A (age check)**: “holder is at least 18 years old”, or
- **Predicate B (non‑expired credential)**: “credential has not expired at reference time”.

The chosen predicate is fixed and documented in the PoC.

#### Inputs

- **Private inputs** (known only to holder/prover):
  - \`dob\`: date of birth encoded as an integer (e.g. Unix timestamp or YYYYMMDD).
  - \`salt\`: random salt used in attribute hashing.
  - \`credential_secret_fields\`: additional secret fields that bind the proof to a specific ACTA credential.
- **Public inputs**:
  - \`cred_hash\`: hash of the credential (or selected fields) as stored/referenced in ACTA.
  - Predicate parameters (e.g. \`age_threshold = 18\`).
  - \`nullifier\`: public nullifier derived from private and public values (see below).
  - Optional \`holder_binding\`: representation of the holder’s DID or \`blockchainAccountId\`.

#### Circuit logic (example “age ≥ 18”)

1. Recompute a **binding hash** from private fields and salt:
   - \`h_internal = H(dob || salt || credential_secret_fields)\`
2. Combine with public metadata (issuer, schema, etc.) to recompute \`cred_hash\`:
   - \`cred_hash' = H(h_internal || public_metadata)\`
3. Enforce \`cred_hash' == cred_hash\` (binding proof to a specific credential).
4. Derive age or compare dates to enforce the predicate (e.g. \`age >= 18\` or “dob is at least 18 years before a cut‑off date”).
5. Optionally derive or validate the **nullifier** inside the circuit to align with on‑chain checks.

The circuit clearly documents private vs public variables, hashing strategy, and predicate semantics. Circuit source (e.g. \`.circom\`) and compiled artifacts are versioned and published.

### Credential and DID binding

ACTA credentials are linked to holders via \`did:stellar:<network>:<accountId>\`. The ZK proof must be:

- **Bound to a specific credential**, so it cannot be reused with a different credential body.
- **Bound to a specific holder**, to prevent “proof lending”.

We achieve this via:

- **Credential hash** (\`cred_hash\`):
  - Computed from canonical credential data (issuer DID, holder DID, schema ID, and the private attribute + salt).
  - The same structure is logically reproduced inside the circuit using field‑friendly hashes.
- **Holder binding**:
  - Include a representation of the holder’s DID or \`blockchainAccountId\` (e.g. \`stellar:mainnet:G...\`) in:
    - Credential hash computation.
    - Nullifier derivation.

This prevents reusing a proof for a different credential or a different holder without regenerating the proof.

### Nullifier and replay protection

#### Goals

- **Replay protection** — avoid accepting the same proof (or logical use) multiple times where the application requires one‑time usage.
- **Auditability** — record that a given nullifier has been consumed.

#### Nullifier construction

We derive the nullifier using Poseidon host functions so off‑chain and on‑chain derivations match exactly. Example:

\`\`\`text
nullifier = Poseidon(
  cred_hash
  || predicate_id
  || holder_binding
  || context
)
\`\`\`

Where:

- \`cred_hash\`: binds to the credential.
- \`predicate_id\`: distinguishes different circuits/predicates (e.g. \`"isAdult"\` vs \`"notExpired"\`).
- \`holder_binding\`: binds to the holder (e.g. hash of \`did:stellar:...\` or \`blockchainAccountId\`).
- \`context\`: optional domain separator (application/use‑case ID).

The design document specifies encoding, field mapping, and whether the nullifier is recomputed in the circuit, in the contract, or both.

#### On‑chain handling

The verifier contract:

- Receives \`nullifier\` as a public input.
- Before accepting a proof:
  - Checks if \`nullifier\` is already stored; if so, returns an error (e.g. \`NullifierUsed\`).
  - Otherwise, proceeds with Groth16 verification.
- On success:
  - Stores \`nullifier\` in contract state.
  - Emits an event including \`nullifier\`, \`predicate_id\`, and the outcome.

### Verifier contract interface

The Soroban verifier exposes a minimal, versioned function, for example:

\`\`\`text
fn verify_proof(
  circuit_id: String,      // e.g. "isAdult"
  proof: Bytes,            // serialized Groth16 proof (A, B, C)
  public_inputs: Bytes,    // encoded BN254 field elements
  nullifier: Bytes         // field element used for replay protection
) -> Result<VerificationResult, VerificationError>
\`\`\`

- \`circuit_id\` maps to a specific verification key and expected public input layout.
- \`proof\` encodes G1/G2 points \`A, B, C\` using a documented format compatible with the prover.
- \`public_inputs\` is a concatenation of field elements in a fixed order (e.g. \`[cred_hash, age_threshold, nullifier, holder_binding]\`).
- \`nullifier\` is also passed separately for indexing/replay checks.

The contract returns a structured result and emits events so verifications can be indexed on‑chain. Error variants include \`InvalidProof\`, \`NullifierUsed\`, \`InvalidInputs\`, \`UnsupportedCircuit\`.

### BN254 host functions (on‑chain Groth16 verification)

The on‑chain verifier:

- Uses \`bn254_g1_mul\` and \`bn254_g1_add\` to reconstruct \`vk_x\` from the verification key and public inputs.
- Uses \`bn254_multi_pairing_check\` to evaluate:

  > **e(−A,B) · e(α,β) · e(vkₓ,γ) · e(C,δ) = 1**

No pairing or curve arithmetic is implemented in Rust; all elliptic‑curve operations come from X-Ray host functions. Poseidon host functions are used, where applicable, to derive or check the nullifier.

### Trusted setup and artifact management

Because Groth16 requires a trusted setup, we:

- Define circuits in a public repository (e.g. \`isAdult.circom\`).
- Run a documented ceremony (or reuse a compatible multi‑party ceremony) to generate:
  - Proving key.
  - Verification key.
- Publish:
  - Circuit source and version (e.g. Git commit hash).
  - Hashes of proving and verification keys.
  - Exact encoding of verification key constants used on‑chain.

On‑chain, the contract embeds or references the VK for each supported \`circuit_id\` and maps \`circuit_id -> vk_id\` as needed.

### Threat model and limitations

We explicitly state:

- **Protected**:
  - Private attributes (DOB, expiration) are never revealed on‑chain.
  - Verifiers only see predicate outcomes and public inputs (e.g. credential hash, nullifier).
  - Replay is prevented through the nullifier mechanism.
- **Out of scope**:
  - Network‑level metadata (IP, timing) and cross‑application correlation.
  - Malicious issuers embedding PII in public credential fields.
  - Side‑channel attacks against off‑chain prover environments.
- **Dependencies**:
  - Correctness and security of Stellar’s BN254/Poseidon host functions and the chosen Groth16 stack.

We also set upper bounds for circuit size, number of public inputs, and expected verification cost.

### Minimal executable PoC

The minimal PoC demonstrates, reproducibly:

- **Credential and claim** — A holder owns an ACTA credential (issued and stored via ACTA) with a **private attribute** (e.g. exact DOB or expiration timestamp).
- **Selective disclosure and proof generation** — The holder reveals only what is necessary (e.g. “I am over 18” or “this credential has not expired”) and generates a **ZK proof** using a BN254‑compatible circuit, producing a Groth16 proof and BN254‑compatible public inputs plus a nullifier.
- **On‑chain verification** — A transaction sends \`circuit_id\`, \`proof\`, \`public_inputs\`, and \`nullifier\` to the Soroban verifier contract. The contract reconstructs \`vk_x\`, calls \`bn254_multi_pairing_check\`, checks/stores the nullifier, and records success via state and events.
- **Observable outcome** — A third party can verify **on‑chain** that a valid proof was verified, **without** the verifier or the chain learning the underlying PII. Documentation includes network/protocol version, contract ID, and CLI/SDK commands to reproduce the full flow.
    `,
};
