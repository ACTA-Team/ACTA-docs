import type { DocPage } from "@/@types/docs";

export const introduction: DocPage = {
  slug: "introduction",
  title: "Introduction",
  section: "Bienvenue",
  tocItems: [
    "Commencez ici",
    "Ce que vous pouvez construire",
    "Cas d'usage courants",
    "Essayez maintenant",
  ],
  content: `
# Bienvenue

ACTA est une **infrastructure de Verifiable Credentials** pour la **blockchain Stellar**. Construisez des flux de credentials **non-custodial** avec **émission**, vérification et stockage. Les contrats s'exécutent sur **Stellar (Soroban)**. Votre application les pilote via l'API ou le SDK.

## Commencez ici

| Sujet | Description |
|-------|-------------|
| **Quickstart** | De zéro à un verifiable credential, de bout en bout |
| **Architecture** | Composants du système, contrats et flux de données |
| **Premiers Pas** | Guide d'intégration rapide pour l'API et le SDK |
| **Credentials SDK** | \`npm i @acta-team/credentials\` - hooks pour les opérations de credentials et de coffre |
| **Référence API** | Documentation complète des endpoints publics de l'API |
| **did:stellar** | Identité décentralisée pour les émetteurs et les titulaires |

## Ce que vous pouvez construire

- Émettre et vérifier des **[W3C Verifiable Credentials 2.0](https://www.w3.org/TR/vc-data-model-2.0/)** on-chain
- Stocker des credentials chiffrés dans des **coffres contrôlés par l'utilisateur**
- Ajouter une **logique de vérification programmable** à votre application
- Prendre en charge la **révocation**, les vérifications de statut et les transferts de credentials
- Configurer l'**autorisation des émetteurs** par coffre
- Lancer plus vite sans écrire des contrats de credentials à partir de zéro

## Cas d'usage courants

- **Identité numérique** : émettre des credentials d'identité vérifiables
- **Éducation** : certificats académiques et diplômes
- **Professionnel** : licences, certifications et adhésions
- **Santé** : dossiers médicaux et certificats de vaccination
- **Finance** : credentials de conformité KYC/AML
- **Contrôle d'accès** : jetons d'adhésion et d'autorisation

## Essayez maintenant

:::welcome-try-cta:::
    `,
};
