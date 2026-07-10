import type { DocPage } from "@/@types/docs";

export const contractsReference: DocPage = {
  slug: "contracts-reference",
  title: "Référence des Contrats",
  section: "Contrats",
  tocItems: [
    "Aperçu",
    "vc-vault",
    "Rôles du coffre",
    "Fonctions du coffre",
    "Limites du coffre",
    "Événements du coffre",
    "vc-vault-factory",
    "Fonctions de la factory",
    "Adresses déterministes",
    "Contrats déployés",
    "Immutabilité et stockage",
  ],
  content: `
# Référence des Contrats

L'interface publique des contrats Soroban d'ACTA, pour les équipes qui intègrent au niveau du contrat (Rust, CLI ou outillage personnalisé) sans passer par l'API ACTA. Le code source se trouve dans le dépôt **contracts-acta** ; les codes d'erreur sont sur **[Erreurs de contrat](doc:contract-errors)** et l'interface du registre did:stellar est documentée dans la section **[Registre et Resolver](doc:did-registry)**.

## Aperçu

| Contract | Version | Rôle |
|----------|---------|------|
| \`vc-vault\` | 0.4.0 | Coffre de credentials mono-locataire, un par propriétaire, instancié par la factory à partir d'un template WASM |
| \`vc-vault-factory\` | 0.1.0 | Une par réseau ; déploie les coffres de manière déterministe et fournit le devis des frais d'émission |
| \`did-stellar-registry\` | 0.2.0 | Enregistrements de DID émetteurs (voir [Registre et Resolver](doc:did-registry)) |

## vc-vault

Chaque coffre est construit par la factory avec \`(vault_owner, contract_admin, did_uri, factory_address)\`. L'admin du coffre est initialement le propriétaire.

## Rôles du coffre

| Rôle | Peut appeler |
|------|--------------|
| \`contract_admin\` | \`nominate_admin\` ; un nominé appelle \`accept_contract_admin\` (pas de pouvoirs d'upgrade ni de frais) |
| Admin du coffre (propriétaire par défaut) | \`set_vault_admin\`, \`deny_issuer\`, \`allow_issuer\`, \`revoke_vault\`, \`push\` |
| \`vault_owner\` | \`set_vault_did\`, \`revoke\` |
| Tout émetteur non bloqué | \`issue\`, \`batch_issue\` |

## Fonctions du coffre

| Function | Auth | Notes |
|----------|------|-------|
| \`version() -> String\` | Aucune | Renvoie la version du crate, par exemple \`"0.4.0"\` |
| \`vault_owner() -> Address\` | Aucune | |
| \`vault_did() -> Option<String>\` | Aucune | |
| \`set_vault_did(did_uri)\` | Propriétaire du coffre | \`did_uri\` jusqu'à 256 octets |
| \`set_vault_admin(new_admin)\` | Admin du coffre | |
| \`deny_issuer(issuer_addr)\` | Admin du coffre | Sans effet si déjà bloqué ; liste plafonnée à 1 000 |
| \`allow_issuer(issuer_addr)\` | Admin du coffre | Sans effet si absent |
| \`revoke_vault()\` | Admin du coffre | **Irréversible** ; bloque toutes les écritures |
| \`issue(vc_id, vc_data, vault_contract, issuer_addr, issuer_did) -> String\` | Émetteur | Prélève sur l'émetteur les frais devisés par la factory ; un \`vc_id\` en double échoue |
| \`batch_issue(issuer_addr, vault_contract, issuer_did, vcs) -> Vec<String>\` | Émetteur | \`vcs\` = liste de \`(vc_id, vc_data)\`, 1 à 5 entrées ; transfert de frais unique de unitaire x n |
| \`revoke(vc_id, date)\` | Propriétaire du coffre | Le credential doit être valide ; le statut devient \`Revoked(date)\` |
| \`push(vc_id, dest_vault)\` | Admin du coffre | Déplace un credential valide vers un autre coffre déployé par la factory avec le **même propriétaire**, puis le supprime localement |
| \`receive_push(source_vault, source_owner, vc_id, vc_data, issuer_did)\` | Coffre source | Valide la source via \`is_vault\` de la factory et la règle du même propriétaire |
| \`list_vc_ids(offset, limit) -> Vec<String>\` | Aucune | \`limit\` jusqu'à 200 |
| \`vc_count() -> u32\` | Aucune | |
| \`get_vc(vc_id) -> Option<VerifiableCredential>\` | Aucune | Renvoie \`{ id, data, issuance_contract, issuer_did }\` ; \`data\` est la charge utile chiffrée |
| \`verify_vc(vc_id) -> VCStatus\` | Aucune | \`Valid\`, \`Invalid\` ou \`Revoked(date)\`. **Statut uniquement** : ne prouve pas qui a émis ; vérifiez \`issuer_did\` pour cela |
| \`list_denied_issuers(offset, limit) -> Vec<Address>\` | Aucune | \`limit\` jusqu'à 200 |
| \`denied_issuer_count() -> u32\` | Aucune | |
| \`nominate_admin(new_admin)\` / \`accept_contract_admin()\` | Admin / nominé | Transfert de contract-admin en deux étapes |

## Limites du coffre

| Limite | Valeur |
|--------|--------|
| \`vc_id\` | max 64 octets |
| \`vc_data\` | max 10 000 octets |
| \`did_uri\` / \`issuer_did\` | max 256 octets |
| \`date\` | max 64 octets |
| Taille de lot | max 5 credentials |
| Taille de page de liste | max 200 |
| Émetteurs bloqués | max 1 000 |

## Événements du coffre

\`ContractInitialized\`, \`VaultCreated\`, \`AdminNominated\`, \`AdminTransferred\`, \`VaultAdminChanged\`, \`VaultDidChanged\`, \`IssuerDenied\`, \`IssuerAllowed\`, \`VaultRevoked\`, \`VCIssued\` (par credential, également émis sur les lots et sur \`receive_push\`), \`VCRevoked\`, \`VCPushed\`.

## vc-vault-factory

Construite une fois par réseau avec \`VaultInitMeta { vault_hash, contract_admin }\`. Le hash du template n'a **aucun setter** : livrer un nouveau code de coffre implique de déployer une nouvelle factory.

## Fonctions de la factory

| Function | Auth | Notes |
|----------|------|-------|
| \`deploy(owner, did_uri, user_salt) -> Address\` | Propriétaire | Déploie le coffre du propriétaire ; émet \`VaultDeployed\` |
| \`deploy_sponsored(deployer, owner, did_uri, user_salt) -> Address\` | Deployer | Le sponsor paie et signe ; le coffre appartient à \`owner\` ; émet \`SponsoredVaultDeployed\` |
| \`is_vault(vault_address) -> bool\` | Aucune | Vrai si et seulement si déployé par cette factory |
| \`quote_fee(issuer) -> FeeQuote\` | Aucune | \`{ enabled, amount, token, dest }\` ; le tarif personnalisé par émetteur (avec expiration optionnelle) prime sur le tarif standard |
| \`set_fee_config(token, dest, standard)\` | Admin | |
| \`set_fee_enabled(enabled)\` | Admin | L'activation exige que token + dest + standard soient configurés |
| \`set_fee_standard(amount)\` / \`set_min_fee(amount)\` | Admin | Montants validés non négatifs, au-dessus des frais minimum et au plus 10^18 |
| \`set_fee_custom(issuer, amount, expires_at?)\` / \`remove_fee_custom(issuer)\` | Admin | L'expiration doit être dans le futur |
| \`nominate_admin\` / \`accept_admin\` / \`get_admin\` | Admin / nominé / aucune | Transfert en deux étapes |

## Adresses déterministes

L'adresse du coffre est dérivée avant le déploiement, sans table de correspondance :

\`\`\`
deploy_salt = keccak256(user_salt (32 bytes) || XDR(ScAddress(owner)))
\`\`\`

Le propriétaire est encodé en **XDR** ScAddress canonique (pas la forme textuelle \`G...\`). Le même couple \`(owner, user_salt)\` donne toujours la même adresse ; le sel par défaut est 32 octets à zéro (un coffre canonique par propriétaire). Mélanger le propriétaire dans le sel évite les collisions entre propriétaires et le front-running.

## Contrats déployés

**Mainnet** (passphrase \`Public Global Stellar Network ; September 2015\`)

| Contract | ID / hash |
|----------|-----------|
| vc-vault-factory | \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\` |
| vc-vault template WASM | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| Configuration des frais | Activés ; 1 USDC par credential (SAC USDC \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\`) |

**Testnet** (passphrase \`Test SDF Network ; September 2015\`)

| Contract | ID / hash |
|----------|-----------|
| vc-vault-factory | \`CDRFQRIP4FA3WMPWCSAM3XEY6EM6EGKRYZRSCSVZ5NHCF6AGEVR2XEPQ\` |
| vc-vault template WASM | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| Configuration des frais | Activés ; 5 XLM par credential (SAC XLM natif) |

Le contrat \`vc-vault\` n'a pas d'identifiant de contrat autonome sur aucun des deux réseaux : il n'existe que sous forme d'instances par propriétaire déployées par la factory.

## Immutabilité et stockage

- **Pas de points d'entrée d'upgrade** : ni le coffre (depuis la 0.4.0) ni la factory ne peuvent remplacer leur code.
- Les données de credentials et les index du coffre résident dans le stockage Soroban **persistant** ; le stockage d'instance contient l'état d'administration. Les TTLs sont prolongés à la fois en lecture et en écriture (seuil ~30 jours, extension ~180 jours à des ledgers de 5 secondes).
- Les contrats sont compilés pour la cible \`wasm32v1-none\` et optimisés avec la CLI Stellar.
    `,
};
