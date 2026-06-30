import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "sdk-overview",
  title: "Resumen",
  section: "Credentials SDK",
  tocItems: [
    "Instalación",
    "Arquitectura",
    "Exports",
    "Provider (ActaConfig)",
    "Variables de entorno",
    "Acceso al cliente",
    "Resumen de hooks",
    "sponsoredVault",
  ],
  content: `
# SDK de credenciales - Resumen

Paquete publicado: **\`@acta-team/credentials\`** (instalable con npm, pnpm o yarn). Si ves referencias viejas a **\`@acta-team/acta-sdk\`** es la misma pieza de integración renombrada: el provider React **\`ActaConfig\`** crea el **\`ActaClient\`** en contexto (accedes con **\`useActaClient()\`**), más hooks para lectura/escritura de bóveda y credenciales. La red viene de **\`baseURL\`** (\`mainNet\` o \`testNet\`).

## Instalación

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

## Arquitectura

Las bóvedas son **single-tenant**: cada propietario tiene su propio contrato \`vc-vault\`, desplegado de forma determinista por un único \`vc-vault-factory\` por red. La API/SDK derivan la dirección de la bóveda de un propietario a partir de \`(factory, owner, userSalt)\`; el \`userSalt\` por defecto son 32 bytes en cero, lo que da una bóveda canónica por propietario. Pasa un \`userSalt\` distinto del valor por defecto en las llamadas de create/read/issue para seleccionar otra bóveda del mismo propietario.

La emisión es **abierta por defecto** (denegación por excepción): los propietarios bloquean emisores con \`denyIssuer\` y los desbloquean con \`allowIssuer\`. El emisor debe ser un \`did:stellar\` registrado y resoluble; las direcciones de wallet sueltas y \`did:pkh\` ya no se aceptan como DID de emisor.

## Exports

- **\`ActaConfig\`**: provider - \`baseURL\` obligatorio; \`apiKey\` opcional.
- **\`useActaClient\`**: devuelve el \`ActaClient\` del contexto (hijo de \`ActaConfig\`).
- **Hooks**: \`useVault\`, \`useCredential\`, \`useVaultRead\`.
- **\`ActaClient\`**: \`sponsoredVaultCreate\` para el flujo público **create** de bóveda patrocinada (prepare/submit); ver **sponsoredVault**.
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
// config: { rpcUrl, networkPassphrase, networkType, factoryContractId, vaultWasmHash, didStellarRegistryId, actaContractId }
// actaContractId es un alias de compatibilidad de factoryContractId
\`\`\`

## Resumen de hooks

- **\`useVault\`** - \`createVault\`, \`denyIssuer\`, \`allowIssuer\` (\`authorizeIssuer\` / \`revokeIssuer\` siguen disponibles como alias de compatibilidad).
- **\`useCredential\`** - \`issue\`, \`revoke\`.
- **\`useVaultRead\`** - \`listVcIds\`, \`getVc\`, \`verifyVc\`.

\`userSalt\` es un argumento opcional en las llamadas de create / read / issue; omítelo para usar la bóveda canónica del propietario.

## sponsoredVault

\`ActaClient.sponsoredVaultCreate\` prepara/envía el \`deploy_sponsored\` del factory cuando una cuenta **sponsor** paga o firma la creación de bóveda para un **owner**. Consulta **sponsoredVault** para firmas y payloads.

El titular de la bóveda puede ser cuenta clásica (\`G...\`) o smart wallet (\`C...\`); cuando la firma la delega la infraestructura de ACTA, los campos de firmante/signing se comportan como en cada página del hook.
    `,
};
