import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "sdk-overview",
  title: "Overview",
  section: "React SDK",
  tocItems: [
    "Exports",
    "Provider Setup",
    "Accessing the Client",
    "Hooks Summary",
  ],
  content: `
# React SDK Overview

React library exposing a provider, client access, and hooks for ACTA API and Soroban transactions. The network is inferred from the \`baseURL\`.

## Exports

- \`ActaConfig\` provider and \`useActaClient\` context accessor
- Hooks: \`useVault\`, \`useCredential\`, \`useVaultRead\`
- Base URLs: \`mainNet\` and \`testNet\`

## Provider Setup

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/acta-sdk";

export function App() {
  return (
    <ActaConfig baseURL={mainNet}>
      {/* your app */}
    </ActaConfig>
  );
}
\`\`\`

The API key is automatically read from environment variables:
- \`ACTA_API_KEY_MAINNET\` (for mainnet)
- \`ACTA_API_KEY_TESTNET\` (for testnet)
- \`ACTA_API_KEY\` (fallback for both networks)

## Accessing the Client

\`\`\`ts
import { useActaClient } from "@acta-team/acta-sdk";

const client = useActaClient();
const config = await client.getConfig();
// config: { rpcUrl, networkPassphrase, actaContractId }
\`\`\`

## Hooks Summary

- \`useVault\`: Vault operations - create vault, authorize issuer, revoke issuer
  - \`createVault\`: Initialize a vault for an owner
  - \`authorizeIssuer\`: Authorize an issuer in the vault
  - \`revokeIssuer\`: Revoke an authorized issuer from the vault

- \`useCredential\`: Credential operations - issue, issueLinked, and revoke
  - \`issue\`: Issue a credential (stores in vault and marks as valid)
  - \`issueLinked\`: Issue a credential linked to a parent VC
  - \`revoke\`: Revoke a credential

- \`useVaultRead\`: Vault read operations - list IDs, get VC, get VC parent, verify VC
  - \`listVcIds\`: List credential IDs owned by an owner
  - \`getVc\`: Get a credential from the vault
  - \`getVcParent\`: Get parent VC info for a linked credential
  - \`verifyVc\`: Verify the status of a credential in the vault
    `,
};
