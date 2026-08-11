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

**Sponsoring ouvert, on-chain comme en HTTP :** sur le contrat, toute adresse sponsor peut appeler \`deploy_sponsored\` pour un propriétaire (sous réserve de l'auth et des frais Stellar/Soroban) - il n'y a ni liste d'autorisation de sponsors ni interrupteur d'ouverture à tous. La route de l'API ACTA fait de même : toute **API key standard** peut sponsoriser, en payant avec son propre portefeuille.

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

Cette route accepte toute **API key standard** (en-tête \`X-ACTA-Key\`) et est soumise à un rate limit par clé. Préfixez les chemins avec l'URL de base de votre réseau (par exemple \`https://api.testnet.acta.build\`).

> **Vous ne pouvez sponsoriser qu'avec votre propre compte.** \`sponsor\` doit être la \`wallet_address\` liée à votre API key, et \`sourcePublicKey\`, s'il est envoyé, doit être cette même adresse ; toute autre valeur renvoie \`403\`. Une clé sans portefeuille lié reçoit également \`403\`. Le **propriétaire** reste délibérément sans restriction : payer le coffre de quelqu'un d'autre est précisément la raison d'être de cet endpoint.

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
- **sourcePublicKey** (requis) : compte Stellar utilisé comme **source de la transaction** lorsque l'API prépare le XDR, ce qui en fait le compte qui paie les frais de réseau. Pour les clés standard, il doit être égal à \`sponsor\`, de sorte que le sponsor soit toujours à la fois le compte qui autorise et celui qui paie.

**Corps submit :** \`{ "signedXdr": "AAAA..." }\`

**Réponses :** Prepare renvoie \`{ "xdr", "network" }\` ; Submit renvoie \`{ "tx_id" }\`.

## Prepare / submit

Cet endpoint d'écriture suit le flux standard en deux étapes :

1. **Prepare** - un JSON avec les champs de l'opération (sans \`signedXdr\`) renvoie \`xdr\` + la passphrase \`network\`.
2. **Sign** - le wallet Stellar signe le XDR afin de satisfaire les exigences d'auth du sponsor.
3. **Submit** - un POST sur le même chemin avec \`{ "signedXdr" }\` renvoie \`tx_id\`.

## Notes opérationnelles

- Évitez d'appeler **create** lorsque le propriétaire possède déjà un coffre au \`userSalt\` choisi ; le déploiement on-chain échoue si le coffre existe déjà. Privilégiez d'abord une lecture on-chain ou via l'API de l'existence du coffre (voir les opérations de lecture de coffre).
- **L'adresse du coffre est déterministe, elle peut donc être occupée en premier.** Comme \`(factory, owner, userSalt)\` fixe l'adresse et que le sponsoring est ouvert, n'importe qui peut déployer le coffre canonique d'un propriétaire avant lui, avec le \`didUri\` de son choix. Ce n'est pas une prise de contrôle : le constructeur enregistre le **propriétaire** comme propriétaire et admin du coffre, et \`set_vault_did\` exige son auth, il peut donc corriger le DID. En revanche, le déploiement du propriétaire lui-même peut échouer car l'adresse est déjà prise, et le \`didUri\` initial d'un coffre ne vaut que ce que vaut celui qui l'a déployé. Lisez \`vault_did\` et vérifiez-le avant de le considérer comme celui du propriétaire.
- Les frais d'émission sont prélevés on-chain par le coffre (via le \`quote_fee\` de la factory) et payés par l'émetteur au moment de l'émission, indépendamment de qui a sponsorisé le déploiement du coffre.
    `,
};
