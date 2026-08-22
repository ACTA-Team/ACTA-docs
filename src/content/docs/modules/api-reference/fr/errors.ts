import type { DocPage } from "@/@types/docs";

export const errors: DocPage = {
  slug: "api-errors",
  title: "Erreurs",
  section: "Référence API",
  tocItems: [
    "Enveloppe d'erreur",
    "Codes de statut HTTP",
    "Authentification et autorisation",
    "Erreurs de validation",
    "Erreurs de DID émetteur",
    "Rate limiting",
    "Erreurs Prepare/Submit",
    "Erreurs de contrat via HTTP",
    "Nouvelles tentatives idempotentes",
  ],
  content: `
# Erreurs

Chaque erreur renvoyée par l'API ACTA utilise une enveloppe JSON unique avec un code stable et lisible par machine. Branchez votre logique sur \`error\`, jamais sur \`message\`.

## Enveloppe d'erreur

\`\`\`json
{
  "error": "machine_readable_code",
  "message": "Human readable description",
  "details": { "optional": "context" },
  "request_id": "..."
}
\`\`\`

- \`error\` (toujours) : code stable sur lequel brancher votre logique.
- \`message\` (généralement) : description lisible ; la formulation peut changer entre les versions.
- \`details\` (parfois) : contexte structuré, par exemple \`{ "path", "method" }\` sur \`404 not_found\`.
- \`request_id\` (toujours) : identifiant de corrélation ; incluez-le dans vos demandes de support. Les réponses \`5xx\` portent aussi un \`trace_id\`.
- \`retry_after\` (sur \`429\`) : secondes à attendre, reflétées dans l'en-tête \`Retry-After\`.

Les chemins inconnus renvoient \`404 not_found\` ; les exceptions non gérées renvoient \`500 internal_error\` sans divulguer d'informations internes.

## Codes de statut HTTP

| Statut | Signification |
|--------|---------------|
| 200 / 201 | Succès (201 pour les submits et la création de clés) |
| 400 | Paramètres invalides ou requête malformée |
| 401 | API key manquante, invalide ou expirée |
| 403 | Rôle ou propriété non autorisés, ou origine interdite |
| 404 | Ressource ou route introuvable |
| 409 | Conflit (existe déjà / déjà révoqué / état obsolète) |
| 410 | Disparu (coffre révoqué) |
| 413 | Charge utile ou champ trop volumineux |
| 429 | Rate limit dépassé |
| 500 | Erreur interne (porte un \`trace_id\`) |
| 503 | Dépendance indisponible (par exemple rate limiter, contrat non initialisé) |

## Authentification et autorisation

| Code | Statut | Signification et quoi essayer |
|------|--------|-------------------------------|
| \`401\` (clé manquante/invalide) | 401 | Pas d'en-tête \`X-ACTA-Key\`, clé inconnue ou clé expirée. **Essayez :** créez une clé (voir [API Keys](doc:api-keys)) et envoyez-la sur chaque requête \`/contracts/*\`. |
| \`network_mismatch\` | 400 | \`metadata.network\` ne correspond pas au réseau de l'URL de base. **Essayez :** alignez le corps sur l'hôte que vous appelez. |
| Violation de propriété | 403 | Sur \`issue\`, \`batch-issue\`, \`list-vc-ids\`, \`get-vc\` et \`push\`, l'\`owner\` / le \`fromOwner\` doit être égal au wallet lié à votre API key (clés admin exemptées). **Essayez :** utilisez la clé créée pour ce wallet. |

## Erreurs de validation

Renvoyées en \`400\` avec un code propre au champ :

| Code | Signification |
|------|---------------|
| \`owner_required\` / \`owner_invalid\` | Propriétaire de coffre manquant ou malformé (\`G...\`) |
| \`issuer_required\` / \`issuer_invalid\` | Adresse d'émetteur manquante ou malformée |
| \`vcId_required\` | Identifiant de credential manquant (max 64 caractères) |
| \`vcData_required\` | Charge utile de credential manquante (max 10 000 caractères) |
| \`userSalt_invalid\` | Le sel doit être 32 octets en hexadécimal (64 caractères hex) |
| \`vaultContract_invalid\` | Doit être un identifiant de contrat \`C...\` valide |
| \`limit_too_large\` | \`limit\` de pagination au-dessus de 200 |
| \`batch_empty\` / \`batch_too_large\` | Le lot doit contenir de 1 à 5 credentials |
| \`vcs[i].vcId_too_long\` / \`vcs[i].vcData_too_long\` | Une entrée du lot dépasse les plafonds de champ |
| \`payload_too_large\` | Corps de requête au-dessus de la limite (413) |

## Erreurs de DID émetteur

La famille complète (\`issuerDid_required\`, \`issuerDid_invalid\`, \`issuerDid_unresolvable\`, \`issuerDid_controller_mismatch\`, \`issuerDid_network_mismatch\`, \`issuerDid_deactivated\`, \`issuerDid_registry_unavailable\`) est documentée avec des remèdes dans **[Erreurs de contrat](doc:contract-errors)**, et le contexte did:stellar se trouve dans la **[section DID](doc:did-overview)**.

## Rate limiting

Les requêtes sont limitées par API key sur une fenêtre glissante de 60 secondes, avec des compartiments de lecture et d'écriture séparés selon le rôle (voir l'**[Aperçu de l'API](doc:api-overview)** pour le tableau).

| Code | Statut | Notes |
|------|--------|-------|
| \`rate_limit_exceeded\` | 429 | Compartiment de lecture épuisé ; attendez \`Retry-After\` secondes |
| \`write_rate_limit_exceeded\` | 429 | Compartiment d'écriture épuisé |
| \`rate_limit_unavailable\` | 503 | Le backend du rate limiter est hors service ; réessayez plus tard |

Surveillez les en-têtes \`X-RateLimit-*\` et \`X-WriteRateLimit-*\` pour cadencer vos clients de manière proactive.

## Erreurs Prepare/Submit

| Code | Statut | Signification et quoi essayer |
|------|--------|-------------------------------|
| \`signed_xdr_invalid\` | 400 | Le \`signedXdr\` soumis ne peut pas être analysé. **Essayez :** signez exactement le \`xdr\` renvoyé par prepare, avec la passphrase réseau renvoyée. |
| \`simulation_error\` | 400 | La simulation Soroban a échoué pendant la préparation ; le message inclut la raison on-chain (souvent une erreur de contrat, voir ci-dessous). |
| \`tx_submit_error\` | 500 | La soumission au réseau a échoué. **Essayez :** réessayez avec la même \`Idempotency-Key\`. |

## Erreurs de contrat via HTTP

Lorsqu'un contrat Soroban rejette l'opération, l'API mappe \`Error(Contract, #N)\` vers un code stable et un statut HTTP approprié :

| Code | Statut | Cause on-chain |
|------|--------|----------------|
| \`vault_already_exists\` | 409 | Coffre déjà déployé pour ce propriétaire + sel |
| \`vault_revoked\` | 410 | Le coffre a été révoqué ; écritures bloquées |
| \`vault_not_initialized\` | 404 | Pas encore de coffre pour ce propriétaire |
| \`vc_not_found\` | 404 | Aucun credential avec ce \`vcId\` |
| \`vc_already_exists\` | 409 | \`vcId\` déjà utilisé dans ce coffre |
| \`vc_already_revoked\` | 409 | Le credential est déjà révoqué |
| \`issuer_not_authorized\` | 403 | L'émetteur est bloqué (denied) pour ce coffre |
| \`invalid_vault_contract\` | 400 | \`vaultContract\` ne correspond pas au coffre appelé |
| \`vault_full\` | 409 | Le coffre a atteint son maximum de credentials actifs |
| \`input_too_long\` | 413 | Un champ dépasse son plafond on-chain |
| \`batch_too_large\` / \`batch_empty\` | 400 | Taille de lot hors de la plage 1 à 5 |
| \`issuer_list_too_long\` | 400 | La liste des émetteurs bloqués est pleine (1 000) |
| \`fee_out_of_bounds\` | 400 | Le total des frais du lot a débordé |
| \`contract_not_initialized\` | 503 | État du contrat manquant ; vérifiez le réseau |
| \`no_pending_admin\` | 404 | Acceptation d'admin sans nomination en attente |

Pour la sémantique on-chain sous-jacente (et les échecs de frais USDC/XLM comme les trustlines manquantes), voir **[Erreurs de contrat](doc:contract-errors)**.

## Nouvelles tentatives idempotentes

Les routes d'écriture de contrat acceptent un en-tête \`Idempotency-Key\` (jusqu'à 200 caractères). La première réponse pour une clé est mise en cache pendant 24 heures ; les nouvelles tentatives la rejouent avec l'en-tête \`Idempotency-Replayed: true\`. Utilisez-le pour sécuriser les nouvelles tentatives de submit après des timeouts ou un \`tx_submit_error\`.
    `,
};
