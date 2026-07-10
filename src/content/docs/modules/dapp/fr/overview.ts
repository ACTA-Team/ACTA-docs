import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "dapp-overview",
  title: "Aperçu",
  section: "dApp",
  tocItems: [
    "Qu'est-ce que la dApp ACTA ?",
    "Fonctionnalités clés",
    "Premiers pas",
    "Accéder à la dApp",
  ],
  content: `
# Aperçu de la dApp ACTA

La dApp ACTA est une application web moderne qui offre une interface conviviale pour émettre, gérer, partager et contrôler l'accès aux credentials vérifiables. Construite avec Next.js 16 et React 19 au-dessus de l'API REST d'ACTA, elle propose une interface de gestion de credentials sans exiger de connaissances en programmation.

## Qu'est-ce que la dApp ACTA ?

La dApp ACTA est une application décentralisée qui vous permet de :

- **Émettre des credentials** vers des utilisateurs (l'émission exige une identité did:stellar enregistrée et facture des frais sur la chaîne payés par l'émetteur)
- **Maintenir un coffre** de credentials avec des actions de recherche, de partage et de révocation
- **Partager des credentials** avec divulgation sélective de champs
- **Gérer l'accès des émetteurs** - l'émission est ouverte par défaut, vous ne faites donc que bloquer ou débloquer des émetteurs spécifiques
- **Vérifier des credentials** sur la chaîne
- **Gérer des API keys** pour l'accès programmatique

Les opérations sont réalisées via l'infrastructure Stellar/Soroban en utilisant les contrats et les APIs d'ACTA.

## Fonctionnalités clés

### Gestion des credentials

- Créer et émettre des credentials vérifiables à partir de **modèles** (modèles intégrés comme les certificats de cours, les adhésions ou les reçus de paiement, plus un constructeur de modèles personnalisés)
- Stocker les credentials dans votre coffre personnel
- Rechercher et filtrer les credentials
- Partager des credentials avec divulgation sélective de champs, un QR code et une page de vérification publique
- Révoquer des credentials si nécessaire

### Accès des émetteurs

- L'émission est ouverte par défaut - n'importe quel émetteur peut émettre vers votre coffre sauf si vous le bloquez
- Bloquer des émetteurs spécifiques pour les empêcher d'émettre vers vous
- Débloquer des émetteurs pour restaurer leur accès

### Gestion des API Keys

- Créer et gérer des API keys pour testnet et mainnet
- Clés avec le rôle standard et une expiration de 6 mois
- Intégration avec l'API ACTA

### Onboarding guidé

- Visite guidée interactive lors de la première visite
- Guide de démarrage rapide avec des instructions pas à pas
- Aide contextuelle dans toute l'application

### Et plus

- **Notifications** : notifications dans l'application (par exemple quand votre coffre reçoit un credential)
- **Langues** : anglais, espagnol et français
- **Changement de réseau** : basculez entre testnet et mainnet à tout moment dans les Paramètres

## Premiers pas

Pour commencer à utiliser la dApp ACTA :

1. **Connectez votre wallet et choisissez un réseau** - Freighter, Albedo ou WalletConnect ; testnet ou mainnet
2. **Créez votre API key** - requise pour les opérations de coffre et de credentials
3. **Enregistrez votre DID d'émetteur** - une identité did:stellar (nécessaire pour émettre des credentials)
4. **Créez votre coffre** - Initialisez votre coffre de credentials dédié single-tenant
5. **Commencez à émettre** - Créez et gérez des credentials (l'émetteur paie des frais sur la chaîne par credential)

Consultez le guide [Premiers Pas](doc:dapp-getting-started) pour des instructions détaillées.

## Accéder à la dApp

La dApp ACTA est disponible via le lien ci-dessous. **Aucune installation requise** - ouvrez-la dans votre navigateur web et connectez votre wallet Stellar pour commencer.

:::dapp-open-cta:::
    `,
};
