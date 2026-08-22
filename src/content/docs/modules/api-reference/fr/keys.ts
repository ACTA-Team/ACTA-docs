import type { DocPage } from "@/@types/docs";

export const keys: DocPage = {
  slug: "api-keys",
  title: "Clés API",
  section: "Référence API",
  tocItems: [
    "Obtenir une clé",
    "Utiliser la clé",
    "Scopes",
    "Limites",
    "Clé perdue",
  ],
  content: `
# Clés API

Chaque endpoint protégé s'authentifie avec une clé API. Les clés sont émises
depuis la [dApp ACTA](https://dapp.acta.build/), pas depuis cette API.

## Obtenir une clé

1. Ouvrez la [dApp ACTA](https://dapp.acta.build/) et connectez votre portefeuille Stellar.
2. Connectez-vous. Il vous sera demandé de signer une transaction de défi,
   construite pour ne jamais pouvoir être soumise (numéro de séquence 0, borne
   temporelle de deux minutes, une seule opération qui ne change rien). La
   signer ne déplace aucun fonds.
3. Créez la clé depuis la section des clés API.

La clé est liée au portefeuille qui s'est connecté, et c'est cette liaison qui
donne du sens aux contrôles de propriété : une clé ne peut agir que pour son
propre portefeuille, et personne ne peut émettre une clé au nom d'un
portefeuille qu'il ne contrôle pas.

Les clés sont émises avec le rôle **standard** et **n'expirent pas**. Le secret
n'est affiché qu'une fois et ne peut pas être récupéré : conservez-le avant de
fermer la fenêtre.

> Créez une clé par réseau. Une clé appartient au réseau sur lequel elle a été
> créée, et utiliser une clé testnet contre mainnet répond \`401\`.

## Utiliser la clé

Envoyez-la sur chaque requête protégée :

\`\`\`bash
curl https://sandbox-api.acta.build/contracts/version \\
  -H "X-ACTA-Key: votre_cle_api"
\`\`\`

\`X-ACTA-Key\` est l'en-tête canonique. \`x-api-key\` et
\`Authorization: Bearer <clé>\` sont également acceptés. Les clés sont des
chaînes hexadécimales de 64 caractères, sans préfixe.

Gardez la clé côté serveur. Tout ce qui arrive au navigateur est lisible par
quiconque ouvre les outils de développement, et une clé porteuse prouve la
possession, pas l'identité : quiconque détient la chaîne peut l'utiliser.

## Scopes

Une clé peut être restreinte à un sous-ensemble de ce que son rôle autorise :

| Scope | Autorise |
| --- | --- |
| \`credentials:issue\` | Émettre des credentials, à l'unité ou par lot |
| \`credentials:read\` | Lire la liste des credentials d'un vault et leur contenu |
| \`credentials:revoke\` | Révoquer un credential |
| \`vault:write\` | Créer un vault et y pousser des credentials |
| \`vault:admin\` | Modifier la propriété, le DID et les permissions d'émetteur du vault |
| \`sponsor\` | Payer le déploiement du vault d'une autre personne |

Ils se choisissent à la création de la clé. Le cas courant est une intégration
qui émet mais ne doit jamais lire les credentials du titulaire.

Une clé **sans** scope n'est pas restreinte au sein de son rôle, donc les clés
créées avant l'existence des scopes continuent de fonctionner à l'identique. Une
requête à laquelle il manque un scope répond \`403 insufficient_scope\`.

## Limites

- Jusqu'à **5 clés actives par portefeuille et par réseau**. Révoquez celle que
  vous n'utilisez plus avant d'en créer une autre.
- Créer une clé n'en révoque jamais une autre : effectuer une rotation sur un
  appareil ne casse pas les autres.

## Clé perdue

Le secret est stocké haché et ne peut pas être réaffiché. Si vous le perdez,
révoquez cette clé depuis la dApp et créez-en une nouvelle. La révocation prend
effet à la requête suivante ; il n'y a pas de période de grâce.
    `,
};
