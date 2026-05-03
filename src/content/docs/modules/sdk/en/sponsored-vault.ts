import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "sponsoredVault",
  title: "sponsoredVault",
  section: "React SDK",
  tocItems: [
    "Client",
    "sponsoredVaultCreate",
    "getSponsoredVaultOpenToAll",
    "sponsoredVaultSetOpenToAll",
    "sponsoredVaultAddSponsor",
    "sponsoredVaultRemoveSponsor",
    "Prepare and submit",
  ],
  content: `
# sponsoredVault

\`ActaClient\` methods for \`/contracts/sponsored-vault/*\`, accessed with \`useActaClient()\` inside \`ActaConfig\`.

HTTP paths, Soroban semantics, and request JSON are documented under **API Reference → Sponsored Vault** (\`api-sponsored-vault\`). This page documents **TypeScript usage** of the client.

## Client

\`\`\`ts
import { useActaClient } from "@acta-team/acta-sdk";

const client = useActaClient();
\`\`\`

| Method | REST |
|--------|------|
| \`sponsoredVaultCreate\` | \`POST .../sponsored-vault/create\` |
| \`getSponsoredVaultOpenToAll\` | \`GET .../sponsored-vault/open-to-all\` |
| \`sponsoredVaultSetOpenToAll\` | \`POST .../sponsored-vault/open-to-all\` |
| \`sponsoredVaultAddSponsor\` | \`POST .../sponsored-vault/add-sponsor\` |
| \`sponsoredVaultRemoveSponsor\` | \`POST .../sponsored-vault/remove-sponsor\` |

## sponsoredVaultCreate

\`\`\`ts
client.sponsoredVaultCreate(
  payload:
    | {
        sponsor: string;
        owner: string;
        didUri: string;
        sourcePublicKey: string;
        contractId?: string;
      }
    | { signedXdr: string }
): Promise<SponsoredVaultCreateResponse>
\`\`\`

- **Prepare:** first object → \`{ xdr, network }\`.
- **Submit:** \`{ signedXdr }\` → \`{ tx_id }\`.

## getSponsoredVaultOpenToAll

\`\`\`ts
client.getSponsoredVaultOpenToAll(args?: {
  contractId?: string;
  sourcePublicKey?: string;
}): Promise<{ open: boolean }>
\`\`\`

Optional args are sent as query parameters when present.

## sponsoredVaultSetOpenToAll

\`\`\`ts
client.sponsoredVaultSetOpenToAll(
  payload:
    | { open: boolean; sourcePublicKey: string; contractId?: string }
    | { signedXdr: string }
): Promise<SponsoredVaultSetOpenToAllResponse>
\`\`\`

The contract admin must sign the prepared transaction.

## sponsoredVaultAddSponsor

\`\`\`ts
client.sponsoredVaultAddSponsor(
  payload:
    | { sponsor: string; sourcePublicKey: string; contractId?: string }
    | { signedXdr: string }
): Promise<SponsoredVaultAddSponsorResponse>
\`\`\`

## sponsoredVaultRemoveSponsor

\`\`\`ts
client.sponsoredVaultRemoveSponsor(
  payload:
    | { sponsor: string; sourcePublicKey: string; contractId?: string }
    | { signedXdr: string }
): Promise<SponsoredVaultRemoveSponsorResponse>
\`\`\`

## Prepare and submit

Each \`POST\` method accepts either prepare fields (no \`signedXdr\`) or \`{ signedXdr }\` after signing. Uses the same \`baseURL\` and API key as the rest of \`ActaClient\`.
    `,
};
