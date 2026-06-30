import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "sdk-overview",
  title: "Resumen",
  section: "Credentials SDK",
  tocItems: [
    "Instalación",
    "Bóvedas mono-inquilino (v0.4.0)",
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

## Bóvedas mono-inquilino (v0.4.0)

Cada propietario tiene su **propia** \`vc-vault\`, desplegada de forma determinista por un **\`vc-vault-factory\`**. El SDK deriva la bóveda del propietario a partir de \`(factory, owner, userSalt)\`, por lo que pasas **\`owner\`** en lugar de un id de contrato de bóveda.

- El **\`userSalt\`** opcional (hex de 32 bytes, por defecto todo en cero) selecciona cuál de las bóvedas del propietario se usa; la mayoría de apps nunca lo configuran.
- La **emisión es abierta por defecto** (denegar-por-excepción): los propietarios **bloquean** emisores con \`denyIssuer\` y los **desbloquean** con \`allowIssuer\` (la antigua lista de autorizados desapareció, aunque \`authorizeIssuer\`/\`revokeIssuer\` siguen como alias).
- El emisor debe controlar un **\`did:stellar\` registrado y resoluble**; el SDK puede crearlo automáticamente vía \`getOrCreateIssuerIdentity\` (ver \`useCredential\`). Las direcciones de wallet planas / \`did:pkh\` ya no se aceptan como DID del emisor.
- Las **tarifas** se cobran on-chain al emitir (por defecto 1 USDC/credencial pagada por el emisor); no hay sobrescritura de tarifa en el SDK.

## Instalación

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

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
// ConfigResponse: { rpcUrl, networkPassphrase, networkType,
//   factoryContractId, vaultWasmHash, didStellarRegistryId, actaContractId }
\`\`\`

El \`ConfigResponse\` ahora expone \`networkType\`, \`factoryContractId\`, \`vaultWasmHash\` y \`didStellarRegistryId\`; \`actaContractId\` se mantiene como alias retrocompatible de \`factoryContractId\`.

## Resumen de hooks

- **\`useVault\`** - \`createVault\` (\`userSalt\` opcional), \`denyIssuer\`, \`allowIssuer\` (\`authorizeIssuer\`/\`revokeIssuer\` se mantienen como alias).
- **\`useCredential\`** - \`issue\` (\`userSalt\` opcional), \`revoke\` (envía \`owner\`).
- **\`useVaultRead\`** - \`listVcIds\`, \`getVc\`, \`verifyVc\`.

## sponsoredVault

\`ActaClient.sponsoredVaultCreate\` prepara/envía \`create_sponsored_vault\` cuando una cuenta **sponsor** paga o firma la creación de bóveda para un **owner**. Consulta **sponsoredVault** para firmas y payloads.

El titular de la bóveda puede ser cuenta clásica (\`G...\`) o smart wallet (\`C...\`); cuando la firma la delega la infraestructura de ACTA, los campos de firmante/signing se comportan como en cada página del hook.
    `,
};
