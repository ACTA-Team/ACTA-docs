import type { DocPage } from "@/@types/docs";

export const didStellarProofOfControl: DocPage = {
  slug: "did-stellar-proof-of-control",
  title: "Proof of Control",
  section: "DID:Stellar",
  tocItems: [
    "How it works",
    "Build a challenge",
    "Verify a proof",
    "Nonce management",
    "Timestamp window",
    "JCS canonicalization",
  ],
  content: `
# Proof of Control

Proof of Control (PoC) is a challenge-response protocol that proves a party controls an authentication key listed in a \`did:stellar\` DID Document. It uses Ed25519 signatures over JCS-canonicalized (RFC 8785) challenges.

## How it works

1. **Verifier** builds a challenge with the target DID, domain, nonce, and timestamp
2. **Prover** canonicalizes the challenge using JCS and signs with an Ed25519 authentication key
3. **Verifier** resolves the DID Document and verifies the signature against listed authentication keys

## Build a challenge

\`\`\`typescript
import { buildChallenge, generateNonce } from "@acta-team/did-stellar";

const challenge = buildChallenge({
  did: "did:stellar:testnet:aaaqeayeaudaocajbifqydiob4",
  domain: "example.com",
  nonce: generateNonce(), // 16 bytes CSPRNG as 32 hex chars
  timestamp: new Date().toISOString(), // optional, defaults to now
});
\`\`\`

### Challenge shape

\`\`\`typescript
interface PoCChallenge {
  did: string;       // The target DID
  domain: string;    // Domain requesting proof
  nonce: string;     // 32 lowercase hex chars (16 bytes)
  timestamp: string; // ISO 8601 UTC
}
\`\`\`

## Verify a proof

\`\`\`typescript
import { verifyProofOfControl, resolveDidStellar } from "@acta-team/did-stellar";

const { didDocument } = await resolveDidStellar(challenge.did);

const result = await verifyProofOfControl({
  challenge,
  signature: "base64url-encoded-signature", // base64url without padding
  didDocument: didDocument!,
  expectedDomain: "example.com",
  // Optional: nonce freshness check
  isNonceFresh: (nonce, did) => {
    // Return true if this nonce hasn't been used before
    return !usedNonces.has(nonce);
  },
  // Optional: timestamp tolerance (default: 5 minutes)
  timestampWindowMs: 5 * 60 * 1000,
});

if (result.valid) {
  console.log("Verified! Key:", result.matchedKeyId);
  // e.g., "did:stellar:testnet:aaaq...#auth-1"
} else {
  console.log("Failed:", result.reason);
  // result.reason is a DidError with a specific code
}
\`\`\`

### Verification result

\`\`\`typescript
interface VerifyProofOfControlResult {
  valid: boolean;
  reason?: DidError;      // Present when valid is false
  matchedKeyId?: string;  // Fragment of the key that signed (e.g., "#auth-1")
}
\`\`\`

## Nonce management

Nonces prevent replay attacks. The SDK generates cryptographically secure nonces but does **not** enforce deduplication - that is the caller's responsibility.

\`\`\`typescript
import { generateNonce } from "@acta-team/did-stellar";

const nonce = generateNonce();
// => "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6" (32 hex chars, 16 bytes)
\`\`\`

Use the \`isNonceFresh\` callback in \`verifyProofOfControl\` to check against your nonce store.

## Timestamp window

The default timestamp window is **5 minutes** (\`DEFAULT_TIMESTAMP_WINDOW_MS = 300_000\`). Challenges outside this window are rejected.

You can customize it:

\`\`\`typescript
const result = await verifyProofOfControl({
  // ...
  timestampWindowMs: 10 * 60 * 1000, // 10 minutes
});
\`\`\`

## JCS canonicalization

The challenge is canonicalized using JCS (RFC 8785) before signing. The SDK exposes the canonicalization utilities:

\`\`\`typescript
import { jcsCanonicalize, jcsStringify } from "@acta-team/did-stellar";

// Get canonical bytes for signing
const bytes = jcsCanonicalize(challenge); // Uint8Array

// Get canonical JSON string
const json = jcsStringify(challenge); // string
\`\`\`
    `,
};
