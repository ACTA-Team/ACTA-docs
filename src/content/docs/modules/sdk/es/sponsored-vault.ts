import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "sponsoredVault",
  title: "sponsoredVault",
  section: "React SDK",
  tocItems: [
    "Cliente",
    "sponsoredVaultCreate",
    "getSponsoredVaultOpenToAll",
    "sponsoredVaultSetOpenToAll",
    "sponsoredVaultAddSponsor",
    "sponsoredVaultRemoveSponsor",
    "Prepare y submit",
  ],
  content: `
# sponsoredVault

Métodos de \`ActaClient\` para \`/contracts/sponsored-vault/*\`, obtenidos con \`useActaClient()\` dentro de \`ActaConfig\`.

Rutas HTTP, semántica Soroban y JSON de petición están en **Referencia API → Bóveda patrocinada** (\`api-sponsored-vault\`). Esta página documenta el **uso en TypeScript** del cliente.

## Cliente

\`\`\`ts
import { useActaClient } from "@acta-team/acta-sdk";

const client = useActaClient();
\`\`\`

| Método | REST |
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

- **Prepare:** primer objeto → \`{ xdr, network }\`.
- **Submit:** \`{ signedXdr }\` → \`{ tx_id }\`.

## getSponsoredVaultOpenToAll

\`\`\`ts
client.getSponsoredVaultOpenToAll(args?: {
  contractId?: string;
  sourcePublicKey?: string;
}): Promise<{ open: boolean }>
\`\`\`

Los argumentos opcionales se envían como query cuando están presentes.

## sponsoredVaultSetOpenToAll

\`\`\`ts
client.sponsoredVaultSetOpenToAll(
  payload:
    | { open: boolean; sourcePublicKey: string; contractId?: string }
    | { signedXdr: string }
): Promise<SponsoredVaultSetOpenToAllResponse>
\`\`\`

El admin del contrato debe firmar la transacción preparada.

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

## Prepare y submit

Cada método \`POST\` acepta campos de prepare (sin \`signedXdr\`) o \`{ signedXdr }\` tras firmar. Usa el mismo \`baseURL\` y API key que el resto de \`ActaClient\`.
    `,
};
