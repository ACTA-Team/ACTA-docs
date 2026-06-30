import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "sdk-overview",
  title: "Overview",
  section: "Credentials SDK",
  tocItems: [
    "Install",
    "Architecture",
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

## Install

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

## Architecture

Vaults are **single-tenant**: each owner has their own \`vc-vault\` contract, deployed deterministically by a single \`vc-vault-factory\` per network. The API/SDK derive an owner's vault address from \`(factory, owner, userSalt)\`; the default \`userSalt\` is 32 zero bytes, giving one canonical vault per owner. Pass a non-default \`userSalt\` on create/read/issue calls to select an additional vault for the same owner.

Issuance is **open by default** (deny-by-exception): owners block issuers with \`denyIssuer\` and unblock them with \`allowIssuer\`. The issuer must be a registered, resolvable \`did:stellar\`; bare wallet addresses and \`did:pkh\` are no longer accepted as issuer DID.

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
// config: { rpcUrl, networkPassphrase, networkType, factoryContractId, vaultWasmHash, didStellarRegistryId, actaContractId }
// actaContractId is a back-compat alias of factoryContractId
\`\`\`

## Hooks summary

- **\`useVault\`** - \`createVault\`, \`denyIssuer\`, \`allowIssuer\` (\`authorizeIssuer\` / \`revokeIssuer\` remain as back-compat aliases).
- **\`useCredential\`** - \`issue\`, \`revoke\`.
- **\`useVaultRead\`** - \`listVcIds\`, \`getVc\`, \`verifyVc\`.

\`userSalt\` is an optional argument on the create / read / issue calls; omit it to use the owner's canonical vault.

## sponsoredVault

\`ActaClient.sponsoredVaultCreate\` prepares/submits the factory's \`deploy_sponsored\` when a **sponsor** pays or signs vault creation for an **owner**. See **sponsoredVault** for signatures and payloads.

Owners can be ordinary Stellar accounts (\`G...\`) or smart-wallet contract IDs (\`C...\`): when signing is delegated to ACTA infra, omit or follow the signatures described on each hook page.
    `,
};
