import type { DocPage } from "@/@types/docs";

export const registry: DocPage = {
  slug: "did-registry",
  title: "Registre et Resolver",
  section: "DID",
  tocItems: [
    "Registre sur la chaîne",
    "L'enregistrement DID",
    "Limites de l'enregistrement",
    "Opérations du contrat",
    "Contrats déployés",
    "États de résolution",
    "Resolver hébergé (did.acta.build)",
    "Endpoints",
    "Endpoint de résolution",
    "Endpoints de mutation",
    "Prepare/Submit",
    "Limites de débit et erreurs",
  ],
  content: `
# Registre et Resolver

L'état de chaque \`did:stellar\` vit dans le contrat Soroban **did-stellar-registry**. Le resolver hébergé sur **\`https://did.acta.build\`** est une commodité HTTP sans état par-dessus : il résout les DIDs, prépare des XDR non signés et soumet les XDR signés. Il n'exige **aucune authentification** et ne détient jamais de clés.

## Registre sur la chaîne

- Une entrée par DID dans le **stockage persistant Soroban**, indexée par l'identifiant DID de 16 octets.
- **Les lectures sont gratuites** : la résolution utilise \`getLedgerEntries\` sur le RPC Stellar, sans transaction ni frais.
- Le contrat est un *magasin passif* : il persiste exactement ce que \`register\`/\`update\` envoient. Il ne remplit jamais de valeurs par défaut et n'invente pas de clés. Les champs de tenue de registre (\`version\`, \`createdLedger\`, \`updatedLedger\`, \`deactivated\`) appartiennent au contrat et écrasent tout ce que l'appelant passe.

## L'enregistrement DID

| Champ | Type | Contrainte |
|-------|------|-----------|
| \`controller\` | Adresse Stellar | Comptes classiques \`G...\` uniquement (v0.1) |
| \`authentication\` | \`DidKey[]\` | 1 à 3 clés (au moins 1 requise) |
| \`assertionMethod\` | \`DidKey[]\` | 0 à 3 clés |
| \`keyAgreement\` | \`DidKey[]\` | 0 ou 1 clé |
| \`services\` | \`DidService[]\` | 0 à 3 entrées |
| \`metadataUri\` | chaîne optionnelle | HTTPS uniquement, max 255 caractères |
| \`metadataHash\` | 32 octets optionnels | SHA-256 ; exige \`metadataUri\` |
| \`version\` | u32 | Démarre à 1, +1 par mutation |
| \`createdLedger\` / \`updatedLedger\` | u32 | Numéros de séquence du ledger |
| \`deactivated\` | bool | Drapeau à sens unique |

\`DidKey\` est \`{ publicKeyMultibase }\`. \`DidService\` est \`{ idSuffix, serviceType, serviceEndpoint }\`, exposé dans le document sous la forme \`{did}#service-{idSuffix}\`.

## Limites de l'enregistrement

| Limite | Valeur |
|-------|-------|
| Longueur du multibase des clés | max 128 caractères |
| \`idSuffix\` de service | max 32 caractères, \`^[a-z0-9]([a-z0-9-]*[a-z0-9])?$\` |
| \`serviceType\` de service | max 64 caractères, non vide |
| URLs de service / métadonnées | HTTPS uniquement, max 255 caractères |

## Opérations du contrat

| Opération | Auth | Concurrence optimiste |
|-----------|------|------------------------|
| \`register(did_id, initial_record)\` | \`initial_record.controller\` signe | Non (nouvelle entrée) |
| \`update(did_id, expected_version, next_record)\` | Contrôleur actuel | Oui |
| \`transfer_controller(did_id, expected_version, new_controller)\` | Contrôleur actuel | Oui |
| \`deactivate(did_id, expected_version)\` | Contrôleur actuel | Oui |
| \`get(did_id)\` | Aucune (lecture) | Non |

Les codes d'erreur du contrat sont documentés dans **[Erreurs de contrat](doc:contract-errors)** (table du registre did:stellar).

## Contrats déployés

| Réseau | ID du contrat de registre |
|---------|----------------------|
| Testnet | \`CB7ATU7SF5QUKJMSULJDJVWJZVDXC23HTZX6NFUDTSFPVT6MA575NNZJ\` |
| Mainnet | \`CD6LSWW5ZSXOO5WAIHKQLQ262TW7BPI37PNEVMMA273BAPC65NN2AYXQ\` |

Ce sont les registres utilisés par \`did.acta.build\`, l'API ACTA et les valeurs par défaut des bibliothèques.

## États de résolution

Résoudre un DID qui n'existe pas n'est pas une exception, c'est une réponse. Chaque résultat prend l'une de ces cinq formes : la bibliothèque la signale dans \`didResolutionMetadata.error\`, et le resolver hébergé la traduit en plus en statut HTTP.

| État | \`didDocument\` | \`didResolutionMetadata.error\` | HTTP |
|------|----------------|--------------------------------|------|
| **Actif** | Document complet, \`didDocumentMetadata.deactivated: false\` | absent | \`200\` |
| **Tombstone** | Document dont tous les tableaux de relations sont vides, \`deactivated: true\` | absent | \`410\` |
| **Introuvable** | \`null\` | \`notFound\` | \`404\` |
| **DID invalide** | \`null\` | \`invalidDid\` | \`400\` |
| **RPC injoignable** | \`null\` | \`internalError\` | \`502\` |

- **Un tombstone n'est pas un échec.** Un DID désactivé se résout toujours, et c'est nécessaire : un vérificateur doit distinguer *désactivé* de *n'a jamais existé*. Le drapeau est à sens unique et ne peut pas être remis à zéro.
- **« Introuvable » ne bascule jamais vers un autre réseau.** Le réseau fait partie du DID, donc les identifiants testnet et mainnet sont lus dans des registres différents.
- **Le DID invalide est tranché avant tout appel réseau**, par les règles de syntaxe de **[Overview](doc:did-overview)**.
- **\`internalError\` parle de l'endpoint, pas du DID.** Le nœud RPC Stellar n'a pas répondu. Réessayez, ou pointez \`rpcUrl\` vers un autre nœud.

Dans la bibliothèque TypeScript, \`resolveDidStellar()\` réserve les exceptions aux erreurs de l'appelant : un DID mal formé (\`did_invalid\`) ou une configuration invalide (\`rpc_url_invalid\`, \`contract_id_invalid\`). Tout le reste est renvoyé comme donnée : branchez sur \`didResolutionMetadata.error\`, pas sur \`try/catch\`.

## Resolver hébergé (did.acta.build)

- **Aucune authentification** et **aucune garde de clés** : il ne manipule que des XDR non signés et signés.
- **Multi-réseau** : un seul déploiement sert testnet et mainnet, en routant chaque requête selon le réseau contenu dans le DID.
- Sans état et horizontalement scalable ; les résultats de résolution sont en cache ~30 secondes.

## Endpoints

| Méthode | Chemin | Rôle |
|--------|------|---------|
| GET | \`/health\` | Vivacité + réseaux configurés |
| GET | \`/docs\` | Swagger UI |
| GET | \`/openapi.json\` | Spécification OpenAPI 3.1 |
| GET | \`/1.0/identifiers/{did}\` | Endpoint **DIF Universal Resolver** (résolution DID W3C) |
| GET | \`/v1/dids/stellar/{did}\` | Enregistrement DID brut sur la chaîne |
| POST | \`/v1/dids/stellar\` | Enregistrement (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/update\` | Mise à jour (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/transfer\` | Transfert de contrôleur (prepare/submit) |
| POST | \`/v1/dids/stellar/{did}/deactivate\` | Désactivation, irréversible (prepare/submit) |
| POST | \`/v1/dids/stellar/submit\` | Soumettre n'importe quel XDR signé |

## Endpoint de résolution

### GET /1.0/identifiers/{did}

Retourne le résultat de résolution DID W3C (\`didDocument\` + \`didDocumentMetadata\` + \`didResolutionMetadata\`). Négociation de contenu : \`application/did+ld+json\` (par défaut, avec \`@context\`) ou \`application/did+json\`.

\`\`\`bash
curl https://did.acta.build/1.0/identifiers/did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi
\`\`\`

| Statut | Signification |
|--------|---------|
| 200 | DID actif résolu |
| 400 | DID invalide (\`didResolutionMetadata.error: "invalidDid"\`) |
| 404 | Non enregistré |
| 410 | Désactivé (document pierre tombale) |
| 502 | RPC Stellar injoignable |

### GET /v1/dids/stellar/{did}

Retourne l'enregistrement brut sur la chaîne sans enveloppe W3C : \`{ did, didId, record: { controller, authentication, assertionMethod, keyAgreement, services, version, createdLedger, updatedLedger, deactivated } }\`. Utilisez-le pour lire la \`version\` actuelle avant une mise à jour, ou directement le \`controller\`.

## Endpoints de mutation

Toutes les mutations sont en POST et suivent le même schéma **prepare/submit** utilisé dans tout ACTA.

**Enregistrement (prepare) :**

\`\`\`bash
curl -X POST https://did.acta.build/v1/dids/stellar \\
  -H "Content-Type: application/json" \\
  -d '{
    "did": "did:stellar:testnet:...",
    "sourcePublicKey": "G...",
    "record": {
      "controller": "G...",
      "authentication": [{ "publicKeyMultibase": "z6Mk..." }],
      "assertionMethod": [{ "publicKeyMultibase": "z6Mk..." }],
      "keyAgreement": [],
      "services": []
    }
  }'
\`\`\`

Réponse : \`{ "xdr": "...", "network": "testnet", "networkPassphrase": "..." }\`

**Submit** (après signature avec le wallet du contrôleur) :

\`\`\`bash
curl -X POST https://did.acta.build/v1/dids/stellar/submit \\
  -H "Content-Type: application/json" \\
  -d '{ "signedXdr": "AAAA..." }'
\`\`\`

Réponse : \`{ "txId": "..." }\`

- **Mise à jour** : \`POST /v1/dids/stellar/{did}/update\` avec \`{ expectedVersion, sourcePublicKey, record }\`. Remplacement complet de l'enregistrement ; une version périmée retourne \`409 version_mismatch\`.
- **Transfert** : \`POST /v1/dids/stellar/{did}/transfer\` avec \`{ expectedVersion, newController, sourcePublicKey }\`.
- **Désactivation** : \`POST /v1/dids/stellar/{did}/deactivate\` avec \`{ expectedVersion, sourcePublicKey }\`. Ensuite le DID se résout avec \`410\`.

## Prepare/Submit

Le mode est sélectionné par le corps de la requête : si \`signedXdr\` est présent, la route soumet ; sans lui, la route valide et retourne le \`xdr\` non signé plus la passphrase du réseau. Le wallet Stellar du contrôleur signe l'enveloppe de transaction ; les clés DID à l'intérieur de l'enregistrement sont un matériel distinct (elles signent les credentials et les défis de Proof of Control, jamais la transaction d'enregistrement).

## Limites de débit et erreurs

- Limite de débit par IP : **120 requêtes par 60 secondes** par défaut, avec les en-têtes \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\` et \`Retry-After\` ; \`429\` retourne \`{ "code": "rate_limited" }\`.
- Chaque erreur utilise une enveloppe stable \`{ code, message, details? }\` où \`code\` est une chaîne lisible par machine, partagée avec la bibliothèque TypeScript (par exemple \`did_invalid\`, \`did_already_exists\`, \`version_mismatch\`, \`did_deactivated\`, \`tx_submission_failed\`). Branchez-vous sur \`code\`, jamais sur \`message\`.
- Les requêtes portent un en-tête de corrélation \`X-Request-ID\`, renvoyé en écho dans les réponses.
    `,
};
