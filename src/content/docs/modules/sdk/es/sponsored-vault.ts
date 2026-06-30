import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "sponsoredVault",
  title: "sponsoredVault",
  section: "Credentials SDK",
  tocItems: ["Cliente", "sponsoredVaultCreate", "Prepare y submit"],
  content: `
# sponsoredVault

\`ActaClient.sponsoredVaultCreate\` envuelve **\`POST /contracts/sponsored-vault/create\`** (prepare/submit del \`deploy_sponsored\` del factory), obtenido con \`useActaClient()\` dentro de \`ActaConfig\`.

El patrocinio ahora es **abierto**: cualquier sponsor puede desplegar una bóveda patrocinada para un owner. La llamada de contrato subyacente es el \`deploy_sponsored\` del factory (reemplaza al antiguo método \`create_sponsored_vault\` de la bóveda), y \`userSalt\` es un campo opcional en el payload de creación.

Semántica Soroban, modos de autorización y JSON de petición están en **Referencia API → Bóveda patrocinada** (\`api-sponsored-vault\`). Esta página documenta el **uso en TypeScript** solo de la superficie pública.

## Cliente

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
        userSalt?: string;
        contractId?: string;
      }
    | { signedXdr: string }
): Promise<SponsoredVaultCreateResponse>
\`\`\`

- **Prepare:** primer objeto → \`{ xdr, network }\`.
- **Submit:** \`{ signedXdr }\` → \`{ tx_id }\`.

## Prepare y submit

Pasa campos de prepare (sin \`signedXdr\`) o \`{ signedXdr }\` tras firmar. Usa el mismo \`baseURL\` y API key que el resto de \`ActaClient\` para rutas públicas de contrato.
    `,
};
