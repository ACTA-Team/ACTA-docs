import type { DocPage } from "@/@types/docs";

export const actaClient: DocPage = {
  slug: "actaClient",
  title: "ActaClient",
  section: "Credentials SDK",
  tocItems: [
    "Obtener el cliente",
    "Constructor y configuración",
    "Info y config",
    "Identidad del emisor",
    "Métodos de lectura",
    "Métodos de escritura (prepare/submit)",
    "Ejemplo manual de prepare/submit",
    "Métodos deprecados",
  ],
  content: `
# ActaClient

\`ActaClient\` es el cliente HTTP que está debajo de cada hook. Úsalo directamente cuando necesites métodos que los hooks no envuelven (\`vaultSetDid\`, \`vaultPush\`, \`vaultSetNewOwner\`, \`sponsoredVaultCreate\`), cuando quieras control manual de los pasos prepare/submit, o fuera de React.

## Obtener el cliente

Dentro de React, toma el cliente contextual (comparte la \`baseURL\` y la API key del provider):

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient(); // must be under <ActaConfig>
\`\`\`

Fuera de React, constrúyelo directamente:

\`\`\`ts
import { ActaClient, testNet } from "@acta-team/credentials";

const client = new ActaClient(testNet, process.env.ACTA_API_KEY);
\`\`\`

## Constructor y configuración

\`\`\`ts
new ActaClient(baseURL, apiKey?, identityOptions?)
\`\`\`

- La **red** se infiere de la URL (\`mainnet\` en el host significa mainnet; en caso contrario, testnet).
- **Resolución de la API key**: el argumento explícito \`apiKey\` gana; si no, la variable de entorno específica de red (\`ACTA_API_KEY_MAINNET\` / \`ACTA_API_KEY_TESTNET\`), y luego \`ACTA_API_KEY\`. La construcción lanza un error si no se encuentra ninguna clave. La clave se envía como \`X-ACTA-Key\` en cada request.
- Los requests expiran a los **30 segundos** y cada fallo rechaza con un **\`ActaApiError\`** (\`status\`, \`code\`, \`requestId?\`, \`isTimeout\`, \`isNetworkError\`).

\`identityOptions\` (\`ActaClientIdentityOptions\`) ajusta la capa de auto-onboarding de DID:

| Opción | Por defecto | Propósito |
|--------|---------|---------|
| \`storage\` | IndexedDB (navegador) / en memoria (Node) | Dónde persisten las identidades de emisor; los servidores deberían proveer un \`IssuerIdentityStorage\` persistente |
| \`rpcUrl\` | Default de la red | RPC de Stellar para el registro de DID |
| \`registryContractId\` | Default de la red | Override del registro did:stellar |
| \`allowHttp\` | false | Permite RPC sin HTTPS (desarrollo local) |
| \`timeoutMs\` | 30000 | Timeout del flujo de identidad |
| \`configCacheTtlMs\` | 300000 | TTL de la caché de \`getConfig()\` |

## Info y config

| Método | Devuelve |
|--------|---------|
| \`getNetwork()\` | \`"mainnet"\` o \`"testnet"\` |
| \`getHealth()\` | Resultado de \`GET /health\` |
| \`getConfig()\` | Resultado de \`GET /config\`, cacheado ~5 minutos (\`rpcUrl\`, \`networkPassphrase\`, \`networkType\`, \`factoryContractId\`, \`vaultWasmHash\`, \`didStellarRegistryId\`, \`actaContractId\`) |
| \`clearConfigCache()\` | Descarta la config cacheada |

## Identidad del emisor

| Método | Propósito |
|--------|---------|
| \`getOrCreateIssuerIdentity({ controller, signTransaction })\` | Devuelve la identidad guardada o acuña + registra un nuevo did:stellar (una sola firma de wallet) |
| \`getIssuerIdentity(controller)\` | Devuelve la identidad guardada o \`null\`, nunca registra |

## Métodos de lectura

| Método | Endpoint |
|--------|----------|
| \`vaultListVcIdsDirect({ owner, contractId? })\` | \`POST /contracts/vault/list-vc-ids\` |
| \`vaultGetVcDirect({ owner, vcId, contractId? })\` | \`POST /contracts/vault/get-vc\` |
| \`vaultVerify({ owner, vcId, vaultContractId? })\` | \`POST /contracts/vault/verify-vc\` |
| \`getContractVersion({ owner?, sourcePublicKey?, contractId? })\` | \`GET /contracts/version\` |

## Métodos de escritura (prepare/submit)

Cada escritura acepta un payload de unión: el objeto de **prepare** (los campos de la operación) o \`{ signedXdr }\` para hacer **submit**. El tipo de retorno es \`TxResponse\` = \`{ xdr, network }\` (prepare) o \`{ tx_id }\` (submit); usa los guards exportados \`isTxPrepareResponse\` / \`isTxSubmitResponse\` para distinguirlos.

| Método | Endpoint | Campos de prepare |
|--------|----------|----------------|
| \`vaultCreate\` | \`/contracts/vault/create\` | \`owner\`, \`didUri\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vcIssue\` | \`/contracts/vc/issue\` | \`owner\`, \`vcId\`, \`vcData\`, \`issuer\`, \`issuerDid?\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`revokeCredentialViaApi\` | \`/contracts/vc/revoke\` | \`owner\`, \`vcId\`, \`date?\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vaultDenyIssuer\` / \`vaultAllowIssuer\` | \`/contracts/vault/deny-issuer\` / \`allow-issuer\` | \`owner\`, \`issuer\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vaultAuthorizeIssuer\` / \`vaultRevokeIssuerViaApi\` | rutas alias de retrocompatibilidad (authorize = allow, revoke = deny) | igual que arriba |
| \`vaultRevokeVault\` | \`/contracts/vault/revoke-vault\` | \`owner\`, \`sourcePublicKey\`, \`userSalt?\` |
| \`vaultSetNewOwner\` | \`/contracts/vault/set-new-owner\` | \`owner\`, \`newOwner\`, \`sourcePublicKey\` |
| \`vaultSetDid\` | \`/contracts/vault/set-vault-did\` | \`owner\`, \`didUri\`, \`sourcePublicKey?\`, \`userSalt?\`, \`vaultContract?\` |
| \`vaultPush\` | \`/contracts/vault/push\` | \`fromOwner\`, \`toOwner\`, \`vcId\`, \`issuer\`, \`sourcePublicKey\` |
| \`sponsoredVaultCreate\` | \`/contracts/sponsored-vault/create\` | \`sponsor\`, \`owner\`, \`didUri\`, \`sourcePublicKey\` (**requiere API key de admin**) |

## Ejemplo manual de prepare/submit

Los hooks hacen este baile por ti; con el cliente lo conduces tú mismo:

\`\`\`ts
import { isTxPrepareResponse, isTxSubmitResponse } from "@acta-team/credentials";

// 1. Prepare
const prepared = await client.vaultSetDid({
  owner: "G...",
  didUri: "did:stellar:testnet:...",
  sourcePublicKey: "G...",
});
if (!isTxPrepareResponse(prepared)) throw new Error("prepare failed");

// 2. Sign with any Stellar wallet
const signedXdr = await signTransaction(prepared.xdr, {
  networkPassphrase: prepared.network,
});

// 3. Submit
const result = await client.vaultSetDid({ signedXdr });
if (isTxSubmitResponse(result)) console.log(result.tx_id);
\`\`\`

## Métodos deprecados

\`createCredential\`, \`getDefaults\`, \`prepareStoreTx\`, \`prepareListVcIdsTx\`, \`prepareGetVcTx\` y \`vaultStore\` son stubs deprecados cuya eliminación está programada para la **2.0.0**. Migra a \`vcIssue\`, \`getConfig\`, \`vaultListVcIdsDirect\` y \`vaultGetVcDirect\`.
    `,
};
