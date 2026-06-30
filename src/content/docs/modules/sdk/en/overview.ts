import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "sdk-overview",
  title: "Overview",
  section: "Credentials SDK",
  tocItems: [
    "Install",
    "Single-tenant vaults (v0.4.0)",
    "Exports",
    "Provider (ActaConfig)",
    "Environment variables",
    "Accessing the client",
    "Hooks summary",
    "sponsoredVault",
  ],
  content: `
# Credentials SDK Overview

Production package: **\`@acta-team/credentials\`** (install with npm / pnpm / yarn). Older references to **\`@acta-team/acta-sdk\`** point at the same surface: React **\`ActaConfig\`** mounts an **\`ActaClient\`** in context, exposed through **\`useActaClient()\`**, plus hooks for vault reads/writes and credential issuance/revocation. The network comes from **\`baseURL\`** (\`mainNet\` vs \`testNet\`).

## Single-tenant vaults (v0.4.0)

Each owner has their **own** \`vc-vault\`, deployed deterministically by a **\`vc-vault-factory\`**. The SDK derives the owner's vault from \`(factory, owner, userSalt)\`, so you pass **\`owner\`** rather than a vault contract id.

- The optional **\`userSalt\`** (32-byte hex, default all-zero) selects which of an owner's vaults to target; most apps never set it.
- **Issuance is open by default** (deny-by-exception): owners **block** issuers with \`denyIssuer\` and **unblock** them with \`allowIssuer\` (the old authorize/revoke allow-list is gone, though \`authorizeIssuer\`/\`revokeIssuer\` remain as aliases).
- The issuer must control a **registered, resolvable \`did:stellar\`**; the SDK can auto-onboard one via \`getOrCreateIssuerIdentity\` (see \`useCredential\`). Bare wallet addresses / \`did:pkh\` are no longer accepted as the issuer DID.
- **Fees** are charged on-chain at issuance (default 1 USDC/credential paid by the issuer); there is no SDK fee override.

## Install

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

## Exports

- **\`ActaConfig\`**: Provider - required \`baseURL\`; optional explicit \`apiKey\`.
- **\`useActaClient\`**: Returns the contextual \`ActaClient\` (must be rendered under \`ActaConfig\`).
- **Hooks**: \`useVault\`, \`useCredential\`, \`useVaultRead\`.
- **\`ActaClient\`**: \`sponsoredVaultCreate\` for the public sponsored-vault **create** flow (prepare/submit); see **sponsoredVault**.
- **URLs**: \`mainNet\`, \`testNet\` (string constants typed as the \`baseURL\` literal union for the two API hosts).

## Provider (\`ActaConfig\`)

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/credentials";

export function App() {
  return (
    <ActaConfig baseURL={mainNet}>
      {/* your app */}
    </ActaConfig>
  );
}
\`\`\`

Pass **\`apiKey\`** to the provider if you do not want to rely on env-based resolution.

## Environment variables

The library resolves an API key in this order unless you pass \`apiKey\` on \`ActaConfig\`:

- Network-specific: \`ACTA_API_KEY_MAINNET\`, \`ACTA_API_KEY_TESTNET\`
- Fallback for either network: \`ACTA_API_KEY\`

The key is attached as header **\`X-ACTA-Key\`** on outbound requests.

## Accessing the client

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient();
const config = await client.getConfig();
// ConfigResponse: { rpcUrl, networkPassphrase, networkType,
//   factoryContractId, vaultWasmHash, didStellarRegistryId, actaContractId }
\`\`\`

The \`ConfigResponse\` now exposes \`networkType\`, \`factoryContractId\`, \`vaultWasmHash\`, and \`didStellarRegistryId\`; \`actaContractId\` remains as a back-compat alias of \`factoryContractId\`.

## Hooks summary

- **\`useVault\`** - \`createVault\` (optional \`userSalt\`), \`denyIssuer\`, \`allowIssuer\` (\`authorizeIssuer\`/\`revokeIssuer\` kept as aliases).
- **\`useCredential\`** - \`issue\` (optional \`userSalt\`), \`revoke\` (sends \`owner\`).
- **\`useVaultRead\`** - \`listVcIds\`, \`getVc\`, \`verifyVc\`.

## sponsoredVault

\`ActaClient.sponsoredVaultCreate\` prepares/submits \`create_sponsored_vault\` when a **sponsor** pays or signs vault creation for an **owner**. See **sponsoredVault** for signatures and payloads.

Owners can be ordinary Stellar accounts (\`G...\`) or smart-wallet contract IDs (\`C...\`): when signing is delegated to ACTA infra, omit or follow the signatures described on each hook page.
    `,
};
