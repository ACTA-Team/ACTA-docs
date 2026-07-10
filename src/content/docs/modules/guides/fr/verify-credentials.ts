import type { DocPage } from "@/@types/docs";

export const verifyCredentials: DocPage = {
  slug: "verify-credentials",
  title: "Vérifier des credentials",
  section: "Guides",
  tocItems: [
    "Trois façons de vérifier",
    "1. Le lien de partage (aucun outil requis)",
    "2. L'API",
    "3. Le SDK",
    "Ce que signifie chaque statut",
    "Ce que la vérification prouve",
    "Vérifier l'identité de l'émetteur",
  ],
  content: `
# Vérifier des credentials

Vous avez reçu un credential ACTA (un lien, un QR code, ou simplement une adresse de propriétaire et un identifiant de credential) et vous voulez savoir s'il est authentique et toujours valide. Il existe trois façons, du zéro-outillage au tout-programmatique.

## Trois façons de vérifier

| Méthode | Pour | Requiert |
|--------|-----|----------|
| Lien de partage / QR | Tout le monde | Rien, juste un navigateur |
| \`POST /contracts/vault/verify-vc\` | Développeurs | Une API key (n'importe quel rôle) |
| SDK \`verifyVc\` | Applications React | \`@acta-team/credentials\` |

## 1. Le lien de partage (aucun outil requis)

Quand un titulaire partage un credential depuis le dApp, le lien (ou son QR code) ouvre une **page de vérification publique** sur \`dapp.acta.build\`. Ni wallet, ni compte :

- La page affiche **uniquement les champs que le titulaire a choisi de révéler**.
- Le **statut du credential est toujours revérifié on-chain** au chargement de la page, jamais tiré du payload partagé : un credential révoqué après la création du lien apparaît comme révoqué.
- Les champs révélés eux-mêmes proviennent du partage du titulaire, donc la page les étiquette comme une vue partagée ; la partie on-chain est le statut.
- Les liens de partage **expirent** (7 jours par défaut), donc un ancien lien cesse de fonctionner.

## 2. L'API

\`verify-vc\` est volontairement ouvert à **toute API key valide**, sans vérification de propriété, précisément pour que des tiers puissent vérifier des credentials qu'ils ne possèdent pas. Il renvoie uniquement le statut, jamais le contenu.

\`\`\`bash
curl -X POST https://api.testnet.acta.build/contracts/vault/verify-vc \\
  -H "X-ACTA-Key: your_key" \\
  -H "Content-Type: application/json" \\
  -d '{ "owner": "G...", "vcId": "credential-123" }'
\`\`\`

\`\`\`json
{ "status": "valid", "since": "2026-01-01T00:00:00.000Z" }
\`\`\`

Vous avez besoin de l'adresse du **propriétaire** (dont le coffre détient le credential) et du **vcId**. Utilisez l'URL de base mainnet pour les credentials mainnet.

## 3. Le SDK

\`\`\`ts
import { useVaultRead } from "@acta-team/credentials";

const { verifyVc } = useVaultRead();
const result = await verifyVc({ owner: "G...", vcId: "credential-123" });
// { status: "valid" | "revoked", since?: string }
\`\`\`

## Ce que signifie chaque statut

| Statut | Signification |
|--------|---------|
| \`valid\` | Le credential existe dans le coffre du propriétaire et n'a pas été révoqué |
| \`revoked\` | Il a été révoqué par le propriétaire du coffre ; \`since\` porte la date de révocation |
| \`invalid\` | Le contrat le signale comme non valide |
| \`unknown\` | Le contrat a renvoyé une forme inattendue (cas de repli rare) |

## Ce que la vérification prouve

Soyez précis sur ce qu'une vérification de statut on-chain prouve et ne prouve pas :

- **Elle prouve** : un credential avec cet identifiant existe dans le coffre de ce propriétaire sur le réseau Stellar, ainsi que son statut de cycle de vie actuel (valide, ou révoqué avec une date).
- **Elle ne prouve pas à elle seule** : *qui* l'a émis. L'émission dans un coffre est ouverte par défaut (deny-by-exception), donc faire confiance à un credential implique aussi de vérifier que son **émetteur** est bien celui que vous attendez.

## Vérifier l'identité de l'émetteur

Chaque credential stocke le \`did:stellar\` de son émetteur. Pour vérifier l'émetteur :

1. Résolvez le DID de l'émetteur auprès du resolver public, sans authentification requise :

\`\`\`bash
curl https://did.acta.build/1.0/identifiers/did:stellar:mainnet:...
\`\`\`

2. Le résultat de la résolution expose le wallet contrôleur (\`didDocumentMetadata.method.stellarAccount\`) et les clés publiques de l'émetteur. Un DID désactivé se résout avec HTTP \`410\`.
3. L'API ACTA impose déjà, au moment de l'émission, que le contrôleur on-chain du DID soit égal au wallet qui a signé la transaction d'émission.

Consultez la **[section DID](doc:did-overview)** pour comprendre l'identité des émetteurs de bout en bout, et **[Sécurité et Modèle de Données](doc:security)** pour le modèle de confiance plus large.
    `,
};
