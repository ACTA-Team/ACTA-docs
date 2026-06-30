import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "sponsoredVault",
  title: "sponsoredVault",
  section: "Credentials SDK",
  tocItems: ["Client", "sponsoredVaultCreate", "Prepare and submit"],
  content: `
# sponsoredVault

\`ActaClient.sponsoredVaultCreate\` wraps **\`POST /contracts/sponsored-vault/create\`** (prepare/submit for the factory's \`deploy_sponsored\`), accessed with \`useActaClient()\` inside \`ActaConfig\`.

Sponsored deploy is **open** — any sponsor may deploy a single-tenant vault for an owner; there is no sponsor whitelist. Soroban semantics and request JSON are documented under **API Reference → Sponsored Vault** (\`api-sponsored-vault\`). This page documents **TypeScript usage** for the public surface only.

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
        sponsor: string;
        owner: string;
        didUri: string;
        sourcePublicKey: string;
        userSalt?: string;   // 32-byte salt (hex) selecting the vault; defaults to all-zero
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
