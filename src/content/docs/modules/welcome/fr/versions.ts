import type { DocPage } from "@/@types/docs";

export const versions: DocPage = {
  slug: "versions",
  title: "Versions et Changelog",
  section: "Bienvenue",
  tocItems: [
    "Ligne de versions actuelle",
    "Compatibilité",
    "Nouveautés de la v0.4.0",
    "Supprimé dans la v0.4.0",
    "Dépréciations et rétrocompatibilité",
    "Où vivent les changelogs",
  ],
  content: `
# Versions et Changelog

Les versions décrites par cette documentation, comment elles s'articulent et ce qui a changé dans la ligne de versions actuelle.

## Ligne de versions actuelle

| Composant | Package / artefact | Version |
|-----------|--------------------|---------|
| Credentials SDK | \`@acta-team/credentials\` | 1.1.4 |
| Bibliothèque DID | \`@acta-team/did-stellar\` | 0.1.1 |
| API ACTA | acta-api | 1.1.1 |
| dApp | dapp.acta.build | 2.1.1 |
| Contrat vc-vault | template WASM | 0.4.0 |
| Contrat vc-vault-factory | par réseau | 0.1.0 |
| Contrat did-stellar-registry | mainnet | 0.2.0 |
| Serveur MCP de la doc | \`@acta-team/docs-mcp\` | 0.1.0 |

## Compatibilité

- **SDK 1.1.2+** exige **acta-api 1.1.1** (la surface d'API vc-vault-factory v0.4.0). Les versions plus anciennes du SDK ciblent des endpoints supprimés et échoueront.
- Les URLs de base par défaut du SDK pointent vers l'API hébergée pour les deux réseaux, qui exécute les versions ci-dessus ; \`GET /config\` vous indique à l'exécution quelle factory, quel hash de template WASM et quel registre DID un déploiement utilise.
- Dépendance peer du SDK : React 18 ou 19.

## Nouveautés de la v0.4.0

La ligne de versions actuelle ("vc-vault-factory v0.4.0 + did:stellar", 2026-06-30) a introduit :

- **Coffres single-tenant déployés par une factory** : un \`vc-vault\` par propriétaire, adresses déterministes, en remplacement du coffre multi-tenant précédent (v0.3.0).
- **Émission deny-by-exception** : ouverte par défaut ; les propriétaires bloquent/débloquent les émetteurs (\`deny-issuer\` / \`allow-issuer\`).
- **did:stellar comme identité d'émetteur obligatoire**, avec la liaison contrôleur-signataire imposée par l'API ; le SDK auto-embarque les DID d'émetteur (\`getOrCreateIssuerIdentity\`).
- **Frais on-chain** via le \`quote_fee\` de la factory (mainnet 1 USDC, testnet 5 XLM), supprimant la logique de frais côté API et les surcharges de frais.
- **Coffres immuables** : le point d'entrée \`upgrade\` du coffre a été supprimé.
- Durcissement du SDK 1.1.4 : \`ActaApiError\` sur chaque échec, timeouts de 30s, hooks mémoïsés, identités IndexedDB chiffrées au repos.
- dApp 2.1.x : accès des émetteurs repensé comme une liste de blocage, stockage de l'API key limité à la session, en-têtes de sécurité, vérifications de sécurité des transactions avant signature.

## Supprimé dans la v0.4.0

Si vous vous êtes intégré sur la v0.3.0, les éléments suivants n'existent plus :

- Endpoints : \`POST /contracts/vc/issue-linked\`, \`GET /contracts/vault/get-vc-parent\`, \`authorize-issuers\` en lot, les lectures de liste/comptage des émetteurs autorisés, les endpoints de paliers de frais par rôle, et les endpoints de whitelist des sponsors (\`open-to-all\`, \`add-sponsor\`, \`remove-sponsor\`).
- Champs de requête : le champ \`holder\` séparé (le titulaire vit désormais dans \`vcData.credentialSubject.id\`) et toute surcharge de frais dans les corps de requête.
- Identité : \`did:pkh\` et les adresses de wallet nues comme DID d'émetteur.
- Méthodes du SDK : \`vcIssueLinked\`/\`issueLinked\`, \`vaultGetVcParent\`/\`getVcParent\` (1.1.2) et \`vaultMigrate\`, \`vaultAuthorizeIssuers\` en lot, les helpers de whitelist de coffre sponsorisé (1.1.3).

## Dépréciations et rétrocompatibilité

Fonctionne encore aujourd'hui, mais changera :

| Élément | Statut |
|------|--------|
| \`POST /contracts/vault/authorize-issuer\` / \`revoke-issuer\` | Alias rétrocompatibles de \`allow-issuer\` / \`deny-issuer\` |
| \`actaContractId\` dans \`GET /config\` | Alias rétrocompatible de \`factoryContractId\` |
| URLs à préfixe de chemin (style \`acta.build/api/{network}/...\`) | Héritées ; les hôtes canoniques sont \`api.{network}.acta.build\` |
| SDK \`createCredential\`, \`getDefaults\`, \`prepareStoreTx\`, \`prepareListVcIdsTx\`, \`prepareGetVcTx\`, \`vaultStore\` | Stubs dépréciés, suppression prévue pour le SDK 2.0.0 |

## Où vivent les changelogs

Chaque dépôt conserve son propre \`CHANGELOG.md\` sur l'[organisation GitHub ACTA-Team](https://github.com/ACTA-Team) : l'API, le credentials SDK, le dApp, les contrats, le monorepo DID et ce site de documentation.
    `,
};
