import type { DocPage } from "@/@types/docs";

export const actaClient: DocPage = {
  slug: "actaClient",
  title: "ActaClient",
  section: "Credentials SDK",
  tocItems: [
    "Obtenir le client",
    "Constructeur et configuration",
    "Infos et config",
    "Identité de l'émetteur",
    "Méthodes de lecture",
    "Méthodes d'écriture (prepare/submit)",
    "Exemple manuel de prepare/submit",
    "Méthodes dépréciées",
  ],
  content: `
# ActaClient

\`ActaClient\` est le client HTTP sous-jacent à chaque hook. Utilisez-le directement quand vous avez besoin de méthodes que les hooks n'enveloppent pas (\`vaultSetDid\`, \`vaultPush\`, \`vaultSetNewOwner\`, \`sponsoredVaultCreate\`), quand vous voulez un contrôle manuel des étapes prepare/submit, ou en dehors de React.

## Obtenir le client

Dans React, prenez le client contextuel (il partage la \`baseURL\` et la clé d'API du provider) :

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient(); // doit être sous <ActaConfig>
\`\`\`

En dehors de React, construisez-le directement :

\`\`\`ts
import { ActaClient, testNet } from "@acta-team/credentials";

const client = new ActaClient(testNet, process.env.ACTA_API_KEY);
\`\`\`

## Constructeur et configuration

\`\`\`ts
new ActaClient(baseURL, apiKey?, identityOptions?)
\`\`\`

- **Le réseau** est déduit de l'URL (\`mainnet\` dans l'hôte signifie mainnet, sinon testnet).
- **Résolution de la clé d'API** : l'argument \`apiKey\` explicite l'emporte ; sinon la variable d'environnement spécifique au réseau (\`ACTA_API_KEY_MAINNET\` / \`ACTA_API_KEY_TESTNET\`), puis \`ACTA_API_KEY\`. La construction lève une exception si aucune clé n'est trouvée. La clé est envoyée en tant que \`X-ACTA-Key\` sur chaque requête.
- Les requêtes expirent après **30 secondes** et tout échec est rejeté avec une **\`ActaApiError\`** (\`status\`, \`code\`, \`requestId?\`, \`isTimeout\`, \`isNetworkError\`).

\`identityOptions\` (\`ActaClientIdentityOptions\`) règle la couche d'auto-onboarding DID :

| Option | Valeur par défaut | Rôle |
|--------|---------|---------|
| \`storage\` | IndexedDB (navigateur) / en mémoire (Node) | Où persistent les identités d'émetteur ; les serveurs doivent fournir un \`IssuerIdentityStorage\` persistant |
| \`rpcUrl\` | Défaut du réseau | RPC Stellar pour l'enregistrement du DID |
| \`registryContractId\` | Défaut du réseau | Remplacement du registre did:stellar |
| \`allowHttp\` | false | Autoriser un RPC non HTTPS (développement local) |
| \`timeoutMs\` | 30000 | Délai d'expiration du flux d'identité |
| \`configCacheTtlMs\` | 300000 | TTL du cache de \`getConfig()\` |

## Infos et config

| Méthode | Retourne |
|--------|---------|
| \`getNetwork()\` | \`"mainnet"\` ou \`"testnet"\` |
| \`getHealth()\` | Résultat de \`GET /health\` |
| \`getConfig()\` | Résultat de \`GET /config\`, en cache ~5 minutes (\`rpcUrl\`, \`networkPassphrase\`, \`networkType\`, \`factoryContractId\`, \`vaultWasmHash\`, \`didStellarRegistryId\`, \`actaContractId\`) |
| \`clearConfigCache()\` | Vide la config en cache |

## Identité de l'émetteur

| Méthode | Rôle |
|--------|---------|
| \`getOrCreateIssuerIdentity({ controller, signTransaction })\` | Retourne l'identité stockée ou crée + enregistre un nouveau did:stellar (une signature de wallet) |
| \`getIssuerIdentity(controller)\` | Retourne l'identité stockée ou \`null\`, n'enregistre jamais |

## Méthodes de lecture

| Méthode | Endpoint |
|--------|----------|
| \`vaultListVcIdsDirect({ owner, contractId? })\` | \`POST /contracts/vault/list-vc-ids\` |
| \`vaultGetVcDirect({ owner, vcId, contractId? })\` | \`POST /contracts/vault/get-vc\` |
| \`vaultVerify({ owner, vcId, vaultContractId? })\` | \`POST /contracts/vault/verify-vc\` |
| \`getContractVersion({ owner?, sourcePublicKey?, contractId? })\` | \`GET /contracts/version\` |

## Méthodes d'écriture (prepare/submit)

Chaque écriture accepte un payload en union : l'objet **prepare** (champs de l'opération) ou \`{ signedXdr }\` pour **submit**. Le type de retour est \`TxResponse\` = \`{ xdr, network }\` (prepare) ou \`{ tx_id }\` (submit) ; utilisez les gardes exportées \`isTxPrepareResponse\` / \`isTxSubmitResponse\` pour les distinguer.

| Méthode | Endpoint | Champs prepare |
|--------|----------|----------------|
| \`vaultCreate\` | \`/contracts/vault/create\` | \`owner\`, \`didUri\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vcIssue\` | \`/contracts/vc/issue\` | \`owner\`, \`vcId\`, \`vcData\`, \`issuer\`, \`issuerDid?\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`revokeCredentialViaApi\` | \`/contracts/vc/revoke\` | \`owner\`, \`vcId\`, \`date?\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vaultDenyIssuer\` / \`vaultAllowIssuer\` | \`/contracts/vault/deny-issuer\` / \`allow-issuer\` | \`owner\`, \`issuer\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vaultAuthorizeIssuer\` / \`vaultRevokeIssuerViaApi\` | routes alias de rétrocompatibilité (authorize = allow, revoke = deny) | identiques à ci-dessus |
| \`vaultRevokeVault\` | \`/contracts/vault/revoke-vault\` | \`owner\`, \`sourcePublicKey\`, \`userSalt?\` |
| \`vaultSetNewOwner\` | \`/contracts/vault/set-new-owner\` | \`owner\`, \`newOwner\`, \`sourcePublicKey\` |
| \`vaultSetDid\` | \`/contracts/vault/set-vault-did\` | \`owner\`, \`didUri\`, \`sourcePublicKey?\`, \`userSalt?\`, \`vaultContract?\` |
| \`vaultPush\` | \`/contracts/vault/push\` | \`fromOwner\`, \`toOwner\`, \`vcId\`, \`issuer\`, \`sourcePublicKey\` |
| \`sponsoredVaultCreate\` | \`/contracts/sponsored-vault/create\` | \`sponsor\`, \`owner\`, \`didUri\`, \`sourcePublicKey\` (**clé d'API admin requise**) |

## Exemple manuel de prepare/submit

Les hooks orchestrent ce cycle pour vous ; avec le client, vous le pilotez vous-même :

\`\`\`ts
import { isTxPrepareResponse, isTxSubmitResponse } from "@acta-team/credentials";

// 1. Prepare
const prepared = await client.vaultSetDid({
  owner: "G...",
  didUri: "did:stellar:testnet:...",
  sourcePublicKey: "G...",
});
if (!isTxPrepareResponse(prepared)) throw new Error("prepare failed");

// 2. Signer avec n'importe quel wallet Stellar
const signedXdr = await signTransaction(prepared.xdr, {
  networkPassphrase: prepared.network,
});

// 3. Submit
const result = await client.vaultSetDid({ signedXdr });
if (isTxSubmitResponse(result)) console.log(result.tx_id);
\`\`\`

## Méthodes dépréciées

\`createCredential\`, \`getDefaults\`, \`prepareStoreTx\`, \`prepareListVcIdsTx\`, \`prepareGetVcTx\` et \`vaultStore\` sont des stubs dépréciés dont la suppression est prévue en **2.0.0**. Migrez vers \`vcIssue\`, \`getConfig\`, \`vaultListVcIdsDirect\` et \`vaultGetVcDirect\`.
    `,
};
