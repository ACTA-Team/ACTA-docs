import type { DocPage } from "@/@types/docs";

export const actaClientSponsoredVault: DocPage = {
  slug: "actaClientSponsoredVault",
  title: "ActaClient: sponsored vault",
  section: "React SDK",
  tocItems: [
    "Overview",
    "sponsoredVaultCreate",
    "getSponsoredVaultOpenToAll",
    "sponsoredVaultSetOpenToAll",
    "sponsoredVaultAddSponsor",
    "sponsoredVaultRemoveSponsor",
    "Prepare and submit",
  ],
  content: `
# ActaClient: sponsored vault

\`ActaClient\` (from \`@acta-team/acta-sdk\`) wraps the REST routes under \`/contracts/sponsored-vault/*\`. Obtain an instance with \`useActaClient()\` inside an \`ActaConfig\` tree.

Domain concepts, Soroban entrypoints, and HTTP request/response shapes are documented under **API Reference → Sponsored Vault** (\`api-sponsored-vault\`). This page covers **TypeScript usage only**.

## Overview

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
sponsoredVaultCreate(
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

- **Prepare:** first object → resolves to \`{ xdr, network }\`.
- **Submit:** \`{ signedXdr }\` → resolves to \`{ tx_id }\` (shape may match other write responses in your SDK version).

## getSponsoredVaultOpenToAll

\`\`\`ts
getSponsoredVaultOpenToAll(args?: {
  contractId?: string;
  sourcePublicKey?: string;
}): Promise<{ open: boolean }>
\`\`\`

Read-only; sends optional query params \`contractId\` and \`sourcePublicKey\` when provided.

## sponsoredVaultSetOpenToAll

\`\`\`ts
sponsoredVaultSetOpenToAll(
  payload:
    | { open: boolean; sourcePublicKey: string; contractId?: string }
    | { signedXdr: string }
): Promise<SponsoredVaultSetOpenToAllResponse>
\`\`\`

Contract admin must sign the prepared transaction (\`sourcePublicKey\` in prepare mode).

## sponsoredVaultAddSponsor

\`\`\`ts
sponsoredVaultAddSponsor(
  payload:
    | { sponsor: string; sourcePublicKey: string; contractId?: string }
    | { signedXdr: string }
): Promise<SponsoredVaultAddSponsorResponse>
\`\`\`

## sponsoredVaultRemoveSponsor

\`\`\`ts
sponsoredVaultRemoveSponsor(
  payload:
    | { sponsor: string; sourcePublicKey: string; contractId?: string }
    | { signedXdr: string }
): Promise<SponsoredVaultRemoveSponsorResponse>
\`\`\`

## Prepare and submit

For each \`POST\` method, the SDK accepts either the **prepare** fields (no \`signedXdr\`) or \`{ signedXdr }\` after you sign the returned XDR with a Stellar signer. The client uses the same \`baseURL\` and API key wiring as the rest of \`ActaClient\`.
    `,
};
