import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "zk-overview",
  title: "Overview",
  section: "Zero-Knowledge Proofs",
  tocItems: [
    "What are Zero-Knowledge Proofs?",
    "How ZK Proofs Work in ACTA",
    "Key Benefits",
    "Architecture",
  ],
  content: `
# Zero-Knowledge Proofs Overview

ACTA supports zero-knowledge proofs (ZK) that allow you to prove credential predicates without revealing private data. This enables privacy-preserving credential sharing and verification.

## What are Zero-Knowledge Proofs?

Zero-knowledge proofs are cryptographic protocols that allow one party (the prover) to prove to another party (the verifier) that a statement is true without revealing any information beyond the validity of the statement itself.

In the context of ACTA:
- **Prover**: The credential holder who wants to prove something about their credential
- **Verifier**: The party who needs to verify the proof (e.g., a service requiring age verification)
- **Statement**: A predicate about the credential (e.g., "age ≥ 18", "not expired", "status is valid")

## How ZK Proofs Work in ACTA

1. **Credential Holder** selects which fields to reveal and chooses a predicate to prove
2. **Proof Generation** happens client-side using Noir circuits and bb.js
3. **Share Link** is created containing the revealed fields and the ZK proof
4. **Verification** happens on-chain via Soroban smart contracts (Protocol 25)

### Generation vs Verification

- **Generation**: Client-side in the browser using Noir and bb.js
- **Verification**: On-chain via Soroban ZK verifier contract
- **Replay Protection**: Uses nullifiers to prevent proof reuse

## Key Benefits

### Privacy

- Only selected fields are revealed to verifiers
- Private data (like exact age or expiration date) remains hidden
- Selective disclosure gives you control over what information to share

### Security

- Cryptographic proofs are mathematically verifiable
- No need to trust a third party
- On-chain verification ensures proof integrity
- Nullifiers prevent replay attacks

### Flexibility

- Multiple predicate types available
- Can combine with selective field disclosure
- Works with any credential structure

## Architecture

### Components

1. **Noir Circuits** - Define the logic for each predicate
   - Written in Noir language
   - Compiled to ACIR (Abstract Circuit Intermediate Representation)
   - Served as JSON files from the dApp

2. **Proof Generation** - Client-side using:
   - \`@noir-lang/noir_js\` - Noir JavaScript bindings
   - \`@aztec/bb.js\` - Barretenberg backend for proof generation

3. **Proof Verification** - On-chain via:
   - Soroban ZK verifier contract
   - Protocol 25 support for ZK verification
   - Verification keys (vk) stored in contract

### Flow

![Client Flow](/client-flow.png)

![Verifier Flow](/verifier-flow.png)

See the [Circuits](#zk-circuits) section for detailed information about available predicates and their implementation.
    `,
};
