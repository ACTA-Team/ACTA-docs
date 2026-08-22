import type { DocPage } from "@/@types/docs";

export const security: DocPage = {
  slug: "security",
  title: "Sécurité et Modèle de Données",
  section: "Bienvenue",
  tocItems: [
    "Principes",
    "Qui signe quoi",
    "Où vivent les données",
    "Chiffrement des credentials",
    "Ce qu'ACTA peut et ne peut pas faire",
    "Sécurité de l'identité",
    "Contrôle d'accès à l'API",
    "Immuabilité des contrats",
    "Liens de partage",
    "Signaler des problèmes",
  ],
  content: `
# Sécurité et Modèle de Données

Une carte honnête et précise de l'endroit où vivent vos données, de qui peut les lire et de qui signe quoi. C'est la page à lire avant de passer ACTA en production.

## Principes

- **Non-custodial** : ACTA ne détient jamais de clés privées. Chaque changement d'état est une transaction Stellar signée par votre wallet.
- **Prepare/submit partout** : l'API construit un XDR non signé, votre wallet le signe localement, l'API le soumet. La clé de signature ne quitte jamais votre appareil.
- **Aucune PII en clair on-chain** : les contenus des credentials sont chiffrés avant d'être ancrés.
- **Vérification à confiance minimisée** : le statut des credentials et la résolution des DID sont des lectures on-chain que n'importe qui peut effectuer.

## Qui signe quoi

| Action | Signataire |
|--------|--------|
| Créer un coffre | Le propriétaire du coffre |
| Émettre / émettre en lot | L'émetteur (qui paie aussi les frais on-chain) |
| Révoquer un credential | Le propriétaire du coffre |
| Bloquer / débloquer un émetteur | L'admin du coffre (le propriétaire par défaut) |
| Enregistrer / mettre à jour / désactiver un DID | Le wallet contrôleur du DID |
| Déploiement de coffre sponsorisé | Le sponsor |

## Où vivent les données

| Données | Où | Forme |
|------|-------|------|
| Contenu du credential (\`vcData\`) | On-chain, dans le contrat de coffre du propriétaire | **Chiffré AES-256-GCM** |
| Statut du credential (valide / révoqué + date) | On-chain | Public |
| Métadonnées du coffre (propriétaire, URI du DID, compteurs) | On-chain | Public |
| Enregistrement DID de l'émetteur (clés, contrôleur, services) | On-chain (registre did:stellar) | Public par conception |
| API keys | Base de données ACTA | **Hachées** (recherche SHA-256 + vérification Argon2id) ; le texte en clair est affiché une fois et jamais stocké |
| Payloads des liens de partage | Base de données ACTA, à durée limitée | **Scellés AES-256-GCM**, liens signés HMAC, expiration par défaut de 7 jours |
| Clés privées (wallet ou DID) | Votre wallet / votre navigateur | Jamais envoyées à ACTA |

## Chiffrement des credentials

Quand vous émettez, \`vcData\` transite vers l'API via TLS et est chiffré **côté serveur** avec AES-256-GCM sous une clé maîtresse détenue par le serveur, avec l'adresse du propriétaire liée comme données authentifiées (AAD). C'est le texte chiffré qui est ancré on-chain.

Conséquences pratiques :

- N'importe qui peut voir **qu'**un credential existe et son statut ; personne ne peut lire son contenu depuis la chaîne.
- \`GET /contracts/vault/get-vc\` déchiffre côté serveur, c'est pourquoi l'API impose que seule l'API key du propriétaire (ou un admin) puisse l'appeler.
- \`verify-vc\` expose **uniquement le statut** et est ouvert à toute clé valide : des tiers peuvent vérifier sans jamais voir le contenu.

## Ce qu'ACTA peut et ne peut pas faire

**Peut** : traiter le contenu en clair au moment de l'émission et quand le propriétaire le relit (c'est inhérent au chiffrement côté serveur) ; voir les métadonnées d'émission (qui a émis à qui, quand) ; ne rien révoquer et ne rien signer en votre nom.

**Ne peut pas** : lire vos credentials depuis la chaîne sans le contexte de la clé maîtresse, déplacer des fonds, émettre en votre nom, faire tourner votre DID ou révoquer vos credentials - tout cela exige des signatures de votre wallet.

Si votre modèle de menace exige qu'ACTA ne voie jamais le contenu, chiffrez \`vcData\` côté client avant d'émettre ; la plateforme traite le contenu comme opaque.

## Sécurité de l'identité

- Chaque mutation de DID exige la signature on-chain du **wallet contrôleur** (\`require_auth\`) ; le resolver n'a aucun rôle privilégié.
- **Rotation de clés** sans perte d'identité : \`transfer_controller\` transfère le contrôle à un nouveau wallet, la chaîne du DID reste la même.
- La **désactivation** est irréversible : un DID désactivé se résout comme une tombstone (HTTP 410) et ne peut plus signer.
- L'émission impose la **liaison au contrôleur** : le contrôleur on-chain du DID doit être égal à l'émetteur signataire, donc une chaîne DID volée seule est inutile.

## Contrôle d'accès à l'API

- Les API keys sont des hexadécimaux aléatoires de 64 caractères, stockées hachées, avec une **expiration de 6 mois** et des limites de débit par rôle (voir l'**[Aperçu de l'API](doc:api-overview)**).
- **Liaison de propriété** : les endpoints qui exposent ou écrivent les données d'un titulaire (\`issue\`, \`batch-issue\`, \`list-vc-ids\`, \`get-vc\`, \`push\`) exigent que le \`owner\` de la requête corresponde au wallet de la clé. Les mutations de l'issuer-registry sont la seule surface exigeant encore le rôle admin.
- Les écritures prennent en charge \`Idempotency-Key\` pour des réessais sûrs ; toutes les erreurs portent un \`request_id\` pour la traçabilité (voir **[Erreurs](doc:api-errors)**).

## Immuabilité des contrats

- Les coffres sont déployés à partir d'un **template WASM fixe** et n'ont **aucun point d'entrée de mise à niveau** : le code qui détient vos credentials ne peut pas être remplacé sous vos pieds.
- La factory ne peut pas non plus changer le template ; livrer un nouveau code de coffre signifie déployer une nouvelle factory, jamais muter les coffres existants.
- Les transferts d'admin (factory, registre) sont en **deux étapes** (nomination, puis acceptation), ce qui prévient les transferts accidentels.

## Liens de partage

Partager un credential crée une copie scellée côté serveur contenant uniquement les champs que vous avez sélectionnés. Les liens sont signés HMAC, expirent (7 jours par défaut), et la page de vérification publique revérifie toujours le statut **on-chain**, donc un credential révoqué apparaît comme révoqué même via un ancien lien.

## Signaler des problèmes

Vous avez trouvé une vulnérabilité ou quelque chose qui semble anormal ? Ouvrez une issue sur **[GitHub](https://github.com/ACTA-Team/ACTA-docs/issues)** ou contactez l'équipe sur **[Discord](https://discord.gg/DsUSE3aMDZ)**. Merci de ne pas publier de détails d'exploitation avant que l'équipe ait eu la possibilité de répondre.
    `,
};
