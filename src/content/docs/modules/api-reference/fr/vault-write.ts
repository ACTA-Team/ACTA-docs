import type { DocPage } from "@/@types/docs";

export const vaultWrite: DocPage = {
  slug: "api-vault-write",
  title: "Opérations de Coffre (Écriture)",
  section: "Référence API",
  tocItems: [
    "Créer un coffre",
    "Bloquer un émetteur",
    "Autoriser un émetteur",
    "Définir le DID du coffre",
    "Pousser un credential",
    "Révoquer le coffre",
    "Définir un nouveau propriétaire",
    "Coffre sponsorisé",
    "Flux Prepare/Submit",
  ],
  content: `
# Opérations de Coffre (Écriture)

Opérations d'écriture pour la gestion des coffres. Tous les endpoints prennent en charge le flux prepare/submit. **Authentification :** identique aux autres routes \`/contracts/*\` - une \`X-ACTA-Key\` valide (voir l'Aperçu de l'API).

Les coffres sont **mono-locataires** : chaque propriétaire possède son propre contrat \`vc-vault\`, déployé de manière déterministe par la \`vc-vault-factory\`. Vous identifiez le coffre par \`owner\` (plus un \`userSalt\` optionnel) ; il n'existe pas de surcharge \`contractId\` du coffre par requête.

## Créer un coffre

### POST /contracts/vault/create

Déploie (et initialise) le coffre du propriétaire **via la factory**. La factory dérive l'adresse du coffre de manière déterministe à partir de \`(factory, owner, userSalt)\`, de sorte que le même propriétaire + sel correspond toujours au même coffre.

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **owner** (requis) : adresse du propriétaire du coffre (G...).
- **didUri** (requis) : URI du DID stocké pour le propriétaire du coffre.
- **userSalt** (optionnel) : sel de 32 octets sélectionnant le coffre de ce propriétaire. 32 octets à zéro par défaut (un coffre canonique par propriétaire).
- **sourcePublicKey** (requis) : source de la transaction qui signe le XDR préparé.

**Corps de la requête (Submit) :**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Réponse (Prepare) :**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Réponse (Submit) :**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Bloquer un émetteur

### POST /contracts/vault/deny-issuer

L'émission est **ouverte par défaut** : tout émetteur peut écrire dans le coffre tant que le propriétaire ne l'a pas bloqué. **Bloquer un émetteur** bloque un émetteur spécifique (l'ajoute à l'ensemble des émetteurs bloqués du coffre).

> **Rétrocompatibilité :** \`POST /contracts/vault/revoke-issuer\` reste disponible comme alias de cette route (revoke → deny).

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

**Réponse (Prepare) :**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Réponse (Submit) :**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Autoriser un émetteur

### POST /contracts/vault/allow-issuer

Débloque un émetteur précédemment bloqué (le retire de l'ensemble des émetteurs bloqués du coffre). L'émission étant ouverte par défaut, ceci ne sert qu'à annuler un **Bloquer un émetteur** antérieur.

> **Rétrocompatibilité :** \`POST /contracts/vault/authorize-issuer\` reste disponible comme alias de cette route (authorize → allow).

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

**Réponse (Prepare) :**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Réponse (Submit) :**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Définir le DID du coffre

### POST /contracts/vault/set-vault-did

Met à jour l'URI du DID stocké pour le coffre du propriétaire. Signé par le **propriétaire du coffre**.

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

**Réponses :** Prepare renvoie \`{ xdr, network }\` ; Submit (\`{ "signedXdr": "..." }\`) renvoie \`{ tx_id }\`.

## Pousser un credential

### POST /contracts/vault/push

Déplace un credential d'un coffre déployé par la factory vers un autre coffre **ayant le même propriétaire** (par exemple, entre le coffre canonique d'un propriétaire et un coffre avec sel). Le credential est écrit dans le coffre de destination et supprimé du coffre source. \`fromOwner\` doit correspondre au wallet lié à votre API key.

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "fromOwner": "G...",
  "toOwner": "G...",
  "vcId": "credential-123",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **sourcePublicKey** (requis) : doit être \`fromOwner\` (l'admin du coffre source signe).

**Réponses :** Prepare renvoie \`{ xdr, network }\` ; Submit renvoie \`{ tx_id }\`.

## Révoquer le coffre

### POST /contracts/vault/revoke-vault

Révoque complètement le coffre du propriétaire. **Irréversible** : toutes les écritures dans le coffre sont ensuite bloquées.

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

**Réponse (Prepare) :**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Réponse (Submit) :**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Définir un nouveau propriétaire

### POST /contracts/vault/set-new-owner

Définit le nouveau propriétaire du coffre (admin du coffre). Doit être signé par le propriétaire actuel.

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "new_owner": "G...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

**Réponse (Prepare) :**

\`\`\`json
{
  "xdr": "AAAA...",
  "network": "Test SDF Network ; September 2015"
}
\`\`\`

**Réponse (Submit) :**

\`\`\`json
{
  "tx_id": "abc123..."
}
\`\`\`

## Coffre sponsorisé

Déploiement de coffre dans lequel un **sponsor** invoque \`deploy_sponsored\` sur la **vc-vault-factory** au lieu que le propriétaire déploie son propre coffre. On-chain, le sponsoring est ouvert (toute adresse peut sponsoriser), et la route HTTP **\`POST /contracts/sponsored-vault/create\`** fait de même : toute API key standard peut sponsoriser, à condition que \`sponsor\` soit le portefeuille lié à cette clé.

Voir **Coffre sponsorisé** (\`api-sponsored-vault\`) pour la sémantique du contrat, l'endpoint de création et \`sponsoredVaultCreate\` dans le Credentials SDK.

## Flux Prepare/Submit

Tous les endpoints d'écriture suivent le même schéma :

1. **Prepare** : envoyez la requête avec les paramètres de l'opération (sans \`signedXdr\`)
2. **Sign** : signez le \`xdr\` renvoyé avec votre wallet Stellar en utilisant la passphrase \`network\`
3. **Submit** : envoyez la requête avec \`signedXdr\` pour exécuter

**Paramètres communs :**
- **owner** (requis) : adresse du propriétaire du coffre (G...)
- **userSalt** (optionnel) : sel de 32 octets sélectionnant le coffre du propriétaire ; 32 octets à zéro par défaut (un coffre canonique par propriétaire)
- **sourcePublicKey** (requis) : source de la transaction qui signera (doit être un signataire autorisé)
    `,
};
