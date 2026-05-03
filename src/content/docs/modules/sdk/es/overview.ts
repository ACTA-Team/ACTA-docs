import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "sdk-overview",
  title: "Resumen",
  section: "React SDK",
  tocItems: [
    "Exports",
    "Configuración del provider",
    "Acceder al cliente",
    "Resumen de hooks",
    "ActaClient: bóveda patrocinada",
  ],
  content: `
# Resumen del React SDK

Librería React que expone un provider, acceso al cliente y hooks para la API de ACTA y transacciones Soroban. La red se infiere desde \`baseURL\`.

## Exports

- Provider \`ActaConfig\` y accessor de contexto \`useActaClient\` (\`ActaClient\`)  
- Hooks: \`useVault\`, \`useCredential\`, \`useVaultRead\`  
- Métodos \`ActaClient\` para sponsored vault: \`sponsoredVaultCreate\`, \`getSponsoredVaultOpenToAll\`, etc. (ver **ActaClient: bóveda patrocinada** en esta sección)  
- URLs base: \`mainNet\` y \`testNet\`  

## Configuración del provider

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/acta-sdk";

export function App() {
  return (
    <ActaConfig baseURL={mainNet}>
      {/* tu aplicación */}
    </ActaConfig>
  );
}
\`\`\`

La API key se lee automáticamente desde variables de entorno:

- \`ACTA_API_KEY_MAINNET\` (para mainnet)  
- \`ACTA_API_KEY_TESTNET\` (para testnet)  
- \`ACTA_API_KEY\` (fallback para ambas redes)  

## Acceder al cliente

\`\`\`ts
import { useActaClient } from "@acta-team/acta-sdk";

const client = useActaClient();
const config = await client.getConfig();
// config: { rpcUrl, networkPassphrase, actaContractId }
\`\`\`

## Resumen de hooks

- \`useVault\`: Operaciones de bóveda - crear bóveda, autorizar emisor, revocar emisor
  - \`createVault\`: Inicializar una bóveda para un propietario
  - \`authorizeIssuer\`: Autorizar un emisor en la bóveda
  - \`revokeIssuer\`: Revocar un emisor autorizado de la bóveda

- \`useCredential\`: Operaciones de credenciales - emitir y revocar
  - \`issue\`: Emitir una credencial (almacena en la bóveda y marca como válida)
  - \`revoke\`: Revocar una credencial

- \`useVaultRead\`: Operaciones de lectura de bóveda - listar IDs, obtener VC, verificar VC
  - \`listVcIds\`: Listar los IDs de credenciales propiedad de un propietario
  - \`getVc\`: Obtener una credencial de la bóveda
  - \`verifyVc\`: Verificar el estado de una credencial en la bóveda

## ActaClient: bóveda patrocinada

\`ActaClient\` también envuelve \`/contracts/sponsored-vault/*\` para prepare/submit y la lectura de \`open-to-all\`. Úsalo cuando una cuenta **sponsor** pague o firme la creación de bóveda para un **owner**. Las firmas de métodos y tipos de payload están en la página **ActaClient: bóveda patrocinada** (\`actaClientSponsoredVault\`).
    `,
};
