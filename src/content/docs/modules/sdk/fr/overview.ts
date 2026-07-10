import type { DocPage } from "@/@types/docs";

export const overview: DocPage = {
  slug: "sdk-overview",
  title: "Aperçu",
  section: "Credentials SDK",
  tocItems: [
    "Installation",
    "Architecture",
    "Exports",
    "Provider (ActaConfig)",
    "Variables d'environnement",
    "Accéder au client",
    "Résumé des hooks",
    "Identité de l'émetteur (auto-onboarding)",
    "Gestion des erreurs",
    "sponsoredVault",
    "Méthodes dépréciées",
  ],
  content: `
# Aperçu du Credentials SDK

Package de production : **\`@acta-team/credentials\`** (installation avec npm / pnpm / yarn). Les anciennes références à **\`@acta-team/acta-sdk\`** pointent vers la même surface : le composant React **\`ActaConfig\`** monte un **\`ActaClient\`** dans le contexte, exposé via **\`useActaClient()\`**, plus des hooks pour les lectures/écritures de coffre et l'émission/révocation de credentials. Le réseau provient de **\`baseURL\`** (\`mainNet\` vs \`testNet\`).

## Installation

\`\`\`bash
npm install @acta-team/credentials
\`\`\`

## Architecture

Les coffres sont **single-tenant** : chaque propriétaire possède son propre contrat \`vc-vault\`, déployé de manière déterministe par une unique \`vc-vault-factory\` par réseau. L'API et le SDK dérivent l'adresse du coffre d'un propriétaire à partir de \`(factory, owner, userSalt)\` ; le \`userSalt\` par défaut est composé de 32 octets à zéro, ce qui donne un coffre canonique par propriétaire. Passez un \`userSalt\` non par défaut sur les appels create/read/issue pour sélectionner un coffre supplémentaire pour le même propriétaire.

L'émission est **ouverte par défaut** (refus par exception) : les propriétaires bloquent des émetteurs avec \`denyIssuer\` et les débloquent avec \`allowIssuer\`. L'émetteur doit être un \`did:stellar\` enregistré et résoluble ; les adresses de wallet brutes et \`did:pkh\` ne sont plus acceptés comme DID d'émetteur.

## Exports

- **\`ActaConfig\`** : Provider - \`baseURL\` obligatoire ; \`apiKey\` explicite optionnelle.
- **\`useActaClient\`** : Retourne l'\`ActaClient\` contextuel (doit être rendu sous \`ActaConfig\`).
- **Hooks** : \`useVault\`, \`useCredential\`, \`useVaultRead\`.
- **\`ActaClient\`** : méthodes client directes, dont \`getHealth\`, \`getConfig\` (cache ~5 min, \`clearConfigCache()\` pour réinitialiser), \`vaultSetDid\`, \`vaultSetNewOwner\`, \`vaultPush\` et \`sponsoredVaultCreate\` (voir **sponsoredVault**).
- **Erreurs** : \`ActaApiError\` et \`normalizeError\` (voir **Gestion des erreurs**).
- **Identité** : \`getOrCreateIssuerIdentity\` / \`getIssuerIdentity\` sur le client, plus des utilitaires de stockage (\`IndexedDbIssuerIdentityStorage\`, \`InMemoryIssuerIdentityStorage\`, \`autoSelectStorage\`).
- **URLs** : \`mainNet\`, \`testNet\` (constantes de type string pour les deux hôtes de l'API ; toute chaîne \`baseURL\` personnalisée est également acceptée, par exemple staging ou localhost).
- **Exports de sous-chemins** : \`@acta-team/credentials/types\` et \`@acta-team/credentials/hooks\`. Le package fournit ESM et CJS avec des déclarations TypeScript ; \`ActaConfig\` est un composant client (\`"use client"\`), compatible avec l'App Router de Next.js.

## Provider (\`ActaConfig\`)

\`\`\`tsx
import { ActaConfig, mainNet } from "@acta-team/credentials";

export function App() {
  return (
    <ActaConfig baseURL={mainNet}>
      {/* votre application */}
    </ActaConfig>
  );
}
\`\`\`

Passez **\`apiKey\`** au provider si vous ne souhaitez pas dépendre de la résolution via les variables d'environnement.

## Variables d'environnement

La bibliothèque résout une clé d'API dans cet ordre, sauf si vous passez \`apiKey\` sur \`ActaConfig\` :

- Spécifique au réseau : \`ACTA_API_KEY_MAINNET\`, \`ACTA_API_KEY_TESTNET\`
- Repli pour les deux réseaux : \`ACTA_API_KEY\`

La clé est jointe en tant qu'en-tête **\`X-ACTA-Key\`** sur les requêtes sortantes.

## Accéder au client

\`\`\`ts
import { useActaClient } from "@acta-team/credentials";

const client = useActaClient();
const config = await client.getConfig();
// config: { rpcUrl, networkPassphrase, networkType, factoryContractId, vaultWasmHash, didStellarRegistryId, actaContractId }
// actaContractId est un alias de rétrocompatibilité de factoryContractId
\`\`\`

## Résumé des hooks

- **\`useVault\`** - \`createVault\`, \`denyIssuer\`, \`allowIssuer\` (plus des alias de rétrocompatibilité : \`authorizeIssuer\` ≙ allow, \`revokeIssuer\` ≙ deny).
- **\`useCredential\`** - \`issue\`, \`revoke\`.
- **\`useVaultRead\`** - \`listVcIds\`, \`getVc\`, \`verifyVc\`.

\`userSalt\` est un argument optionnel sur les appels d'écriture de coffre et d'émission (\`createVault\`, \`denyIssuer\`, \`allowIssuer\`, \`issue\`, \`revoke\`) ; omettez-le pour utiliser le coffre canonique du propriétaire. Les hooks \`useVaultRead\` ciblent toujours le coffre canonique.

## Identité de l'émetteur (auto-onboarding)

Le SDK est responsable de l'onboarding du DID d'émetteur : quand \`issue\` est appelé sans \`issuerDid\`, le client appelle de manière transparente \`getOrCreateIssuerIdentity({ controller, signTransaction })\` - il génère une clé Ed25519, crée un \`did:stellar\`, l'enregistre sur la chaîne (une signature de wallet, la première fois uniquement) et persiste l'identité.

- **Navigateur** : les identités persistent dans IndexedDB, avec la clé privée chiffrée au repos.
- **Node / serveur** : le stockage par défaut est **en mémoire** - un nouveau DID serait créé à chaque redémarrage. Les intégrateurs côté serveur doivent fournir un \`IssuerIdentityStorage\` persistant via \`ActaClientIdentityOptions\`.

## Gestion des erreurs

Toute requête client qui échoue est rejetée avec une **\`ActaApiError\`** (\`status\`, \`code\`, \`requestId?\`, \`isTimeout\`, \`isNetworkError\`, \`details?\`). Les requêtes expirent après 30 secondes par défaut. Utilisez l'export \`normalizeError(err)\` pour convertir les erreurs inconnues en \`ActaApiError\`.

## sponsoredVault

\`ActaClient.sponsoredVaultCreate\` prépare/soumet le \`deploy_sponsored\` de la factory quand un **sponsor** paie ou signe la création du coffre pour un **propriétaire**. La route de l'API exige une **clé d'API avec le rôle admin**. Voir **sponsoredVault** pour les signatures et les payloads.

Les propriétaires peuvent être des comptes Stellar ordinaires (\`G...\`) ou des identifiants de contrat smart-wallet (\`C...\`) : quand la signature est déléguée à l'infrastructure ACTA, omettez ou suivez les signatures décrites sur chaque page de hook.

## Méthodes dépréciées

\`createCredential\`, \`getDefaults\`, \`prepareStoreTx\`, \`prepareListVcIdsTx\`, \`prepareGetVcTx\` et \`vaultStore\` sont des stubs dépréciés dont la suppression est prévue en **2.0.0**. Migrez vers \`vcIssue\`, \`getConfig\`, \`vaultListVcIdsDirect\` et \`vaultGetVcDirect\` (ou les hooks).
    `,
};
