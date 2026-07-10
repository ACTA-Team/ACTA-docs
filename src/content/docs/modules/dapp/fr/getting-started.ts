import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "dapp-getting-started",
  title: "Premiers Pas",
  section: "dApp",
  tocItems: [
    "Étape 1 : Connecter le wallet",
    "Étape 2 : Créer une API key",
    "Étape 3 : Enregistrer le DID d'émetteur",
    "Étape 4 : Créer le coffre",
    "Étape 5 : Émettre des credentials",
    "Gérer l'accès des émetteurs",
    "Étapes suivantes",
  ],
  content: `
# Premiers pas avec la dApp ACTA

Suivez ces étapes pour commencer à utiliser la dApp ACTA pour la gestion de credentials.

## Étape 1 : Connecter le wallet et choisir le réseau

La première étape consiste à connecter votre wallet Stellar à la dApp.

1. Visitez [https://dapp.acta.build](https://dapp.acta.build)
2. Cliquez sur le bouton de connexion du wallet
3. Sélectionnez votre wallet Stellar - **Freighter**, **Albedo** ou **WalletConnect** sont pris en charge
4. Approuvez la demande de connexion
5. Choisissez votre réseau (dans les **Paramètres**) :
   - **Testnet** - Pour les tests et le développement (par défaut)
   - **Mainnet** - Pour l'utilisation en production

Une fois connecté, l'adresse de votre wallet s'affiche dans l'en-tête. Lors de votre première visite, une visite guidée vous présente les principales sections.

## Étape 2 : Créer votre API key

Les opérations de coffre et de credentials dans la dApp passent par l'API ACTA, vous avez donc d'abord besoin d'une API key.

1. Accédez à la section **API Keys**
2. Cliquez sur **Create API Key** et donnez-lui un nom (optionnel)
3. **Sauvegardez la clé immédiatement** - elle n'est affichée qu'une seule fois

Vous obtenez **une clé par wallet et par réseau** ; en créer une nouvelle remplace (révoque) la clé précédente. La dApp ne conserve la clé que pour votre session de navigateur actuelle.

## Étape 3 : Enregistrer votre DID d'émetteur

Pour émettre des credentials, l'émetteur a besoin d'une identité **did:stellar** enregistrée et résoluble (pas une simple adresse de wallet). La dApp vous guide dans son enregistrement avec une seule signature de wallet. Si vous prévoyez seulement de recevoir et de conserver des credentials, vous pouvez sauter cette étape.

## Étape 4 : Créer votre coffre personnel

Votre coffre est votre stockage sécurisé de credentials. Chaque propriétaire dispose de son propre contrat de coffre dédié single-tenant, déployé de manière déterministe par une factory en arrière-plan.

1. Accédez à la section **Dashboard** ou **Vault**
2. Si vous n'avez pas encore de coffre, vous verrez une option pour en créer un
3. Cliquez sur **Create Vault** ou **Initialize Vault**
4. Signez la transaction avec votre wallet
5. Votre coffre est maintenant prêt à stocker des credentials

La création du coffre est une opération unique par adresse de wallet.

## Étape 5 : Émettre des credentials

Une fois que vous avez un coffre, vous pouvez commencer à émettre des credentials. L'émission facture des frais sur la chaîne payés par l'émetteur (mainnet : 1 USDC par credential ; testnet : 5 XLM).

1. Accédez à la section **Issue**
2. Choisissez un **modèle** (modèles intégrés comme les certificats de cours ou les adhésions, ou votre propre modèle personnalisé)
3. Remplissez les champs du modèle et l'**adresse du wallet destinataire** (dont le coffre recevra le credential)
4. Cliquez sur **Issue Credential**
5. Signez la transaction avec votre wallet
6. Le credential sera stocké dans le coffre du destinataire et marqué comme valide

Le coffre du propriétaire reçoit le credential, tandis que le titulaire est identifié par un DID (le \`credentialSubject.id\`) ; il n'y a pas de champ wallet ou titulaire séparé. Le credential est désormais sur la chaîne et peut être vérifié.

## Gérer l'accès des émetteurs

L'émission est **ouverte par défaut** : n'importe quel émetteur peut émettre des credentials vers votre coffre sans approbation préalable, vous n'avez donc besoin de pré-autoriser personne. Vous ne gérez l'accès que lorsque vous voulez arrêter un émetteur spécifique.

1. Allez dans la section **Issuer Access** de la barre latérale
2. Saisissez l'émetteur que vous voulez **bloquer**
3. Cliquez sur **Block Issuer** et signez la transaction avec votre wallet
4. L'émetteur bloqué ne peut plus émettre de credentials vers votre coffre
5. Pour restaurer l'accès, **débloquez** l'émetteur à tout moment

**Note :** Comme l'émission est ouverte par défaut, le blocage est un contrôle de refus par exception. N'importe qui peut émettre vers vous, sauf si vous le bloquez explicitement.

## Étapes suivantes

Après avoir terminé la configuration initiale :

- **Voir les credentials** - Allez dans la section **Vault** pour voir tous vos credentials
- **Partager des credentials** - Utilisez la fonction de partage pour créer des liens et des QR codes avec des champs de credential sélectionnés ; n'importe qui peut les consulter sur la page de vérification publique
- **Notifications** - Surveillez l'icône de cloche pour les événements comme la réception de nouveaux credentials
- **Explorer les Paramètres** - Changez de réseau ou de langue (anglais, espagnol, français)

Pour plus d'informations sur des fonctionnalités spécifiques, consultez le guide [Fonctionnalités](doc:dapp-features).
    `,
};
