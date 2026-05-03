import type { DocPage } from "@/@types/docs";

export const actaClientSponsoredVault: DocPage = {
  slug: "actaClientSponsoredVault",
  title: "ActaClient: bóveda patrocinada",
  section: "React SDK",
  tocItems: [
    "Resumen",
    "sponsoredVaultCreate",
    "getSponsoredVaultOpenToAll",
    "sponsoredVaultSetOpenToAll",
    "sponsoredVaultAddSponsor",
    "sponsoredVaultRemoveSponsor",
    "Prepare y submit",
  ],
  content: `
# ActaClient: bóveda patrocinada

\`ActaClient\` (de \`@acta-team/acta-sdk\`) envuelve las rutas REST bajo \`/contracts/sponsored-vault/*\`. Obtén una instancia con \`useActaClient()\` dentro de un árbol \`ActaConfig\`.

Conceptos de dominio, entrypoints Soroban y formas HTTP están en **Referencia API → Bóveda patrocinada** (\`api-sponsored-vault\`). Esta página es solo **uso en TypeScript**.

## Resumen

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

- **Prepare:** primer objeto → resuelve a \`{ xdr, network }\`.
- **Submit:** \`{ signedXdr }\` → resuelve a \`{ tx_id }\` (la forma exacta puede coincidir con otras respuestas de escritura según la versión del SDK).

## getSponsoredVaultOpenToAll

\`\`\`ts
getSponsoredVaultOpenToAll(args?: {
  contractId?: string;
  sourcePublicKey?: string;
}): Promise<{ open: boolean }>
\`\`\`

Solo lectura; envía como query opcional \`contractId\` y \`sourcePublicKey\` si los pasas.

## sponsoredVaultSetOpenToAll

\`\`\`ts
sponsoredVaultSetOpenToAll(
  payload:
    | { open: boolean; sourcePublicKey: string; contractId?: string }
    | { signedXdr: string }
): Promise<SponsoredVaultSetOpenToAllResponse>
\`\`\`

El admin del contrato debe firmar la transacción preparada (\`sourcePublicKey\` en modo prepare).

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

## Prepare y submit

En cada método \`POST\`, el SDK acepta los campos de **prepare** (sin \`signedXdr\`) o \`{ signedXdr }\` tras firmar el XDR con un firmante Stellar. El cliente usa el mismo \`baseURL\` y la misma configuración de API key que el resto de \`ActaClient\`.
    `,
};
