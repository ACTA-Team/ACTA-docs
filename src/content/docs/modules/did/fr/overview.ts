import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "did-overview",
  title: "Aperçu",
  section: "DID",
  tocItems: [
    "Qu'est-ce que did:stellar ?",
    "Syntaxe du DID",
    "Pourquoi le DID n'est pas votre wallet",
    "Modèle de contrôleur",
    "Le document DID",
    "Types de clés",
    "Rôles du DID",
    "Cycle de vie",
    "Proof of Control",
    "Comment ACTA utilise did:stellar",
  ],
  content: `
# did:stellar

**did:stellar** est une méthode d'[identifiant décentralisé (DID) du W3C](https://www.w3.org/TR/did-1.1/) construite sur le réseau **Stellar**. Elle donne à chaque émetteur et titulaire une identité portable et auto-contrôlée dont l'état vit dans un smart contract Soroban (le **did-stellar-registry**), de sorte que n'importe qui peut la résoudre et la vérifier avec un simple endpoint RPC Stellar.

La méthode a été développée par ACTA et est enregistrée dans le **registre W3C DID Extensions** sous la méthode \`stellar\`. C'est l'identité d'émetteur obligatoire pour l'émission de credentials dans ACTA : les adresses de wallet brutes et \`did:pkh\` ne sont pas acceptés.

## Qu'est-ce que did:stellar ?

- **Décentralisé** : la source de vérité est le contrat de registre sur la chaîne, pas un serveur ACTA. Un DID est valide si et seulement s'il est enregistré sur la chaîne.
- **Confiance minimisée** : tout vérificateur peut résoudre n'importe quel \`did:stellar\` avec seulement une URL RPC Stellar et l'identifiant du contrat de registre. Le resolver hébergé sur \`https://did.acta.build\` est une commodité sans état, pas un gardien.
- **Non custodial** : ni le resolver ni les bibliothèques ne détiennent jamais de clés privées. Chaque mutation est signée par le wallet Stellar du contrôleur lui-même.

## Syntaxe du DID

\`\`\`
did:stellar:{network}:{didId}
\`\`\`

| Partie | Règle |
|------|------|
| \`network\` | \`mainnet\` ou \`testnet\` (ensemble fermé, pas d'alias) |
| \`didId\` | 16 octets aléatoires encodés en base32 RFC 4648 **minuscule**, sans padding : exactement 26 caractères de \`[a-z2-7]\` |

La regex de validation canonique est :

\`\`\`
^did:stellar:(mainnet|testnet):([a-z2-7]{26})$
\`\`\`

Exemple (un vrai DID testnet, résoluble de façon permanente) :

\`\`\`
did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi
\`\`\`

L'identifiant est généré avec Web Crypto (\`crypto.getRandomValues\`) ; la génération échoue bruyamment si aucune source aléatoire sécurisée n'est disponible.

## Pourquoi le DID n'est pas votre wallet

Le \`didId\` de 128 bits est **opaque** : il n'est délibérément dérivé d'aucun compte Stellar. Cela a trois conséquences pratiques :

- La chaîne du DID **survit à la rotation de clés** : vous pouvez transférer le contrôle à un nouveau wallet avec \`transfer_controller\` et le DID ne change pas.
- Un même wallet peut contrôler **plusieurs DIDs**.
- Le wallet n'apparaît que dans le champ \`controller\` de l'enregistrement sur la chaîne, jamais dans la chaîne du DID elle-même.

## Modèle de contrôleur

Le **contrôleur** est un compte Stellar classique (\`G...\`). Chaque mutation de l'enregistrement DID (\`update\`, \`transfer_controller\`, \`deactivate\`) exige la signature du contrôleur actuel : le contrat applique \`controller.require_auth()\`. Il n'existe aucun rôle privilégié dans la couche HTTP.

## Le document DID

La résolution d'un \`did:stellar\` produit un document conforme à W3C DID Core 1.1. Les clés utilisent le format **Multikey**, les relations de vérification contiennent des références de fragments (\`#auth-1\`, \`#assert-1\`, \`#keyagr-1\`), et il n'y a pas de champ \`controller\` racine (le document est auto-contrôlé).

\`\`\`json
{
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      "https://w3id.org/security/multikey/v1"
    ],
    "id": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
    "verificationMethod": [
      {
        "id": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi#auth-1",
        "type": "Multikey",
        "controller": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
        "publicKeyMultibase": "z6MkwBw2szL21i4Ym1wqzV8bPWwJyp1WDt8oRofTEs9ZntSq"
      }
    ],
    "authentication": [
      "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi#auth-1"
    ],
    "assertionMethod": [],
    "keyAgreement": [],
    "service": []
  },
  "didDocumentMetadata": {
    "versionId": "1",
    "deactivated": false,
    "method": {
      "network": "testnet",
      "stellarAccount": "G..."
    }
  },
  "didResolutionMetadata": { "contentType": "application/did+ld+json" }
}
\`\`\`

\`didDocumentMetadata.method.stellarAccount\` expose le compte contrôleur, ce qui permet aux vérificateurs de lier le DID au wallet qui le contrôle.

## Types de clés

| Relation | Courbe | Préfixe multibase | Clés max |
|--------------|-------|------------------|----------|
| \`authentication\` | Ed25519 | \`z6Mk...\` | 1 à 3 (au moins 1 requise) |
| \`assertionMethod\` | Ed25519 | \`z6Mk...\` | 0 à 3 |
| \`keyAgreement\` | X25519 | \`z6LS...\` | 0 ou 1 |

Les clés brutes doivent faire 32 octets. La **même clé peut apparaître dans plusieurs relations** (la forme idiomatique pour un émetteur est une clé Ed25519 à la fois dans \`authentication\` et \`assertionMethod\`) ; les doublons **au sein** d'une même relation sont rejetés avec \`duplicate_key\`.

## Rôles du DID

- **Titulaire** : clé \`authentication\` uniquement.
- **Émetteur** : \`authentication\` **plus au moins une clé \`assertionMethod\`** (obligatoire ; les vérificateurs W3C rejettent les credentials signés sans clé d'assertion).
- **Destinataire DIDComm** : ajoute une clé \`keyAgreement\` X25519.

## Cycle de vie

| Opération | Signée par | Notes |
|-----------|-----------|-------|
| \`register\` | Le contrôleur de l'enregistrement | Crée le DID ; \`version\` démarre à 1 |
| \`update\` | Contrôleur actuel | **Remplacement complet de l'enregistrement** (pas un patch) ; exige \`expectedVersion\` |
| \`transfer_controller\` | Contrôleur actuel | Fait tourner le wallet de contrôle ; la chaîne du DID reste inchangée |
| \`deactivate\` | Contrôleur actuel | **Irréversible** ; le DID se résout comme une pierre tombale avec HTTP \`410 Gone\` |

Chaque mutation incrémente \`version\` (concurrence optimiste) : envoyer un \`expectedVersion\` périmé échoue avec \`version_mismatch\`.

## Proof of Control

did:stellar définit un protocole hors chaîne de **Proof of Control** (par exemple pour la connexion par DID) :

1. Le vérificateur émet un défi \`{ did, domain, nonce, timestamp }\`.
2. Le signataire le canonicalise avec JCS (RFC 8785) et signe avec une clé \`authentication\` Ed25519 (signature en base64url, sans padding).
3. Le vérificateur contrôle, dans l'ordre : timestamp dans une fenêtre de 5 minutes, correspondance du domaine, fraîcheur du nonce, et la signature Ed25519 contre chaque clé \`authentication\` du document résolu.

La bibliothèque TypeScript fournit ce protocole prêt à l'emploi (voir **[Bibliothèque TypeScript](doc:did-library)**).

## Comment ACTA utilise did:stellar

- **L'identité d'émetteur est obligatoire** : \`POST /contracts/vc/issue\` exige un \`issuerDid\` qui se résout sur le registre du réseau et dont le **contrôleur sur la chaîne est égal à l'émetteur signataire** (sinon l'API retourne \`issuerDid_controller_mismatch\`).
- **Le Credentials SDK réalise son auto-onboarding** : appeler \`issue\` sans \`issuerDid\` génère de manière transparente les clés, enregistre un did:stellar avec une seule signature de wallet, et le réutilise ensuite (voir **[Credentials SDK](doc:sdk-overview)**).
- **La dApp guide l'enregistrement** avec une seule signature de wallet.
- **Domaines de confiance séparés** : l'API de credentials n'importe délibérément pas la bibliothèque DID ; identité et credentials évoluent indépendamment.

Poursuivez avec **[Registre et Resolver](doc:did-registry)** pour le contrat sur la chaîne et l'API HTTP, ou **[Bibliothèque TypeScript](doc:did-library)** pour le code.
    `,
};
