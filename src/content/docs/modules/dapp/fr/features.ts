import type { DocPage } from "@/@types/docs";

export const features: DocPage = {
  slug: "dapp-features",
  title: "Fonctionnalités",
  section: "dApp",
  tocItems: [
    "Émettre des credentials",
    "Modèles de credentials",
    "Gestion du coffre",
    "Partager des credentials",
    "Accès des émetteurs",
    "Gestion des API Keys",
    "Notifications",
    "Paramètres",
  ],
  content: `
# Fonctionnalités de la dApp

Aperçu détaillé des fonctionnalités documentées disponibles dans la dApp ACTA.

## Émettre des credentials

Créez et émettez des credentials vérifiables vers une adresse de wallet Stellar. L'émission exige une identité d'émetteur **did:stellar** enregistrée et résoluble (pas une simple adresse de wallet) et facture des frais sur la chaîne payés par l'émetteur (mainnet : 1 USDC par credential ; testnet : 5 XLM).

### Comment émettre

1. Accédez à **Issue** dans la barre latérale
2. Choisissez un **modèle** et remplissez ses champs :
   - **Destinataire** : adresse du wallet Stellar (G...) dont le coffre recevra le credential
   - **Champs du modèle** : les informations du credential, définies par le modèle
3. Cliquez sur **Issue Credential**
4. Signez la transaction

Le credential est automatiquement :
- Stocké dans le coffre du destinataire
- Marqué comme valide sur la chaîne
- Disponible pour vérification

## Modèles de credentials

Le formulaire d'émission est piloté par des modèles, vous n'avez donc jamais à écrire du JSON brut :

- **Modèles intégrés** : schémas prêts à l'emploi comme les certificats de cours, la participation à des événements, les adhésions, les badges d'employés, les reçus de paiement, la vérification KYC, les passes d'accès, les badges de compétences, les garanties, les enregistrements d'escrow et de contribution
- **Modèles personnalisés** : construisez votre propre modèle avec les champs dont vous avez besoin ; les modèles personnalisés sont sauvegardés localement dans votre navigateur et incluent toujours les champs de base (DID du sujet, date d'émission, expiration)

## Gestion du coffre

Votre coffre est votre stockage personnel de credentials. Chaque wallet dispose d'un coffre isolé.

### Voir les credentials

1. Allez dans la section **Vault** ou **Credentials**
2. Consultez tous les credentials stockés dans votre coffre
3. Utilisez la recherche et les filtres pour trouver des credentials spécifiques
4. Cliquez sur un credential pour voir les détails

### Actions sur les credentials

- **Voir les détails** - Consultez les informations complètes du credential
- **Partager** - Créez un lien partageable avec divulgation sélective de champs
- **Révoquer** - Révoquez un credential si nécessaire
- **Vérifier** - Contrôlez le statut sur la chaîne

## Partager des credentials

Partagez des credentials en choisissant quels champs révéler.

### Flux de partage

1. Allez dans votre **Vault** et sélectionnez un credential
2. Cliquez sur **Share**
3. Choisissez les champs à révéler (tout sélectionner ou choisir individuellement)
4. Copiez le lien de partage ou scannez le **QR code** généré

Le lien de partage ouvre une **page de vérification publique** - aucun wallet ni compte requis. La page n'affiche que les champs révélés et vérifie toujours le statut du credential **sur la chaîne**, de sorte qu'un credential révoqué apparaît comme révoqué même via un ancien lien. Les liens de partage expirent après un délai limité (7 jours par défaut).

## Accès des émetteurs

L'émission est ouverte par défaut : n'importe qui peut émettre des credentials vers votre coffre sauf si vous le bloquez. Utilisez cette section pour bloquer les émetteurs que vous voulez arrêter et les débloquer plus tard pour restaurer leur accès.

### Bloquer un émetteur

1. Allez dans la section **Issuer Access**
2. Saisissez l'émetteur que vous voulez bloquer
3. Cliquez sur **Block Issuer**
4. Signez la transaction

### Gérer les émetteurs bloqués

- Voir tous les émetteurs bloqués
- Débloquer un émetteur pour restaurer son accès
- N'importe qui peut émettre vers vous, sauf si vous le bloquez (refus par exception)

## Gestion des API Keys

Créez et gérez des API keys pour l'accès programmatique à l'API ACTA.

### Créer une API key

1. Accédez à la section **API Keys**
2. Choisissez le réseau (Testnet ou Mainnet)
3. Saisissez un nom pour votre API key (optionnel)
4. Cliquez sur **Create API Key**
5. **Sauvegardez la clé immédiatement** - elle ne sera plus affichée

Les API keys ont :
- **Rôle standard** - Accès aux endpoints publics
- **Expiration de 6 mois** - Les clés expirent après 6 mois
- **Spécifiques au réseau** - Clés distinctes pour testnet et mainnet
- **Une par wallet** - créer une nouvelle clé remplace (révoque) la précédente ; la dApp ne conserve le secret que pour la session de navigateur actuelle

### Utiliser les API keys

Utilisez votre API key dans les requêtes API :

\`\`\`
X-ACTA-Key: your_api_key_here
\`\`\`

Consultez l'[Aperçu de l'API](doc:api-overview) pour tous les endpoints disponibles.

## Notifications

La dApp inclut des notifications dans l'application (icône de cloche dans l'en-tête et page **Notifications** dédiée) : vous êtes notifié des événements sur votre wallet, comme la réception d'un nouveau credential. Vous pouvez marquer les notifications comme lues individuellement ou toutes à la fois.

## Paramètres

La section **Paramètres** (également disponible en superposition) inclut :

- **Compte** : l'adresse de votre wallet, un lien stellar.expert et le **changement de réseau** (testnet / mainnet)
- **Langue** : anglais, espagnol ou français
- **À propos** : version et liens vers la documentation, Discord et GitHub
    `,
};
