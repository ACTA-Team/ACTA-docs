import type { DocPage } from "@/@types/docs";

export const gettingStarted: DocPage = {
  slug: "getting-started",
  title: "Premiers Pas",
  section: "Bienvenue",
  tocItems: [
    "Intégration de l'API",
    "Intégration du Credentials SDK",
    "Intégration de wallet",
    "Configuration testnet",
    "Étapes suivantes",
  ],
  content: `
# Premiers Pas

Guides de démarrage rapide pour différents scénarios d'intégration.

## Intégration de l'API

Commencez à utiliser l'API ACTA pour émettre et vérifier des credentials :

1. **Choisissez un réseau** : Testnet (recommandé pour le développement) ou Mainnet
2. **Obtenez une API Key** : toutes les routes \`/contracts/*\` exigent un en-tête \`X-ACTA-Key\` (voir [API Keys](doc:api-keys))
3. **Émettez des credentials** : utilisez l'endpoint \`POST /contracts/vc/issue\`
4. **Vérifiez des credentials** : utilisez \`POST /contracts/vault/verify-vc\`

Pour les URLs de base et la carte complète des endpoints, ouvrez l'**[Aperçu de l'API](doc:api-overview)**. Pour confirmer que le service est opérationnel, utilisez **[Santé et état](doc:api-health-status)** (inclut un **GET /health** en direct exécutable dans le navigateur).

## Intégration du Credentials SDK

Pour les applications React / Next.js :

1. **Installez** :

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

2. **Provider** : enveloppez votre arborescence avec **\`ActaConfig\`** (passez \`baseURL\`, \`apiKey\` optionnel ; voir l'aperçu du Credentials SDK).
3. **Hooks** : \`useCredential\`, \`useVault\`, \`useVaultRead\`, et **\`useActaClient\`** quand vous avez besoin du client HTTP directement.

Consultez le **[Credentials SDK](doc:sdk-overview)** et les pages des hooks pour les détails.

## Intégration de wallet

Connectez des wallets Stellar pour l'authentification des utilisateurs et la signature des transactions :

1. **UI de wallet** : intégrez un adaptateur de wallet Stellar - **[Stellar Wallets Kit](https://stellarwalletskit.dev)** couvre Freighter, Albedo, WalletConnect et plus encore.
2. **Connexion du wallet** : l'utilisateur connecte Freighter ou un autre wallet Stellar pris en charge.
3. **Signature des transactions** : utilisez les endpoints de préparation de transactions d'ACTA depuis les **[Opérations de Coffre (Écriture)](doc:api-vault-write)** et les **[Opérations de Credentials](doc:api-credentials)** ; votre callback \`signTransaction\` signe le XDR non signé renvoyé par l'API.

## Configuration testnet

Avant de déployer sur mainnet :

1. **Obtenez des XLM de testnet** : utilisez **[Stellar Lab (fund account)](https://lab.stellar.org/account/fund)** ou les ressources **[testnet](https://developers.stellar.org/docs/learn/fundamentals/networks)** de Stellar.
2. **Testez les opérations** : émettez, stockez et vérifiez des credentials de test sur testnet (voir l'**[Aperçu de l'API](doc:api-overview)**).
3. **Vérifiez les contrats** : les identifiants de contrats testnet sont préconfigurés quand vous utilisez l'URL de base de l'API testnet.

## Étapes suivantes

- **[Aperçu de l'API](doc:api-overview)** - tous les endpoints publics
- **[Opérations de Credentials](doc:api-credentials)** et **[Opérations de Coffre (Lecture)](doc:api-vault-read)** - payloads et exemples
- **[Erreurs de contrat](doc:contract-errors)** - codes d'erreur on-chain
- **[FAQ](doc:faq)** - questions fréquentes
    `,
};
