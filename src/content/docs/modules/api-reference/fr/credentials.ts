import type { DocPage } from "@/@types/docs";

export const credentials: DocPage = {
  slug: "api-credentials",
  title: "Opérations de Credentials",
  section: "Référence API",
  tocItems: [
    "Émettre un credential",
    "Émission par lot",
    "Révoquer un credential",
    "Exigence de DID émetteur",
    "Frais",
    "Corps de la requête",
    "Flux Prepare/Submit",
  ],
  content: `
# Opérations de Credentials

Endpoints pour émettre et révoquer des verifiable credentials. Tous prennent en charge le flux prepare/submit et **tous exigent une API key** (\`X-ACTA-Key\`). **Émettre un credential** (\`POST /contracts/vc/issue\`) et **Émission par lot** (\`POST /contracts/vc/batch-issue\`) exigent en plus que \`owner\` corresponde au wallet lié à votre API key (les clés de rôle admin sont exemptées).

## Émettre un credential

### POST /contracts/vc/issue

Émet un VC : stocke la charge utile dans le coffre du propriétaire et écrit le statut d'émission = valid. **Requiert une API key.**

**En-têtes :**

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\",\\"name\\":\\"John Doe\\"}}",
  "issuer": "G...",
  "issuerDid": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

Le **titulaire** du credential est identifié par \`credentialSubject.id\` (un DID) à l'intérieur de \`vcData\`. Il n'existe pas de champ \`holder\` séparé.

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

**Exemple :**

\`\`\`bash
# Prepare
curl -X POST https://api.testnet.acta.build/contracts/vc/issue \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "owner": "G...",
    "vcId": "credential-123",
    "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\",\\"https://www.w3.org/ns/credentials/examples/v2\\"],\\"type\\":[\\"VerifiableCredential\\"]}",
    "issuer": "G...",
    "issuerDid": "did:stellar:...",
    "sourcePublicKey": "G..."
  }'

# Submit (after signing)
curl -X POST https://api.testnet.acta.build/contracts/vc/issue \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "signedXdr": "AAAA..."
  }'
\`\`\`

## Émission par lot

### POST /contracts/vc/batch-issue

Émet plusieurs VCs dans le coffre du même propriétaire en une seule transaction. Chaque entrée ne porte que \`vcId\` et \`vcData\` ; le titulaire de chaque credential est \`credentialSubject.id\` à l'intérieur de son propre \`vcData\` (il n'y a **pas** de champ \`holder\`). **Requiert une API key.**

**Limites :** 1 à 5 credentials par lot (\`MAX_BATCH_SIZE\` = 5) ; \`vcId\` jusqu'à 64 caractères ; \`vcData\` jusqu'à 10 000 caractères. Les dépasser renvoie \`400 batch_too_large\`, \`400 vcs[i].vcId_too_long\` ou \`400 vcs[i].vcData_too_long\`.

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "issuer": "G...",
  "issuerDid": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G...",
  "vcs": [
    {
      "vcId": "credential-1",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\"}}"
    },
    {
      "vcId": "credential-2",
      "vcData": "{\\"@context\\":[\\"https://www.w3.org/ns/credentials/v2\\"],\\"type\\":[\\"VerifiableCredential\\"],\\"credentialSubject\\":{\\"id\\":\\"did:stellar:...\\"}}"
    }
  ]
}
\`\`\`

**Corps de la requête (Submit) :**

\`\`\`json
{
  "signedXdr": "AAAA..."
}
\`\`\`

**Réponses :** Prepare renvoie \`{ xdr, network }\` ; Submit renvoie \`{ tx_id }\`.

## Révoquer un credential

### POST /contracts/vc/revoke

Révoque un VC par identifiant dans le coffre d'un propriétaire spécifique. Requiert une API key. La transaction doit être signée par le **propriétaire du coffre** (le contrat impose \`owner.require_auth()\`).

**Corps de la requête (Prepare) :**

\`\`\`json
{
  "owner": "G...",
  "vcId": "credential-123",
  "date": "2024-01-15T00:00:00.000Z",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

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

## Exigence de DID émetteur

Le \`issuerDid\` doit être un **\`did:stellar\`** enregistré et résoluble. Les adresses de wallet brutes et les valeurs \`did:pkh\` **ne sont plus acceptées**. L'API applique une liaison contrôleur-DID : le contrôleur on-chain du DID doit être égal à l'\`issuer\` signataire. S'ils diffèrent, la requête échoue avec :

\`\`\`json
{
  "error": "issuerDid_controller_mismatch",
  "message": "The issuer DID controller does not match the signing issuer"
}
\`\`\`

## Frais

L'émission prélève des **frais on-chain** calculés par le coffre via le \`quote_fee\` de la factory et **payés par l'émetteur** (mainnet : 1 USDC par credential ; testnet : 5 XLM). L'API n'accepte **pas** de surcharge des frais : il existe un seul tarif standard plus un tarif personnalisé optionnel par émetteur, tous deux résolus on-chain.

## Corps de la requête

### Émettre un credential

- **owner** (requis) : adresse du propriétaire du coffre (G...)
- **vcId** (requis) : identifiant du credential (max 64 caractères)
- **vcData** (requis) : charge utile du credential (chaîne JSON, max 10 000 caractères). Doit inclure \`@context\` avec au moins \`"https://www.w3.org/ns/credentials/v2"\`, et \`credentialSubject.id\` (le DID du titulaire). L'API chiffre \`vcData\` (AES-256-GCM) avant son stockage on-chain
- **issuer** (requis) : adresse de l'émetteur (G...)
- **issuerDid** (requis) : \`did:stellar\` enregistré et résoluble dont le contrôleur on-chain est égal à \`issuer\`
- **userSalt** (optionnel) : sel de 32 octets sélectionnant le coffre du propriétaire ; 32 octets à zéro par défaut
- **sourcePublicKey** (requis) : source de la transaction qui signera (doit être l'émetteur)

### Émission par lot

- **owner** (requis) : adresse du propriétaire du coffre (G...)
- **issuer** (requis) : adresse de l'émetteur (G...)
- **issuerDid** (requis) : \`did:stellar\` enregistré et résoluble dont le contrôleur on-chain est égal à \`issuer\`
- **vcs** (requis) : tableau de \`{ vcId, vcData }\`. Chaque \`vcData\` porte son propre DID de titulaire \`credentialSubject.id\`
- **userSalt** (optionnel) : sel de 32 octets sélectionnant le coffre du propriétaire
- **sourcePublicKey** (requis) : source de la transaction qui signera (doit être l'émetteur)

### Révoquer un credential

- **owner** (requis) : adresse du propriétaire du coffre (G...) dont le coffre contient le credential
- **vcId** (requis) : identifiant du credential
- **date** (optionnel) : timestamp ISO-8601 (par défaut : maintenant)
- **userSalt** (optionnel) : sel de 32 octets sélectionnant le coffre du propriétaire
- **sourcePublicKey** (requis) : source de la transaction qui signera (doit être le propriétaire du VC ou l'admin du contrat)

## Flux Prepare/Submit

1. **Prepare** : envoyez la requête avec les paramètres de l'opération (sans \`signedXdr\`)
2. **Sign** : signez le \`xdr\` renvoyé avec votre wallet Stellar en utilisant la passphrase \`network\`
3. **Submit** : envoyez la requête avec \`signedXdr\` pour exécuter

**Note :** \`issue\` stocke le credential dans le coffre et le marque comme valide en une seule transaction.
    `,
};
