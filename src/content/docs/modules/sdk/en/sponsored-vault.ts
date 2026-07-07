import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "sponsoredVault",
  title: "sponsoredVault",
  section: "Credentials SDK",
  tocItems: ["Client", "sponsoredVaultCreate", "Prepare and submit"],
  content: `
# sponsoredVault

\`ActaClient.sponsoredVaultCreate\` wraps **\`POST /contracts/sponsored-vault/create\`** (prepare/submit for the factory's \`deploy_sponsored\`), accessed with \`useActaClient()\` inside \`ActaConfig\`.

On-chain, sponsorship is **open**: any sponsor may deploy a sponsored vault for an owner. The underlying contract call is the factory's \`deploy_sponsored\` (it replaces the old \`create_sponsored_vault\` vault method). Note that the HTTP route requires an **admin-role API key**, so configure \`ActaConfig\` / \`ActaClient\` with an admin key to use this method.

Soroban semantics, authorization modes, and request JSON are documented under **API Reference → Sponsored Vault** (\`api-sponsored-vault\`). This page documents **TypeScript usage** for the public surface only.

## Client

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient();
\`\`\`

## sponsoredVaultCreate

\`\`\`ts
client.sponsoredVaultCreate(
  payload:
    | {
        sponsor: string;          // Sponsor address (pays and signs)
        owner: string;            // Vault owner
        didUri: string;           // DID URI stored for the vault
        sourcePublicKey: string;  // Must be the sponsor
        contractId?: string;
      }
    | { signedXdr: string }
): Promise<SponsoredVaultCreateResponse>
\`\`\`

- **Prepare:** first object → \`{ xdr, network }\`.
- **Submit:** \`{ signedXdr }\` → \`{ tx_id }\`.

## Prepare and submit

Pass prepare fields (no \`signedXdr\`) or \`{ signedXdr }\` after signing. Uses the same \`baseURL\` and API key as the rest of \`ActaClient\` for public contract routes.
    `,
};
