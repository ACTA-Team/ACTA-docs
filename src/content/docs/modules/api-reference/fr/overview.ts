import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "api-overview",
  title: "Aperçu",
  section: "Référence API",
  tocItems: [
    "Architecture",
    "URLs de base",
    "Authentification",
    "Format de requête",
    "Format de réponse",
    "Flux Prepare/Submit",
    "Frais",
    "Exigence de DID émetteur",
    "Configuration réseau",
    "Gestion des erreurs",
    "Rate limiting",
    "Idempotence",
    "Essayer dans Swagger",
  ],
  content: `
# Aperçu de la Référence API

API RESTful pour la gestion des credentials ACTA sur la blockchain Stellar. Tous les endpoints prennent en charge les réseaux mainnet et testnet.

## Architecture

Les coffres ACTA sont **mono-locataires** (single-tenant) : chaque propriétaire possède son propre contrat \`vc-vault\`. Les coffres sont déployés de manière déterministe par une unique **\`vc-vault-factory\`** par réseau. Le déploiement étant déterministe, l'API et le SDK dérivent l'adresse du coffre d'un propriétaire à partir de \`(factory, owner, userSalt)\` sans la stocker - vous ne transmettez que l'\`owner\`.

- **\`userSalt\`** (optionnel) : sel de 32 octets qui distingue plusieurs coffres pour un même propriétaire. La valeur par défaut est **32 octets à zéro**, ce qui donne un coffre canonique par propriétaire. Ne passez un \`userSalt\` différent que si vous exploitez intentionnellement plus d'un coffre par propriétaire.
- **\`vaultContract\`** (optionnel, lectures) : l'identifiant du contrat de coffre résolu (\`C...\`). S'il est omis, l'API le résout à partir de \`owner\` (et \`userSalt\`) via la factory. Utilisez-le pour éviter la résolution si vous connaissez déjà l'adresse.

La plupart des endpoints prennent \`owner\` (et éventuellement \`userSalt\`). Il n'existe pas de surcharge \`contractId\` du coffre par requête : la factory est responsable du déploiement et de la dérivation d'adresse.

## URLs de base

**Testnet :**

\`\`\`
https://sandbox-api.acta.build
\`\`\`

**Mainnet :**

\`\`\`
https://production-api.acta.build
\`\`\`

## Authentification

**Les routes de contrat** (\`/contracts/*\` - lecture/écriture de coffre, coffre sponsorisé, opérations VC, version du contrat, etc.) exigent une API key valide à chaque requête. Envoyez-la dans l'en-tête de la requête :

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

\`X-ACTA-Key\` est l'en-tête canonique ; \`x-api-key\` et \`Authorization: Bearer <key>\` sont également acceptés. Les API keys sont des chaînes hexadécimales de 64 caractères (sans préfixe).

**Les routes publiques** ne nécessitent aucune API key : \`GET /health\` et \`GET /config\`. Tout le reste exige une clé.

**Contrôle de propriété :** les endpoints qui lisent ou déplacent les données de credential d'un titulaire (\`/contracts/vault/list-vc-ids\`, \`/contracts/vault/get-vc\`, \`/contracts/vault/push\`) exigent que l'\`owner\` (ou le \`fromOwner\`) de la requête corresponde à la \`wallet_address\` liée à votre API key. Les clés de rôle admin en sont exemptées. \`verify-vc\` est volontairement ouvert à toute clé valide afin que des tiers puissent vérifier des credentials.

**Contrôle de l'émetteur :** \`/contracts/vc/issue\` et \`/contracts/vc/batch-issue\` lient l'**\`issuer\`** à la place (ainsi que le \`sourcePublicKey\`, s'il est envoyé). L'\`owner\` est le destinataire et reste délibérément sans restriction, vous pouvez donc émettre vers n'importe qui. Lier le destinataire, comme le faisaient ces routes auparavant, revenait à ne pouvoir émettre que vers vous-même.

L'émission est de toute façon autorisée on-chain : \`issue\` appelle \`issuer_addr.require_auth()\`, donc aucune API key ne peut émettre au nom d'un portefeuille sans la signature de celui-ci.

**Scopes :** une clé peut porter des scopes qui restreignent ce qu'elle peut faire : \`credentials:issue\`, \`credentials:read\`, \`credentials:revoke\`, \`vault:write\`, \`vault:admin\`, \`sponsor\`. Ils se choisissent à la création de la clé, par exemple une intégration qui émet mais ne peut jamais lire le contenu d'un coffre. Une clé sans scopes n'est pas restreinte, donc toute clé émise avant leur existence continue de fonctionner. Un scope manquant renvoie \`403 insufficient_scope\`.

**Contrôle du sponsor :** \`POST /contracts/sponsored-vault/create\` est ouvert aux clés standard, mais le \`sponsor\` (et le \`sourcePublicKey\`, s'il est envoyé) doit correspondre à la \`wallet_address\` liée à votre API key, de sorte que vous ne puissiez payer un déploiement qu'avec votre propre compte. L'\`owner\` reste délibérément sans restriction : sponsoriser le coffre de quelqu'un d'autre est la raison d'être de cet endpoint.

**Rôle admin :** les mutations de l'issuer-registry (\`POST\`, \`PATCH\` et \`DELETE\` sous \`/contracts/issuer-registry/\`) exigent une clé avec le rôle **admin**. Tous les autres endpoints documentés ici acceptent une clé standard.

### Obtenir une API Key

Créez-en une depuis la [dApp ACTA](https://dapp.acta.build/) en connectant votre portefeuille Stellar et en vous connectant. La clé est liée à ce portefeuille, porte le rôle standard et n'expire pas. Voir [Clés API](/docs/api-keys) pour le détail.

## Format de requête

Toutes les requêtes utilisent le format JSON. L'en-tête Content-Type doit être \`application/json\`.

### Opérations d'écriture (Prepare/Submit)

Les opérations d'écriture prennent en charge deux modes :

1. **Prepare** : envoyez la requête sans \`signedXdr\` → renvoie un XDR non signé
2. **Submit** : envoyez la requête avec \`signedXdr\` → exécute la transaction

Exemple de requête prepare :

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "...",
  "issuer": "G...",
  "sourcePublicKey": "G..."
}
\`\`\`

Exemple de requête submit :

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

## Format de réponse

### Réponse de succès

Le mode prepare renvoie un XDR non signé + la passphrase du réseau :

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

Le mode submit renvoie l'identifiant de la transaction :

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

### Réponse d'erreur

\`\`\`json
{
  "error": "error_code",
  "message": "Human readable error message"
}
\`\`\`

## Flux Prepare/Submit

1. **Prepare** : appelez l'endpoint avec les paramètres de l'opération (sans \`signedXdr\`)
2. **Sign** : signez le \`xdr\` renvoyé avec votre wallet Stellar en utilisant la passphrase \`network\`
3. **Submit** : appelez le même endpoint avec \`signedXdr\` pour exécuter

## Frais

Les frais d'émission sont prélevés **on-chain par le coffre** via le \`quote_fee\` de la factory. Les frais sont payés par l'**émetteur** au moment de l'émission (mainnet : 1 USDC par credential ; testnet : 5 XLM par credential). L'API **n'accepte plus de surcharge des frais** dans aucun corps de requête. Il n'y a pas de paliers de frais par rôle : il existe un seul tarif standard plus un tarif personnalisé optionnel par émetteur, tous deux résolus on-chain.

## Exigence de DID émetteur

L'émetteur doit être un **\`did:stellar\`** enregistré et résoluble. Les adresses de wallet brutes et les valeurs \`did:pkh\` **ne sont plus acceptées** comme DID émetteur. L'API applique une liaison contrôleur-DID : le contrôleur on-chain du DID doit être égal à l'émetteur signataire, sinon la requête échoue avec l'erreur \`issuerDid_controller_mismatch\`.

Le **titulaire** du credential est exprimé dans \`vcData\` sous la forme \`credentialSubject.id\` (un DID). Il n'existe pas de champ \`holder\` ni de champ wallet séparé dans les requêtes d'émission.

## Configuration réseau

### GET /config

Renvoie la configuration réseau publique. **Aucune API key requise** et aucun rate limit : c'est l'endpoint public de bootstrap que les SDKs appellent une fois par session.

**Réponse :**

\`\`\`json
{
  "rpcUrl": "https://soroban-testnet.stellar.org:443",
  "networkPassphrase": "Test SDF Network ; September 2015",
  "networkType": "testnet",
  "factoryContractId": "C...",
  "vaultWasmHash": "2bd0323a...",
  "didStellarRegistryId": "C...",
  "actaContractId": "C..."
}
\`\`\`

- **factoryContractId** : l'identifiant du contrat \`vc-vault-factory\` pour ce réseau.
- **networkType** : \`testnet\` ou \`mainnet\`.
- **vaultWasmHash** : le hash WASM du template \`vc-vault\` déployé par la factory.
- **didStellarRegistryId** : l'identifiant du contrat de registre \`did:stellar\` utilisé pour résoudre les DIDs émetteurs.
- **actaContractId** : alias de rétrocompatibilité de \`factoryContractId\`.

## Gestion des erreurs

Toutes les erreurs renvoient un JSON avec :
- \`error\` : identifiant du code d'erreur
- \`message\` : description lisible de l'erreur

Codes de statut HTTP courants :
- \`200\` : Succès
- \`400\` : Requête invalide (paramètres invalides)
- \`401\` : Non autorisé (API key manquante ou invalide)
- \`403\` : Interdit (permissions insuffisantes)
- \`404\` : Introuvable
- \`429\` : Rate limit dépassé
- \`500\` : Erreur interne du serveur

## Rate limiting

Les endpoints authentifiés sont soumis à un rate limit **par API key** sur une fenêtre glissante de 60 secondes, avec des compartiments de lecture et d'écriture séparés qui dépendent du rôle de la clé :

| Rôle | Lectures / min | Écritures / min |
|------|----------------|-----------------|
| standard | 60 | 20 |
| early | 300 | 100 |
| admin | 200 | 50 |

- En-têtes de réponse : \`X-RateLimit-Limit\` / \`X-RateLimit-Remaining\` (lectures), \`X-WriteRateLimit-*\` (écritures), et \`Retry-After\` sur \`429\` (\`rate_limit_exceeded\` / \`write_rate_limit_exceeded\`)

## Idempotence

Les routes d'écriture de contrat acceptent un en-tête optionnel \`Idempotency-Key\` (jusqu'à 200 caractères). La première réponse pour une clé donnée est mise en cache pendant 24 heures et rejouée lors des nouvelles tentatives avec l'en-tête \`Idempotency-Replayed: true\` - utile pour réessayer des submits en toute sécurité.

## Essayer dans Swagger

Utilisez **[Swagger UI (testnet)](https://sandbox-api.acta.build/docs)** pour parcourir la spécification OpenAPI, inspecter les schémas de requête et de réponse, et exécuter des requêtes **Try it out** dans le navigateur pour les endpoints qui le permettent.

1. Ouvrez **[https://sandbox-api.acta.build/docs](https://sandbox-api.acta.build/docs)**
2. Dépliez une opération, examinez les paramètres et les exemples, puis utilisez **Try it out** lorsque c'est activé
3. Pour les routes qui exigent une API key, définissez l'en-tête **\`X-ACTA-Key\`** (ou utilisez le contrôle **Authorize** de Swagger lorsqu'il est disponible) après avoir créé une clé (voir **Obtenir une API Key** ci-dessus)

> Swagger UI est disponible sur **testnet uniquement** : sur les instances mainnet, toutes les routes \`/docs\` sont désactivées et renvoient 404. Utilisez testnet pour l'exploration et les mêmes chemins vers \`https://production-api.acta.build\` en production.
    `,
};
