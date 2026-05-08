import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "sponsoredVault",
  title: "sponsoredVault",
  section: "Credentials SDK",
  tocItems: ["Cliente", "sponsoredVaultCreate", "Prepare y submit"],
  content: `
# sponsoredVault

\`ActaClient.sponsoredVaultCreate\` envuelve **\`POST /contracts/sponsored-vault/create\`** (prepare/submit de \`create_sponsored_vault\`), obtenido con \`useActaClient()\` dentro de \`ActaConfig\`.

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
