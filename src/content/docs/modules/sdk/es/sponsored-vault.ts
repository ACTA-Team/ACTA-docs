import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "sponsoredVault",
  title: "sponsoredVault",
  section: "Credentials SDK",
  tocItems: ["Cliente", "sponsoredVaultCreate", "Prepare y submit"],
  content: `
# sponsoredVault

\`ActaClient.sponsoredVaultCreate\` envuelve **\`POST /contracts/sponsored-vault/create\`** (prepare/submit del \`deploy_sponsored\` del factory), obtenido con \`useActaClient()\` dentro de \`ActaConfig\`.

On-chain el patrocinio es **abierto**: cualquier sponsor puede desplegar una bóveda patrocinada para un owner. La llamada de contrato subyacente es el \`deploy_sponsored\` del factory (reemplaza al antiguo método \`create_sponsored_vault\` de la bóveda). Ten en cuenta que la ruta HTTP requiere una **API key con rol admin**, así que configura \`ActaConfig\` / \`ActaClient\` con una clave admin para usar este método.

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
        sponsor: string;          // Dirección del sponsor (paga y firma)
        owner: string;            // Propietario de la bóveda
        didUri: string;           // URI del DID guardado para la bóveda
        sourcePublicKey: string;  // Debe ser el sponsor
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
