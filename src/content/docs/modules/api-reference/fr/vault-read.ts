import type { DocPage } from "@/@types/docs";

export const vaultRead: DocPage = {
  slug: "api-vault-read",
  title: "Opérations de Coffre (Lecture)",
  section: "Référence API",
  tocItems: [
    "Authentification et propriété",
    "Lister les IDs de VC",
    "Nombre de VC",
    "Obtenir un VC",
    "Vérifier un VC",
    "Métadonnées du coffre",
    "Émetteurs bloqués",
    "Nombre d'émetteurs bloqués",
    "Paramètres de requête",
    "Réponses",
  ],
  content: `
# Opérations de Coffre (Lecture)

Opérations en lecture seule sur les données du coffre.

Les lectures identifient le coffre par **\`owner\`** (plus un **\`userSalt\`** optionnel) ; l'API dérive l'adresse du coffre via la factory. Il n'existe pas de surcharge \`contractId\`.

## Authentification et propriété

Tous les endpoints de lecture exigent une API key valide (en-tête \`X-ACTA-Key\`).

- **\`list-vc-ids\`** et **\`get-vc\`** exigent en plus que \`owner\` corresponde à la \`wallet_address\` liée à votre API key (les clés de rôle admin sont exemptées), car ils énumèrent et renvoient le contenu déchiffré des credentials.
- **\`verify-vc\`** et les lectures GET sont ouverts à **toute API key valide**, afin que des tiers puissent vérifier des credentials et lire les métadonnées publiques du coffre.

## Lister les IDs de VC

### POST /contracts/vault/list-vc-ids

Liste les identifiants de verifiable credentials (VC) stockés dans le coffre d'un propriétaire, avec pagination.

**Corps de la requête :**

\`\`\`json
{
  "owner": "G...",
  "offset": 0,
  "limit": 50,
  "userSalt": "00...00"
}
\`\`\`

- \`offset\` (optionnel) : index de départ base zéro, \`0\` par défaut
- \`limit\` (optionnel) : taille de page, \`50\` par défaut, maximum \`200\` (les valeurs supérieures renvoient \`400 limit_too_large\`)

**Réponse :**

\`\`\`json
{
  "result": ["credential-1", "credential-2", "credential-3"],
  "offset": 0,
  "limit": 50
}
\`\`\`

**Exemple :**

\`\`\`bash
curl -X POST https://sandbox-api.acta.build/contracts/vault/list-vc-ids \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G..."
  }'
\`\`\`

## Nombre de VC

### GET /contracts/vault/vc-count

Renvoie le nombre de VCs stockés dans le coffre d'un propriétaire. Utilisez-le pour dimensionner la pagination de \`list-vc-ids\`.

**Paramètres de requête :** \`owner\` (requis), \`userSalt\` (optionnel)

**Réponse :**

\`\`\`json
{
  "count": 3
}
\`\`\`

**Exemple :**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" \\
  "https://sandbox-api.acta.build/contracts/vault/vc-count?owner=G..."
\`\`\`

## Obtenir un VC

### POST /contracts/vault/get-vc

Récupère un verifiable credential spécifique depuis un coffre. Les données du credential sont stockées chiffrées on-chain et déchiffrées par l'API avant d'être renvoyées, c'est pourquoi cet endpoint impose la liaison clé-propriétaire.

**Corps de la requête :**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "00...00"
}
\`\`\`

**Réponse :**

\`\`\`json
{
  "result": {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://www.w3.org/ns/credentials/examples/v2"
    ],
    "type": ["VerifiableCredential"],
    "credentialSubject": {
      "id": "did:stellar:...",
      "name": "John Doe"
    }
  }
}
\`\`\`

**Exemple :**

\`\`\`bash
curl -X POST https://sandbox-api.acta.build/contracts/vault/get-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Vérifier un VC

### POST /contracts/vault/verify-vc

Vérifie un VC en contrôlant qu'il existe dans le coffre du propriétaire et en renvoyant son statut d'émission on-chain. Ouvert à toute API key valide (pas de contrôle de propriété) - c'est l'endpoint utilisé par les vérificateurs tiers.

**Corps de la requête :**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "userSalt": "00...00"
}
\`\`\`

**Réponse :**

\`\`\`json
{
  "status": "valid",
  "since": "2024-01-01T00:00:00.000Z"
}
\`\`\`

Ou si révoqué :

\`\`\`json
{
  "status": "revoked",
  "since": "2024-01-15T00:00:00.000Z"
}
\`\`\`

\`status\` vaut \`"valid"\`, \`"revoked"\` ou \`"invalid"\` (avec \`"unknown"\` comme valeur de repli lorsque le contrat renvoie une forme inattendue).

**Exemple :**

\`\`\`bash
curl -X POST https://sandbox-api.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123"
  }'
\`\`\`

## Métadonnées du coffre

### GET /contracts/vault/:owner

Renvoie les métadonnées du coffre du propriétaire. Accepte un paramètre de requête optionnel \`userSalt\` pour sélectionner un coffre non par défaut.

**Réponse :**

\`\`\`json
{
  "owner": "G...",
  "vault_address": "C...",
  "did_uri": "did:stellar:...",
  "version": "0.4.0",
  "vc_count": 3,
  "denied_issuer_count": 1
}
\`\`\`

**Exemple :**

\`\`\`bash
curl -H "X-ACTA-Key: your_key" \\
  "https://sandbox-api.acta.build/contracts/vault/G..."
\`\`\`

## Émetteurs bloqués

### GET /contracts/vault/issuers/denied

Liste les adresses d'émetteurs actuellement bloqués (denied) pour le coffre du propriétaire, avec pagination. L'émission est ouverte par défaut, il s'agit donc de l'ensemble des exceptions explicites.

**Paramètres de requête :** \`owner\` (requis), \`offset\` (optionnel), \`limit\` (optionnel, max 200), \`userSalt\` (optionnel)

**Réponse :**

\`\`\`json
{
  "issuers": ["G...", "G..."],
  "offset": 0,
  "limit": 50
}
\`\`\`

## Nombre d'émetteurs bloqués

### GET /contracts/vault/issuers/denied/count

Renvoie le nombre d'émetteurs bloqués pour le coffre du propriétaire.

**Paramètres de requête :** \`owner\` (requis), \`userSalt\` (optionnel)

**Réponse :**

\`\`\`json
{
  "count": 1
}
\`\`\`

## Paramètres de requête

Les lectures POST prennent un corps JSON :
- **owner** (requis) : adresse du propriétaire du coffre (G...)
- **vcId** (requis pour get-vc et verify-vc) : identifiant du credential
- **offset** / **limit** (optionnels, list-vc-ids uniquement) : pagination, limit ≤ 200
- **userSalt** (optionnel) : sel de 32 octets (64 caractères hexadécimaux) sélectionnant le coffre du propriétaire ; 32 octets à zéro par défaut (un coffre canonique par propriétaire)

Les lectures GET prennent \`owner\` comme paramètre de requête (ou comme segment de chemin pour les métadonnées du coffre) et acceptent \`userSalt\` comme paramètre de requête.

## Réponses

- **Lister les IDs de VC** : \`{ result, offset, limit }\` où \`result\` est un tableau de chaînes d'identifiants de credentials
- **Nombre de VC** : \`{ count }\`
- **Obtenir un VC** : \`{ result }\` avec les données déchiffrées du credential
- **Vérifier un VC** : \`{ status, since? }\` avec \`status\` "valid" | "revoked" | "invalid"
- **Métadonnées du coffre** : \`{ owner, vault_address, did_uri, version, vc_count, denied_issuer_count }\`
- **Émetteurs bloqués** : \`{ issuers, offset, limit }\` ; **Nombre d'émetteurs bloqués** : \`{ count }\`
    `,
};
