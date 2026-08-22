import type { DocPage } from "@/@types/docs";

export const architecture: DocPage = {
  slug: "architecture",
  title: "Architecture",
  section: "Bienvenue",
  tocItems: [
    "Composants du système",
    "Vault Factory (vc-vault-factory)",
    "Contrat de coffre (vc-vault)",
    "Couche API",
    "Stockage",
    "Modèle d'identité",
    "Adresses des contrats",
    "Prise en charge des réseaux",
  ],
  content: `
# Architecture

Vue d'ensemble technique de l'architecture et des composants du système ACTA.

## Composants du système

La couche on-chain d'ACTA (v0.4.0) s'articule autour de deux contrats Soroban : une seule **Vault Factory** par réseau et un **coffre single-tenant** détenu par chaque émetteur.

### Vault Factory (vc-vault-factory)

Il existe exactement une \`vc-vault-factory\` par réseau. Elle est responsable du déploiement et de la tarification des coffres par propriétaire :

- **Déploiement déterministe** : déploie un nouveau \`vc-vault\` pour un propriétaire à partir d'un template WASM. L'adresse du coffre est dérivée de \`(factory, owner, userSalt)\`.
- **Coffre canonique** : le \`userSalt\` par défaut est de 32 octets à zéro, ce qui donne un coffre canonique par propriétaire. Des salts distincts permettent des coffres supplémentaires pour le même propriétaire.
- **Coffres immuables** : les coffres sont déployés à partir d'un template WASM fixe et sont immuables une fois créés.
- **Cotation des frais** : expose \`quote_fee\`, les frais d'émission on-chain payés par l'émetteur (mainnet : 1 USDC par credential ; testnet : 5 XLM par credential).

### Contrat de coffre (vc-vault)

Chaque propriétaire possède son **propre** contrat \`vc-vault\` single-tenant. Il n'existe pas de stockage partagé multi-tenant. Le coffre gère le cycle de vie complet des credentials on-chain :

- **Issue / Batch issue** : crée de nouveaux credentials dans le coffre (unitaire ou jusqu'à 5 par lot). L'émission facture des frais on-chain via le \`quote_fee\` de la factory, payés par l'émetteur.
- **Verify** : vérification publique du statut d'un credential (\`valid\`, \`revoked\` ou \`invalid\`).
- **Revoke** : révoque des credentials avec une date de révocation optionnelle (signé par le propriétaire du coffre).
- **List / Get / Count** : récupère les identifiants de credentials (paginés) et les données des credentials depuis le coffre du propriétaire.
- **Push** : déplace un credential vers un autre coffre déployé par la factory avec le même propriétaire.
- **DID du coffre** : le coffre stocke l'URI du DID du propriétaire, modifiable avec \`set_vault_did\`.
- **Contrôle des émetteurs** : l'émission est **ouverte par défaut** (deny-by-exception). Il n'y a pas de liste d'autorisation. L'admin du coffre peut **bloquer** un émetteur avec \`deny_issuer\` et le **débloquer** avec \`allow_issuer\`.

Les fonctions des contrats sont exposées via des endpoints de l'API. Consultez la Référence API pour les détails.

### Couche API

API RESTful fournissant :

- **Opérations de credentials** : émettre, vérifier, révoquer
- **Opérations de coffre** : déployer, stocker, récupérer, gérer les coffres par propriétaire
- **Préparation de transactions** : générer des transactions XDR non signées pour une signature côté client
- **Opérations de lecture** : interroger les credentials et l'état du coffre (aucune signature requise)

Tous les endpoints prennent en charge automatiquement mainnet et testnet via la configuration \`NETWORK_TYPE\`.

### Stockage

- **On-chain** : hashes des credentials et métadonnées de statut (smart contracts Soroban)
- **Off-chain** : contenus de credentials chiffrés (coffres contrôlés par le propriétaire)

## Modèle d'identité

L'identité de l'émetteur est un \`did:stellar\` enregistré et résolvable :

\`\`\`
did:stellar:{network}:{address}
\`\`\`

- **DID de l'émetteur** : l'émetteur doit avoir un \`did:stellar\` enregistré dans un registre did:stellar. Une simple clé de wallet ou un \`did:pkh\` n'est plus utilisé comme DID d'émetteur.
- **Sujet / titulaire** : le titulaire du credential est identifié par un DID, exprimé dans \`credentialSubject.id\` à l'intérieur du credential.

> **Note** : la v0.4.0 utilise \`did:stellar\` pour l'identité de l'émetteur, résolue via le registre did:stellar on-chain. La documentation complète de la méthode (syntaxe, registre, resolver, bibliothèque) se trouve dans la **[section DID](doc:did-overview)**.

## Adresses des contrats

**Mainnet**

- **vc-vault-factory** : \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\`
- **did:stellar registry** : \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\`
- **Hash WASM du template vc-vault** : \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\`

**Testnet**

- **vc-vault-factory** : \`CDRFQRIP4FA3WMPWCSAM3XEY6EM6EGKRYZRSCSVZ5NHCF6AGEVR2XEPQ\`
- **did:stellar registry** : \`CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ\`
- **Hash WASM du template vc-vault** : \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\`

> Le contrat \`vc-vault\` n'a **pas d'identifiant de contrat autonome** : c'est un template WASM instancié par propriétaire par la factory.

## Prise en charge des réseaux

ACTA gère automatiquement la configuration réseau :

- **Testnet** : \`https://sandbox-api.acta.build\` ou \`NETWORK_TYPE=testnet\`
- **Mainnet** : \`https://production-api.acta.build\` ou \`NETWORK_TYPE=mainnet\`

Les identifiants de contrats, les URLs RPC et les network passphrases sont configurés automatiquement selon le type de réseau.
    `,
};
