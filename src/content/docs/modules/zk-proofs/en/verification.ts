import type { DocPage } from "@/@types/docs";

export const verification: DocPage = {
  slug: "zk-verification",
  title: "Proof Verification",
  section: "Zero-Knowledge Proofs",
  tocItems: [
    "Overview",
    "On-Chain Verification",
    "Verification Process",
    "Nullifiers and Replay Protection",
    "Verification Result",
    "API Endpoint",
  ],
  content: `
# ZK Proof Verification

ZK proofs in ACTA are verified on-chain via Soroban smart contracts using Protocol 25 ZK verification support.

## Overview

Unlike proof generation (which is client-side), verification happens on-chain:
- **Location**: Soroban ZK verifier contract
- **Method**: Protocol 25 ZK verification
- **Security**: Cryptographic verification with replay protection
- **Trust**: No need to trust third parties

### Why On-Chain Verification?

- **Immutability** - Verification results are permanently recorded
- **Trustless** - No need to trust verification servers
- **Transparency** - Verification logic is on-chain
- **Replay Protection** - Nullifiers prevent proof reuse

## On-Chain Verification

Verification is performed by the Soroban ZK verifier contract:

1. **Contract Receives**:
   - Circuit ID (identifies which circuit to use)
   - Proof (the cryptographic proof)
   - Public inputs (public signals)
   - Nullifier (for replay protection)

2. **Contract Verifies**:
   - Loads verification key (vk) for the circuit
   - Verifies the proof cryptographically
   - Checks nullifier hasn't been used before
   - Records verification result on-chain

3. **Result**:
   - Transaction hash
   - Ledger number
   - Verification status (verified/not verified)

## Verification Process

### Step 1: Prepare Verification Payload

From the shared credential link, extract:

\`\`\`typescript
{
  statement: {
    kind: 'isAdult' | 'notExpired' | 'isValid',
    // ... other metadata
  },
  proof: string,              // Base64 encoded proof
  publicSignals: string[],    // Public inputs
  commitment: string,          // Credential commitment
  nonce: string,              // Nonce for nullifier
  credentialId: string,       // Credential identifier
  verifierContractId?: string // Optional contract override
}
\`\`\`

### Step 2: Generate Nullifier

Nullifier prevents replay attacks by making each proof unique:

\`\`\`typescript
// Nullifier = hash(commitment + nonce + proof_hash)
const nullifier = await generateNullifier({
  commitment,
  nonce,
  proof
});
\`\`\`

### Step 3: Call Verification API

Send verification request to ACTA API:

\`\`\`bash
POST /contracts/zk-verifier/verify
\`\`\`

**Request Body:**

\`\`\`json
{
  "circuitId": "isAdult",
  "proof": "base64_proof",
  "publicInputs": ["..."],
  "nullifier": "hex_nullifier",
  "verifierContractId": "C..."
}
\`\`\`

### Step 4: On-Chain Verification

The API:
1. Invokes the Soroban ZK verifier contract
2. Contract verifies the proof using stored verification key
3. Checks nullifier hasn't been used
4. Records verification on-chain
5. Returns transaction hash and result

### Step 5: Verification Result

**Response:**

\`\`\`json
{
  "verified": true,
  "txHash": "abc123...",
  "ledger": 12345,
  "network": "testnet"
}
\`\`\`

## Nullifiers and Replay Protection

Nullifiers ensure each proof can only be verified once, preventing replay attacks.

### How Nullifiers Work

1. **Generate Nullifier**:
   \`\`\`
   nullifier = SHA-256(commitment + nonce + proof_hash)
   \`\`\`

2. **Check on-Chain**:
   - Contract maintains a set of used nullifiers
   - If nullifier exists → proof already used → reject
   - If nullifier doesn't exist → add to set → verify proof

3. **Uniqueness**:
   - Each proof instance has unique commitment + nonce
   - Even same credential + predicate = different nullifier
   - Prevents proof reuse

### Benefits

- **Replay Protection** - Same proof can't be verified twice
- **Privacy** - Nullifier doesn't reveal credential content
- **Efficiency** - Simple hash check on-chain

## Verification Result

### Success Response

\`\`\`json
{
  "verified": true,
  "txHash": "transaction_hash",
  "ledger": 12345,
  "network": "testnet",
  "result": { ... }
}
\`\`\`

### Failure Response

\`\`\`json
{
  "verified": false,
  "error": "error_message",
  "network": "testnet"
}
\`\`\`

### Common Errors

- \`Invalid payload\` - Missing required fields
- \`No proof to verify\` - Predicate kind is 'none'
- \`Missing commitment\` - Commitment not provided
- \`Missing nonce\` - Nonce not provided
- \`Invalid proof format\` - Proof structure is invalid
- \`Proof verification failed\` - Cryptographic verification failed
- \`Nullifier already used\` - Proof was already verified

## API Endpoint

### POST /contracts/zk-verifier/verify

Verifies a ZK proof on-chain via Soroban contract.

**Headers:**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Request Body:**

\`\`\`json
{
  "circuitId": "isAdult",
  "proof": "base64_encoded_proof",
  "publicInputs": ["public_signal_1", "public_signal_2"],
  "nullifier": "hex_nullifier_string",
  "verifierContractId": "C..."
}
\`\`\`

**Response:**

\`\`\`json
{
  "verified": true,
  "txHash": "abc123...",
  "ledger": 12345,
  "result": {},
  "network": "testnet"
}
\`\`\`

**Example:**

\`\`\`bash
curl -X POST https://acta.build/api/testnet/contracts/zk-verifier/verify \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "circuitId": "isAdult",
    "proof": "...",
    "publicInputs": [],
    "nullifier": "..."
  }'
\`\`\`

### Parameters

- **circuitId** (required): Circuit identifier (\`"isAdult"\`, \`"notExpired"\`, \`"isValid"\`)
- **proof** (required): Base64 encoded proof
- **publicInputs** (required): Array of public input strings
- **nullifier** (required): Hex-encoded nullifier for replay protection
- **verifierContractId** (optional): Override verifier contract ID
    `,
};
