import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Erreurs de contrat",
  section: "Contrats",
  tocItems: [
    "En une minute",
    "Quand cela apparaît",
    "Frais d'émission (USDC / XLM)",
    "Coffre (vc-vault)",
    "Factory (vc-vault-factory)",
    "Registre did:stellar",
    "Erreurs au niveau de l'API",
    "Pour les développeurs",
  ],
  content: `
# Erreurs de contrat

Si quelque chose échoue à l'intérieur d'un contrat Soroban, Stellar renvoie **\`Error(Contract, #N)\`** où **N** est un nombre. **Important :** le même **N** signifie des choses différentes sur le **coffre**, la **factory**, le **registre did:stellar** ou le **token USDC** qui collecte les frais d'émission. Faites toujours correspondre le code au contrat que vous avez réellement invoqué. Les codes ci-dessous correspondent aux contrats v0.4.0 déployés ; les enums peuvent être renumérotés entre les versions, donc en cas de doute confirmez avec le code source (voir *Pour les développeurs*).

## En une minute

- **Factory (vc-vault-factory)** - Une par réseau. Déploie de manière déterministe des contrats \`vc-vault\` mono-locataires à partir d'un template WASM de coffre, et fournit le devis des frais on-chain (\`quote_fee\`).
- **Coffre (vc-vault)** - Un par propriétaire, déployé par la factory. Contient les credentials de ce propriétaire. L'émission est **ouverte par défaut** (blocage par exception) : les propriétaires bloquent/débloquent les émetteurs. Les frais d'émission sont prélevés on-chain (USDC sur mainnet, XLM sur testnet), payés par l'émetteur. Les coffres sont **immuables** (le template est fixé au déploiement).
- **Registre did:stellar** - Un contrat séparé pour les métadonnées de DID émetteurs ; il a ses propres codes d'erreur.
- **Token USDC** - L'émission prélève des frais, transférés par le contrat de token USDC. Ses erreurs concernent les trustlines et les soldes, pas les coffres (voir ci-dessous).
- **Erreurs au niveau de l'API** - Certains échecs (comme un contrôleur de DID non concordant) sont renvoyés par l'API ACTA, avant même qu'un contrat ne soit atteint.

## Quand cela apparaît

- **Souvent au submit** - Prepare peut tout de même renvoyer un XDR ; l'erreur n'apparaît souvent que lorsque votre transaction signée s'exécute on-chain.
- **Souvent au prepare** - L'API simule pendant la préparation, donc les échecs on-chain (y compris le transfert des frais USDC) peuvent aussi apparaître comme l'erreur de l'appel prepare.
- **RPC / Horizon** - Les réponses de simulation ou de soumission en échec incluent le code d'erreur du contrat et un journal d'événements de diagnostic.
- **Réponses de l'API** - Les erreurs au niveau de l'API arrivent sous forme d'erreur structurée dans la réponse HTTP, avant ou à la place d'un code Soroban.

## Frais d'émission (USDC / XLM)

Émettre un credential prélève des **frais on-chain** (devisés par le \`quote_fee\` de la factory, payés par l'**émetteur**) : sur **mainnet** le token de frais est l'**USDC** (1 USDC par credential) ; sur **testnet** c'est le **XLM natif** (5 XLM par credential), donc aucune trustline n'y est impliquée. Le transfert s'exécute à l'intérieur du contrat du token de frais, donc lorsqu'il échoue, l'erreur provient du token, pas du coffre. C'est l'échec d'émission le plus courant en conditions réelles sur mainnet.

| Ce que vous voyez | Ce qui s'est passé et quoi essayer |
|-------|----------------------------|
| **"trustline entry is missing for account"** | Le wallet de l'émetteur n'a pas de **trustline USDC**, il ne peut donc ni détenir ni envoyer d'USDC. **Essayez :** ajoutez une trustline USDC au wallet de l'émetteur (Circle USDC sur mainnet), puis réessayez. |
| **insufficient / "balance is not sufficient"** | L'émetteur a une trustline USDC mais **pas assez d'USDC** pour couvrir les frais. **Essayez :** approvisionnez le wallet de l'émetteur en USDC et réessayez. |

> Le contrat de token USDC a ses **propres** codes d'erreur qui ne correspondent **pas** à ceux du coffre. Par exemple, le "trustline missing" du token est son propre code, sans rapport avec un quelconque \`#N\` de coffre. Identifiez un échec de frais par le texte de diagnostic (trustline / solde) et par l'identifiant du contrat de token dans le journal d'événements, pas par le simple numéro.

Si votre déploiement ne souhaite pas encore prélever de frais, l'admin de la factory peut les désactiver avec \`set_fee_enabled(false)\` ou fixer les frais standard à \`0\`.

## Coffre (vc-vault)

Ces codes concernent **uniquement** \`vc-vault\`, sous le modèle de **blocage par exception** (tout émetteur est autorisé tant que le propriétaire ne l'a pas bloqué).

| Erreur | Ce qui s'est passé et quoi essayer |
|-------|----------------------------|
| **#4** · VaultRevoked | Le coffre est révoqué, donc les écritures qui exigent un coffre actif sont bloquées. **Essayez :** cessez d'émettre dans ce coffre ; gérez la récupération off-chain. |
| **#6** · VCNotFound | Aucun credential avec ce \`vc_id\` dans ce coffre (faute de frappe, mauvais réseau ou mauvais coffre). **Essayez :** listez les \`vc_id\` du coffre ; revérifiez \`owner\` + \`vc_id\`. |
| **#7** · VCAlreadyRevoked | Vous avez révoqué un credential déjà révoqué. **Essayez :** rafraîchissez l'état depuis la chaîne ; considérez le VC comme invalide. |
| **#8** · VaultNotInitialized | Il n'y a pas encore de coffre pour ce propriétaire. **Essayez :** créez le coffre du propriétaire (via la factory) avant d'émettre. |
| **#9** · NotInitialized | Le contrat n'a ni admin ni configuration. **Essayez :** confirmez que vous appelez le bon coffre \`C...\` pour ce réseau. |
| **#10** · InvalidVaultContract | Un paramètre \`vault_contract\` ne pointe pas vers le coffre appelé. **Essayez :** passez le bon identifiant de coffre \`C...\` ; rafraîchissez l'adresse dérivée et réessayez. |
| **#12** · VCAlreadyExists | L'émission a utilisé un \`vc_id\` qui existe déjà dans ce coffre. **Essayez :** choisissez un nouveau \`vc_id\`, ou considérez le credential comme déjà émis. |
| **#13** · NoPendingAdmin | \`accept_contract_admin\` a été exécuté mais aucune nomination d'admin n'est en attente. **Essayez :** nommez d'abord le nouvel admin, puis acceptez. |
| **#15** · VaultFull | Le coffre a atteint son nombre maximum de credentials actifs. **Essayez :** révoquez des VCs inutilisés ou utilisez un coffre séparé. |
| **#16** · LimitTooLarge | Un \`limit\` de pagination dépasse le maximum du contrat. **Essayez :** demandez une taille de page plus petite. |
| **#17** · BatchTooLarge | Une émission par lot dépasse \`MAX_BATCH_SIZE\`. **Essayez :** divisez en lots plus petits. |
| **#18** · BatchEmpty | L'émission par lot a été appelée avec une liste vide. **Essayez :** incluez au moins un credential. |
| **#19** · InputTooLong | Un champ (vc_id, vc_data, did_uri, issuer_did ou date) dépasse sa longueur maximale. **Essayez :** raccourcissez le champ. |
| **#20** · IssuerListTooLong | La **liste des émetteurs bloqués** du coffre a atteint son maximum (1 000 entrées). **Essayez :** débloquez les émetteurs que vous n'avez plus besoin de bloquer avant d'en bloquer de nouveaux. |
| **#23** · FeeOutOfBounds | Le total des frais du lot (frais par credential x taille du lot) a débordé \`i128\`. **Essayez :** réduisez la taille du lot. |
| **#24** · SourceNotAVault | Une source de push n'est pas un coffre déployé par la factory. **Essayez :** ne poussez qu'entre coffres déployés par la factory. |
| **#25** · IssuerDenied | L'émetteur est dans la **liste des bloqués** de ce coffre, donc l'émission est rejetée. **Essayez :** le propriétaire peut le débloquer avec \`allow_issuer\`, ou utilisez un autre émetteur (autorisé). |
| **#26** · PushOwnerMismatch | Un coffre source de \`receive_push\` a un propriétaire différent de ce coffre. **Essayez :** ne poussez qu'entre coffres ayant le même propriétaire. |

> Les codes **#2** (IssuerNotAuthorized) et **#3** (IssuerAlreadyAuthorized) sont retirés de l'ancien modèle de liste blanche d'émetteurs et ne sont plus levés, mais conservés pour la stabilité de l'ABI.

## Factory (vc-vault-factory)

Une factory par réseau déploie et suit chaque \`vc-vault\`. Ces codes concernent **uniquement** \`vc-vault-factory\`.

| Erreur | Ce qui s'est passé et quoi essayer |
|-------|----------------------------|
| **#1** · NoPendingAdmin | \`accept_admin\` a été exécuté mais aucune nomination d'admin n'est en attente. **Essayez :** nommez d'abord le nouvel admin, puis acceptez. |
| **#2** · InvalidFeeAmount | Un montant de frais est négatif. **Essayez :** passez un montant non négatif. |
| **#3** · FeeOutOfBounds | Un montant de frais dépasse \`MAX_FEE_AMOUNT\`. **Essayez :** utilisez une valeur dans la plage autorisée. |
| **#4** · FeeBelowMin | Un montant de frais est inférieur au \`MinFee\` configuré. **Essayez :** augmentez le montant au moins jusqu'au minimum. |
| **#5** · FeeNotConfigured | \`set_fee_enabled(true)\` a été appelé avant que token + dest + frais standard ne soient définis. **Essayez :** configurez les frais (\`set_fee_config\`) avant de les activer. |
| **#6** · ExpiryInPast | Une expiration de frais personnalisés par émetteur n'est pas dans le futur. **Essayez :** utilisez un timestamp futur ou omettez l'expiration. |
| **#7** · NotInitialized | \`VaultMeta\` est manquant (le constructeur n'a jamais été exécuté ou l'état a été perdu). **Essayez :** utilisez la factory en production pour ce réseau. |

## Registre did:stellar

Les codes ci-dessous appartiennent **uniquement** au **registre did:stellar**, le contrat qui stocke les enregistrements de DID émetteurs. Ne les mélangez pas avec les codes du coffre ou de la factory.

| Erreur | Ce qui s'est passé et quoi essayer |
|-------|----------------------------|
| **#1** · DidAlreadyExists | \`register\` a été appelé pour un identifiant de DID qui existe déjà. **Essayez :** résolvez le DID existant, ou utilisez un nouvel identifiant. |
| **#2** · DidNotFound | Une mise à jour / résolution / un transfert a référencé un DID non enregistré. **Essayez :** vérifiez l'identifiant du DID et le réseau ; enregistrez-le d'abord. |
| **#3** · VersionMismatch | Une mise à jour a envoyé une version qui ne correspond pas à l'enregistrement stocké (concurrence optimiste). **Essayez :** relisez l'enregistrement et réessayez avec la version courante. |
| **#4** · DidDeactivated | Le DID a été désactivé et ne peut plus être mis à jour ni utilisé. **Essayez :** enregistrez un nouveau DID. |
| **#5** · InvalidAuthKeyCount | Le nombre de clés d'authentification est hors de la plage autorisée. **Essayez :** incluez un nombre valide de clés d'authentification. |
| **#6** · InvalidAssertionKeyCount | Le nombre de clés assertionMethod est hors de la plage autorisée. **Essayez :** ajustez les clés d'assertion. |
| **#7** · InvalidKeyAgreementCount | Le nombre de clés keyAgreement est hors de la plage autorisée. **Essayez :** ajustez les clés de key agreement. |
| **#8** · InvalidServiceCount | Le nombre de services dépasse la limite. **Essayez :** réduisez le nombre de services. |
| **#9** · DuplicateKey | La même clé apparaît plusieurs fois là où elle doit être unique. **Essayez :** supprimez le doublon. |
| **#10** · KeyTooLong | Une valeur multibase de clé dépasse la longueur maximale. **Essayez :** vérifiez l'encodage/la longueur de la clé. |
| **#11** · KeyEmpty | Une valeur de clé est vide. **Essayez :** fournissez une clé multibase valide. |
| **#12** · ServiceTypeTooLong | Un \`type\` de service dépasse la longueur maximale. **Essayez :** raccourcissez le type. |
| **#13** · ServiceIdTooLong | Un suffixe d'\`id\` de service dépasse la longueur maximale. **Essayez :** raccourcissez le suffixe de l'identifiant. |
| **#14** · ServiceIdInvalidFormat | Un suffixe d'\`id\` de service a un format invalide. **Essayez :** utilisez un suffixe d'identifiant valide. |
| **#15** · ServiceEndpointInvalid | Un endpoint de service n'est pas une URI valide. **Essayez :** fournissez une URI d'endpoint valide. |
| **#16** · MetadataUriInvalid | Une URI de métadonnées est invalide. **Essayez :** fournissez une URI valide. |
| **#17** · NoProposedAdmin | \`accept_admin\` a été exécuté sans nomination d'admin en attente. **Essayez :** nommez d'abord, puis acceptez. |
| **#18** · ServiceTypeEmpty | Un \`type\` de service est vide. **Essayez :** fournissez un type non vide. |
| **#19** · VersionOverflow | Le compteur de version de l'enregistrement a débordé. **Essayez :** cela est en pratique quasi impossible à atteindre ; contactez les mainteneurs. |
| **#20** · MetadataInconsistent | Les métadonnées stockées sont incohérentes en interne. **Essayez :** soumettez à nouveau un enregistrement cohérent. |
| **#21** · DuplicateServiceId | Deux services partagent le même suffixe d'\`id\`. **Essayez :** rendez chaque suffixe d'identifiant de service unique. |

## Erreurs au niveau de l'API

Certains échecs n'atteignent jamais un contrat : l'API ACTA les rejette d'abord et renvoie une erreur structurée (un \`code\` stable plus un message).

**DID émetteur (\`did:stellar\` uniquement) :** l'émetteur doit être un \`did:stellar\` enregistré et résoluble dont le contrôleur on-chain est égal à l'émetteur signataire. Les adresses de wallet brutes et les valeurs \`did:pkh\` ne sont pas acceptées comme DID émetteur.

| Code | Signification et quoi essayer |
|------|-----------------------|
| **\`issuerDid_required\`** | Aucun DID émetteur n'a été fourni. **Essayez :** enregistrez votre \`did:stellar\` (la dApp vous guide dans cette démarche, et le SDK peut l'auto-enregistrer) et transmettez-le. |
| **\`issuerDid_invalid\`** | La valeur n'est pas un \`did:stellar\` bien formé. **Essayez :** utilisez la forme \`did:stellar:{network}:{id}\`. |
| **\`issuerDid_unresolvable\`** | Le DID ne se résout pas sur le registre de ce réseau (non enregistré, ou enregistré ailleurs). **Essayez :** enregistrez le DID sur ce réseau avant d'émettre. |
| **\`issuerDid_controller_mismatch\`** | Le contrôleur on-chain du DID n'est pas l'émetteur signataire. **Essayez :** signez avec le wallet qui contrôle le DID. |
| **\`issuerDid_network_mismatch\`** | Le réseau du DID ne correspond pas au réseau sur lequel vous émettez. **Essayez :** changez de réseau, ou utilisez un DID enregistré sur celui-ci. |
| **\`issuerDid_deactivated\`** | Le DID a été désactivé. **Essayez :** enregistrez un nouveau DID. |
| **\`issuerDid_registry_unavailable\`** | Aucun registre n'est configuré pour ce réseau sur l'API. **Essayez :** réessayez plus tard ou contactez l'opérateur. |

**Validation :** \`owner_invalid\` / \`owner_required\`, \`issuer_invalid\` / \`issuer_required\`, \`vcId_required\`, \`vcData_required\`, \`vaultContract_invalid\` (doit être un \`C...\` valide) et \`userSalt_invalid\` (doit être 32 octets en hexadécimal) sont renvoyés pour les requêtes malformées. **Essayez :** corrigez le champ fautif et renvoyez.

## Pour les développeurs

Les enums faisant autorité se trouvent dans **contracts-acta** : \`contracts/vc-vault/src/error.rs\`, \`contracts/vc-vault-factory/src/error.rs\` et \`contracts/did-stellar-registry/src/errors.rs\`. L'erreur de frais USDC provient du **Stellar Asset Contract** du token de frais configuré (ses codes sont définis par Stellar, pas par ACTA). L'API mappe les codes de contrat reconnus vers des \`code\`s chaîne stables ; confirmez avec le code source pour votre version déployée.
    `,
};
