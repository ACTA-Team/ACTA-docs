import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "api-sponsored-vault",
  title: "Coffre sponsorisé",
  section: "Référence API",
  tocItems: [
    "Concept",
    "On-chain (vc-vault-factory)",
    "API HTTP",
    "Prepare / submit",
    "Notes opérationnelles",
  ],
  content: `
# Coffre sponsorisé

Un **coffre sponsorisé** est un coffre ACTA mono-locataire normal, déployé via **\`deploy_sponsored\`** sur le contrat **vc-vault-factory**. Le **sponsor** invoque la factory et doit satisfaire l'auth Soroban (\`sponsor.require_auth()\`) ; le **propriétaire** est l'admin du coffre et ne signe pas cette transaction. Utilisez ce mode lorsqu'une organisation paie les frais ou orchestre l'onboarding, tandis que l'utilisateur final ne fait que recevoir le coffre.

À titre de comparaison, \`POST /contracts/vault/create\` prépare le déploiement du propriétaire lui-même via la factory, où c'est généralement le **propriétaire** qui signe. Le flux sponsorisé utilise \`POST /contracts/sponsored-vault/create\` ; l'invoke doit satisfaire l'auth on-chain pour **sponsor** - en pratique, le XDR préparé est généralement signé par le compte sponsor (voir **sourcePublicKey** ci-dessous).

## Concept

| Rôle | Responsabilité |
|------|----------------|
| **Sponsor** | Signe la transaction. Paie le réseau/les frais comme pour tout invoke. |
| **Propriétaire** | Reçoit le coffre ; adresse stockée comme admin du coffre ; \`didUri\` stocké pour le coffre. |

**Sponsoring ouvert on-chain, restreint aux admins en HTTP :** sur le contrat, toute adresse sponsor peut appeler \`deploy_sponsored\` pour un propriétaire (sous réserve de l'auth et des frais Stellar/Soroban) - il n'y a ni liste d'autorisation de sponsors ni interrupteur d'ouverture à tous. La route de l'API ACTA, en revanche, exige une **API key de rôle admin** (voir ci-dessous).

La factory dérive l'adresse du coffre de manière déterministe à partir de \`(factory, owner, userSalt)\`, si bien qu'un déploiement sponsorisé et un déploiement en libre-service pour le même propriétaire + sel résolvent le même coffre. Appeler à nouveau le déploiement pour un propriétaire qui possède déjà un coffre à ce sel échoue on-chain (déjà déployé).

En cas de succès, la factory émet un événement de déploiement de coffre avec le \`sponsor\`, l'\`owner\` et le \`did_uri\`.

## On-chain (vc-vault-factory)

Le point d'entrée pertinent de la factory est :

| Function | Auth | Description |
|----------|------|-------------|
| \`deploy_sponsored(deployer, owner, did_uri, user_salt)\` | Deployer (sponsor) | Déploie de manière déterministe le coffre du propriétaire s'il n'est pas déjà déployé à ce sel. |

Le champ de requête \`sponsor\` de l'API correspond au paramètre \`deployer\` du contrat.

**HTTP public :** l'API ACTA ne documente que **\`POST /contracts/sponsored-vault/create\`** (prepare/submit pour \`deploy_sponsored\`).

## API HTTP

Cette route exige une **API key avec le rôle admin** (en-tête \`X-ACTA-Key\`) et est soumise à un rate limit par clé. Les clés standard reçoivent \`403\`. Préfixez les chemins avec l'URL de base de votre réseau (par exemple \`https://api.testnet.acta.build\`).

> **Obtenir une clé admin :** les clés admin ne sont pas en libre-service ; elles sont provisionnées par l'équipe ACTA. Contactez-nous via le **[Support](doc:support)** ou [Discord](https://discord.gg/DsUSE3aMDZ) si votre organisation a besoin d'un onboarding sponsorisé.

### POST /contracts/sponsored-vault/create

Prépare ou soumet \`deploy_sponsored\`.

**Corps prepare :**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **sponsor** (requis) : adresse Stellar passée à la factory comme sponsor (doit satisfaire \`sponsor.require_auth()\` lorsque la transaction est signée et soumise).
- **owner** (requis) : propriétaire du coffre (\`G...\`).
- **didUri** (requis) : URI du DID stocké pour le coffre.
- **userSalt** (optionnel) : sel de 32 octets sélectionnant le coffre du propriétaire ; 32 octets à zéro par défaut (un coffre canonique par propriétaire).
- **sourcePublicKey** (requis) : compte Stellar utilisé comme **source de la transaction** lorsque l'API prépare le XDR. L'invoke signé doit tout de même autoriser **sponsor** sur le contrat ; en général, le compte sponsor est à la fois \`sponsor\` et le compte signataire/source.

**Corps submit :** \`{ "signedXdr": "AAAA..." }\`

**Réponses :** Prepare renvoie \`{ "xdr", "network" }\` ; Submit renvoie \`{ "tx_id" }\`.

## Prepare / submit

Cet endpoint d'écriture suit le flux standard en deux étapes :

1. **Prepare** - un JSON avec les champs de l'opération (sans \`signedXdr\`) renvoie \`xdr\` + la passphrase \`network\`.
2. **Sign** - le wallet Stellar signe le XDR afin de satisfaire les exigences d'auth du sponsor.
3. **Submit** - un POST sur le même chemin avec \`{ "signedXdr" }\` renvoie \`tx_id\`.

## Notes opérationnelles

- Évitez d'appeler **create** lorsque le propriétaire possède déjà un coffre au \`userSalt\` choisi ; le déploiement on-chain échoue si le coffre existe déjà. Privilégiez d'abord une lecture on-chain ou via l'API de l'existence du coffre (voir les opérations de lecture de coffre).
- Les frais d'émission sont prélevés on-chain par le coffre (via le \`quote_fee\` de la factory) et payés par l'émetteur au moment de l'émission, indépendamment de qui a sponsorisé le déploiement du coffre.
    `,
};
