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
    "Identidad del emisor (auto-onboarding)",
    "Manejo de errores",
    "sponsoredVault",
    "Métodos deprecados",
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
- **\`ActaClient\`**: métodos directos del cliente, incluidos \`getHealth\`, \`getConfig\` (con caché de ~5 min, \`clearConfigCache()\` para reiniciarla), \`vaultSetDid\`, \`vaultSetNewOwner\`, \`vaultPush\` y \`sponsoredVaultCreate\` (ver **sponsoredVault**).
- **Errores**: \`ActaApiError\` y \`normalizeError\` (ver **Manejo de errores**).
- **Identidad**: \`getOrCreateIssuerIdentity\` / \`getIssuerIdentity\` en el cliente, más helpers de almacenamiento (\`IndexedDbIssuerIdentityStorage\`, \`InMemoryIssuerIdentityStorage\`, \`autoSelectStorage\`).
- **URLs**: \`mainNet\`, \`testNet\` (constantes string de los dos hosts de la API; también se acepta cualquier string custom como \`baseURL\`, por ejemplo staging o localhost).
- **Exports por subruta**: \`@acta-team/credentials/types\` y \`@acta-team/credentials/hooks\`. El paquete se publica en ESM y CJS con declaraciones TypeScript; \`ActaConfig\` es un componente cliente (\`"use client"\`), compatible con el App Router de Next.js.

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

- **\`useVault\`** - \`createVault\`, \`denyIssuer\`, \`allowIssuer\` (más alias de compatibilidad: \`authorizeIssuer\` ≙ allow, \`revokeIssuer\` ≙ deny).
- **\`useCredential\`** - \`issue\`, \`revoke\`.
- **\`useVaultRead\`** - \`listVcIds\`, \`getVc\`, \`verifyVc\`.

\`userSalt\` es un argumento opcional en las llamadas de escritura de bóveda y de emisión (\`createVault\`, \`denyIssuer\`, \`allowIssuer\`, \`issue\`, \`revoke\`); omítelo para usar la bóveda canónica del propietario. Los hooks de \`useVaultRead\` siempre apuntan a la bóveda canónica.

## Identidad del emisor (auto-onboarding)

El SDK es el dueño del onboarding del DID de emisor: cuando se llama a \`issue\` sin \`issuerDid\`, el cliente llama de forma transparente a \`getOrCreateIssuerIdentity({ controller, signTransaction })\` - genera una clave Ed25519, crea un \`did:stellar\`, lo registra on-chain (una firma de wallet, solo la primera vez) y persiste la identidad.

- **Navegador**: las identidades persisten en IndexedDB, con la clave privada cifrada en reposo.
- **Node / servidor**: el almacenamiento por defecto es **en memoria** - se crearía un DID nuevo en cada reinicio. Los integradores del lado servidor deben proveer un \`IssuerIdentityStorage\` persistente vía \`ActaClientIdentityOptions\`.

## Manejo de errores

Toda solicitud del cliente que falla se rechaza con un **\`ActaApiError\`** (\`status\`, \`code\`, \`requestId?\`, \`isTimeout\`, \`isNetworkError\`, \`details?\`). Las solicitudes expiran a los 30 segundos por defecto. Usa el export \`normalizeError(err)\` para convertir errores desconocidos en \`ActaApiError\`.

## sponsoredVault

\`ActaClient.sponsoredVaultCreate\` prepara/envía el \`deploy_sponsored\` del factory cuando una cuenta **sponsor** paga o firma la creación de bóveda para un **owner**. La ruta de la API requiere una **API key con rol admin**. Consulta **sponsoredVault** para firmas y payloads.

El titular de la bóveda puede ser cuenta clásica (\`G...\`) o smart wallet (\`C...\`); cuando la firma la delega la infraestructura de ACTA, los campos de firmante/signing se comportan como en cada página del hook.

## Métodos deprecados

\`createCredential\`, \`getDefaults\`, \`prepareStoreTx\`, \`prepareListVcIdsTx\`, \`prepareGetVcTx\` y \`vaultStore\` son stubs deprecados que se eliminarán en **2.0.0**. Migra a \`vcIssue\`, \`getConfig\`, \`vaultListVcIdsDirect\` y \`vaultGetVcDirect\` (o a los hooks).
    `,
};
