import type { DocPage } from "@/@types/docs";

export const actaClient: DocPage = {
  slug: "actaClient",
  title: "ActaClient",
  section: "Credentials SDK",
  tocItems: [
    "Getting the client",
    "Constructor & configuration",
    "Info & config",
    "Issuer identity",
    "Read methods",
    "Write methods (prepare/submit)",
    "Manual prepare/submit example",
    "Deprecated methods",
  ],
  content: `
# ActaClient

\`ActaClient\` is the HTTP client underneath every hook. Use it directly when you need methods the hooks do not wrap (\`vaultSetDid\`, \`vaultPush\`, \`vaultSetNewOwner\`, \`sponsoredVaultCreate\`), when you want manual control of the prepare/submit steps, or outside React.

## Getting the client

Inside React, take the contextual client (it shares the provider's \`baseURL\` and API key):

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient(); // must be under <ActaConfig>
\`\`\`

Outside React, construct it directly:

\`\`\`ts
import { ActaClient, testNet } from "@acta-team/credentials";

const client = new ActaClient(testNet, process.env.ACTA_API_KEY);
\`\`\`

## Constructor & configuration

\`\`\`ts
new ActaClient(baseURL, apiKey?, identityOptions?)
\`\`\`

- **Network** is inferred from the URL (\`mainnet\` in the host means mainnet, otherwise testnet).
- **API key resolution**: the explicit \`apiKey\` argument wins; otherwise the network-specific env var (\`ACTA_API_KEY_MAINNET\` / \`ACTA_API_KEY_TESTNET\`), then \`ACTA_API_KEY\`. Construction throws if no key is found. The key is sent as \`X-ACTA-Key\` on every request.
- Requests time out after **30 seconds** and every failure rejects with an **\`ActaApiError\`** (\`status\`, \`code\`, \`requestId?\`, \`isTimeout\`, \`isNetworkError\`).

\`identityOptions\` (\`ActaClientIdentityOptions\`) tunes the DID auto-onboarding layer:

| Option | Default | Purpose |
|--------|---------|---------|
| \`storage\` | IndexedDB (browser) / in-memory (Node) | Where issuer identities persist; servers should supply a persistent \`IssuerIdentityStorage\` |
| \`rpcUrl\` | Network default | Stellar RPC for DID registration |
| \`registryContractId\` | Network default | did:stellar registry override |
| \`allowHttp\` | false | Allow non-HTTPS RPC (local dev) |
| \`timeoutMs\` | 30000 | Identity-flow timeout |
| \`configCacheTtlMs\` | 300000 | \`getConfig()\` cache TTL |

## Info & config

| Method | Returns |
|--------|---------|
| \`getNetwork()\` | \`"mainnet"\` or \`"testnet"\` |
| \`getHealth()\` | \`GET /health\` result |
| \`getConfig()\` | \`GET /config\` result, cached ~5 minutes (\`rpcUrl\`, \`networkPassphrase\`, \`networkType\`, \`factoryContractId\`, \`vaultWasmHash\`, \`didStellarRegistryId\`, \`actaContractId\`) |
| \`clearConfigCache()\` | Drops the cached config |

## Issuer identity

| Method | Purpose |
|--------|---------|
| \`getOrCreateIssuerIdentity({ controller, signTransaction })\` | Returns the stored identity or mints + registers a new did:stellar (one wallet signature) |
| \`getIssuerIdentity(controller)\` | Returns the stored identity or \`null\`, never registers |

## Read methods

| Method | Endpoint |
|--------|----------|
| \`vaultListVcIdsDirect({ owner, contractId? })\` | \`POST /contracts/vault/list-vc-ids\` |
| \`vaultGetVcDirect({ owner, vcId, contractId? })\` | \`POST /contracts/vault/get-vc\` |
| \`vaultVerify({ owner, vcId, vaultContractId? })\` | \`POST /contracts/vault/verify-vc\` |
| \`getContractVersion({ owner?, sourcePublicKey?, contractId? })\` | \`GET /contracts/version\` |

## Write methods (prepare/submit)

Every write accepts a union payload: the **prepare** object (operation fields) or \`{ signedXdr }\` to **submit**. The return type is \`TxResponse\` = \`{ xdr, network }\` (prepare) or \`{ tx_id }\` (submit); use the exported guards \`isTxPrepareResponse\` / \`isTxSubmitResponse\` to tell them apart.

| Method | Endpoint | Prepare fields |
|--------|----------|----------------|
| \`vaultCreate\` | \`/contracts/vault/create\` | \`owner\`, \`didUri\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vcIssue\` | \`/contracts/vc/issue\` | \`owner\`, \`vcId\`, \`vcData\`, \`issuer\`, \`issuerDid?\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`revokeCredentialViaApi\` | \`/contracts/vc/revoke\` | \`owner\`, \`vcId\`, \`date?\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vaultDenyIssuer\` / \`vaultAllowIssuer\` | \`/contracts/vault/deny-issuer\` / \`allow-issuer\` | \`owner\`, \`issuer\`, \`sourcePublicKey?\`, \`userSalt?\` |
| \`vaultAuthorizeIssuer\` / \`vaultRevokeIssuerViaApi\` | back-compat alias routes (authorize = allow, revoke = deny) | same as above |
| \`vaultRevokeVault\` | \`/contracts/vault/revoke-vault\` | \`owner\`, \`sourcePublicKey\`, \`userSalt?\` |
| \`vaultSetNewOwner\` | \`/contracts/vault/set-new-owner\` | \`owner\`, \`newOwner\`, \`sourcePublicKey\` |
| \`vaultSetDid\` | \`/contracts/vault/set-vault-did\` | \`owner\`, \`didUri\`, \`sourcePublicKey?\`, \`userSalt?\`, \`vaultContract?\` |
| \`vaultPush\` | \`/contracts/vault/push\` | \`fromOwner\`, \`toOwner\`, \`vcId\`, \`issuer\`, \`sourcePublicKey\` |
| \`sponsoredVaultCreate\` | \`/contracts/sponsored-vault/create\` | \`sponsor\`, \`owner\`, \`didUri\`, \`sourcePublicKey\` (**admin API key required**) |

## Manual prepare/submit example

The hooks do this dance for you; with the client you drive it yourself:

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

## Deprecated methods

\`createCredential\`, \`getDefaults\`, \`prepareStoreTx\`, \`prepareListVcIdsTx\`, \`prepareGetVcTx\`, and \`vaultStore\` are deprecated stubs scheduled for removal in **2.0.0**. Migrate to \`vcIssue\`, \`getConfig\`, \`vaultListVcIdsDirect\`, and \`vaultGetVcDirect\`.
    `,
};
