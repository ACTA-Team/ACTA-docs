import type { DocPage } from "@/@types/docs";

export const verifyCredentials: DocPage = {
  slug: "verify-credentials",
  title: "Verifying Credentials",
  section: "Guides",
  tocItems: [
    "Three ways to verify",
    "1. The share link (no tools needed)",
    "2. The API",
    "3. The SDK",
    "What each status means",
    "What verification proves",
    "Verifying the issuer's identity",
  ],
  content: `
# Verifying Credentials

You received an ACTA credential (a link, a QR code, or just an owner address and a credential id) and want to know if it is genuine and still valid. There are three ways, from zero-tooling to fully programmatic.

## Three ways to verify

| Method | For | Requires |
|--------|-----|----------|
| Share link / QR | Anyone | Nothing, just a browser |
| \`POST /contracts/vault/verify-vc\` | Developers | An API key (any role) |
| SDK \`verifyVc\` | React apps | \`@acta-team/credentials\` |

## 1. The share link (no tools needed)

When a holder shares a credential from the dApp, the link (or its QR code) opens a **public verification page** on \`dapp.acta.build\`. No wallet, no account:

- The page shows **only the fields the holder chose to reveal**.
- The credential **status is always re-checked on-chain** when the page loads, never taken from the shared payload: a credential revoked after the link was created shows as revoked.
- The revealed fields themselves come from the holder's share, so the page labels them as a shared view; the on-chain part is the status.
- Share links **expire** (7 days by default), so an old link stops working.

## 2. The API

\`verify-vc\` is intentionally open to **any valid API key**, with no ownership check, precisely so third parties can verify credentials they do not own. It returns only the status, never the contents.

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "owner": "G...", "vcId": "credential-123" }'
\`\`\`

\`\`\`json
{ "status": "valid", "since": "2026-01-01T00:00:00.000Z" }
\`\`\`

You need the **owner** address (whose vault holds the credential) and the **vcId**. Use the mainnet base URL for mainnet credentials.

## 3. The SDK

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { verifyVc } = useVaultRead();
const result = await verifyVc({ owner: "G...", vcId: "credential-123" });
// { status: "valid" | "revoked", since?: string }
\`\`\`

## What each status means

| Status | Meaning |
|--------|---------|
| \`valid\` | The credential exists in the owner's vault and has not been revoked |
| \`revoked\` | It was revoked by the vault owner; \`since\` carries the revocation date |
| \`invalid\` | The contract reports it as not valid |
| \`unknown\` | The contract returned an unexpected shape (rare fallback) |

## What verification proves

Be precise about what an on-chain status check does and does not prove:

- **It proves**: a credential with that id exists in that owner's vault on the Stellar network, and its current lifecycle status (valid or revoked with a date).
- **It does not prove by itself**: *who* issued it. Issuance into a vault is open by default (deny-by-exception), so trusting a credential also means checking that its **issuer** is who you expect.

## Verifying the issuer's identity

Each credential stores its issuer's \`did:stellar\`. To check the issuer:

1. Resolve the issuer DID at the public resolver, no auth required:

\`\`\`bash
curl https://did.acta.build/1.0/identifiers/did:stellar:mainnet:...
\`\`\`

2. The resolution result exposes the controller wallet (\`didDocumentMetadata.method.stellarAccount\`) and the issuer's public keys. A deactivated DID resolves with HTTP \`410\`.
3. The ACTA API already enforces, at issuance time, that the DID's on-chain controller equals the wallet that signed the issue transaction.

See the **[DID section](doc:did-overview)** for how issuer identity works end to end, and **[Security & Data Model](doc:security)** for the broader trust model.
    `,
};
