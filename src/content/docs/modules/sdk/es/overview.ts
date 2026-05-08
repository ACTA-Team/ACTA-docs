import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "sdk-overview",
  title: "Resumen",
  section: "Credentials SDK",
  tocItems: [
    "Instalación",
    "Exports",
    "Provider (ActaConfig)",
    "Variables de entorno",
    "Acceso al cliente",
    "Resumen de hooks",
  ],
  content: `
# SDK de credenciales — Resumen

Paquete publicado: **\`@acta-team/credentials\`** (instalable con npm, pnpm o yarn). Si ves referencias viejas a **\`@acta-team/acta-sdk\`** es la misma pieza de integración renombrada: el provider React **\`ActaConfig\`** crea el **\`ActaClient\`** en contexto (accedes con **\`useActaClient()\`**), más hooks para lectura/escritura de bóveda y credenciales. La red viene de **\`baseURL\`** (\`mainNet\` o \`testNet\`).

## Instalación

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

## Exports

- **\`ActaConfig\`**: provider — \`baseURL\` obligatorio; \`apiKey\` opcional.
- **\`useActaClient\`**: devuelve el \`ActaClient\` del contexto (hijo de \`ActaConfig\`).
- **Hooks**: \`useVault\`, \`useCredential\`, \`useVaultRead\`.
- **URLs**: \`mainNet\`, \`testNet\`.

## Provider (\`ActaConfig\`)

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/credentials";

export function App() {
  return (
    <ActaConfig baseURL={mainNet}>
      {/* tu aplicación */}
    </ActaConfig>
  );
}
\`\`\`

Pasa **\`apiKey\`** en el provider si no quieres depender sólo del entorno.

## Variables de entorno

Sin \`apiKey\` en el provider el SDK resuelve la clave en este orden:

- Por red: \`ACTA_API_KEY_MAINNET\`, \`ACTA_API_KEY_TESTNET\`
- Alternativa única para ambas: \`ACTA_API_KEY\`

La clave va en la cabecera **\`X-ACTA-Key\`** de cada solicitud HTTP.

## Acceso al cliente

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient();
const config = await client.getConfig();
// config: { rpcUrl, networkPassphrase, actaContractId }
\`\`\`

## Resumen de hooks

- **\`useVault\`** — \`createVault\`, \`authorizeIssuer\`, \`revokeIssuer\`.
- **\`useCredential\`** — \`issue\`, \`issueLinked\`, \`revoke\`.
- **\`useVaultRead\`** — \`listVcIds\`, \`getVc\`, \`getVcParent\`, \`verifyVc\`.

El titular de la bóveda puede ser cuenta clásica (\`G...\`) o smart wallet (\`C...\`); cuando la firma la delega la infraestructura de ACTA, los campos de firmante/signing se comportan como en cada página del hook.
    `,
};
