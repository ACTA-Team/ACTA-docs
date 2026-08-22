import type { DocPage } from "@/@types/docs";

export const errors: DocPage = {
  slug: "api-errors",
  title: "Errors",
  section: "API Reference",
  tocItems: [
    "Error envelope",
    "HTTP status codes",
    "Authentication & authorization",
    "Validation errors",
    "Issuer DID errors",
    "Rate limiting",
    "Prepare/Submit errors",
    "Contract errors over HTTP",
    "Idempotent retries",
  ],
  content: `
# Errors

Every error the ACTA API returns uses one JSON envelope with a stable, machine-readable code. Branch on \`error\`, never on \`message\`.

## Error envelope

\`\`\`json
{
  "error": "machine_readable_code",
  "message": "Human readable description",
  "details": { "optional": "context" },
  "request_id": "..."
}
\`\`\`

- \`error\` (always): stable code to branch on.
- \`message\` (usually): human-readable description; wording may change between releases.
- \`details\` (sometimes): structured context, e.g. \`{ "path", "method" }\` on \`404 not_found\`.
- \`request_id\` (always): correlation id; include it in support requests. \`5xx\` responses also carry \`trace_id\`.
- \`retry_after\` (on \`429\`): seconds to wait, mirrored in the \`Retry-After\` header.

Unknown paths return \`404 not_found\`; unhandled exceptions return \`500 internal_error\` without leaking internals.

## HTTP status codes

| Status | Meaning |
|--------|---------|
| 200 / 201 | Success (201 for submits and key creation) |
| 400 | Invalid parameters or malformed request |
| 401 | Missing, invalid, or expired API key |
| 403 | Role or ownership not allowed, or forbidden origin |
| 404 | Resource or route not found |
| 409 | Conflict (already exists / already revoked / stale state) |
| 410 | Gone (revoked vault) |
| 413 | Payload or field too large |
| 429 | Rate limit exceeded |
| 500 | Internal error (carries \`trace_id\`) |
| 503 | Dependency unavailable (e.g. rate limiter, contract not initialized) |

## Authentication & authorization

| Code | Status | Meaning & what to try |
|------|--------|-----------------------|
| \`401\` (missing/invalid key) | 401 | No \`X-ACTA-Key\` header, unknown key, or expired key. **Try:** create a key (see [API Keys](doc:api-keys)) and send it on every \`/contracts/*\` request. |
| \`network_mismatch\` | 400 | \`metadata.network\` does not match the base URL's network. **Try:** align the body with the host you call. |
| Ownership violation | 403 | On \`issue\`, \`batch-issue\`, \`list-vc-ids\`, \`get-vc\`, and \`push\`, the \`owner\` / \`fromOwner\` must equal the wallet bound to your API key (admin keys exempt). **Try:** use the key created for that wallet. |

## Validation errors

Returned as \`400\` with a field-specific code:

| Code | Meaning |
|------|---------|
| \`owner_required\` / \`owner_invalid\` | Missing or malformed vault owner (\`G...\`) |
| \`issuer_required\` / \`issuer_invalid\` | Missing or malformed issuer address |
| \`vcId_required\` | Missing credential id (max 64 chars) |
| \`vcData_required\` | Missing credential payload (max 10,000 chars) |
| \`userSalt_invalid\` | Salt must be 32 bytes hex (64 hex chars) |
| \`vaultContract_invalid\` | Must be a valid \`C...\` contract id |
| \`limit_too_large\` | Pagination \`limit\` above 200 |
| \`batch_empty\` / \`batch_too_large\` | Batch must contain 1 to 5 credentials |
| \`vcs[i].vcId_too_long\` / \`vcs[i].vcData_too_long\` | A batch entry exceeds the field caps |
| \`payload_too_large\` | Request body over the limit (413) |

## Issuer DID errors

The full family (\`issuerDid_required\`, \`issuerDid_invalid\`, \`issuerDid_unresolvable\`, \`issuerDid_controller_mismatch\`, \`issuerDid_network_mismatch\`, \`issuerDid_deactivated\`, \`issuerDid_registry_unavailable\`) is documented with remedies in **[Contract errors](doc:contract-errors)**, and the did:stellar background lives in the **[DID section](doc:did-overview)**.

## Rate limiting

Requests are limited per API key over a sliding 60-second window, with separate read and write buckets by role (see **[API Overview](doc:api-overview)** for the table).

| Code | Status | Notes |
|------|--------|-------|
| \`rate_limit_exceeded\` | 429 | Read bucket exhausted; wait \`Retry-After\` seconds |
| \`write_rate_limit_exceeded\` | 429 | Write bucket exhausted |
| \`rate_limit_unavailable\` | 503 | The rate limiter backend is down; retry later |

Watch the \`X-RateLimit-*\` and \`X-WriteRateLimit-*\` headers to pace clients proactively.

## Prepare/Submit errors

| Code | Status | Meaning & what to try |
|------|--------|-----------------------|
| \`signed_xdr_invalid\` | 400 | The submitted \`signedXdr\` cannot be parsed. **Try:** sign the exact \`xdr\` returned by prepare, with the returned network passphrase. |
| \`simulation_error\` | 400 | Soroban simulation failed while preparing; the message includes the on-chain reason (often a contract error, see below). |
| \`tx_submit_error\` | 500 | Submission to the network failed. **Try:** retry with the same \`Idempotency-Key\`. |

## Contract errors over HTTP

When a Soroban contract rejects the operation, the API maps \`Error(Contract, #N)\` to a stable code and a fitting HTTP status:

| Code | Status | On-chain cause |
|------|--------|----------------|
| \`vault_already_exists\` | 409 | Vault already deployed at that owner + salt |
| \`vault_revoked\` | 410 | Vault was revoked; writes blocked |
| \`vault_not_initialized\` | 404 | No vault for this owner yet |
| \`vc_not_found\` | 404 | No credential with that \`vcId\` |
| \`vc_already_exists\` | 409 | \`vcId\` already used in this vault |
| \`vc_already_revoked\` | 409 | Credential is already revoked |
| \`issuer_not_authorized\` | 403 | Issuer is blocked (denied) for this vault |
| \`invalid_vault_contract\` | 400 | \`vaultContract\` does not match the called vault |
| \`vault_full\` | 409 | Vault reached its max active credentials |
| \`input_too_long\` | 413 | A field exceeds its on-chain cap |
| \`batch_too_large\` / \`batch_empty\` | 400 | Batch size outside 1 to 5 |
| \`issuer_list_too_long\` | 400 | Denied-issuer list is full (1,000) |
| \`fee_out_of_bounds\` | 400 | Batch fee total overflowed |
| \`contract_not_initialized\` | 503 | Contract state missing; check the network |
| \`no_pending_admin\` | 404 | Admin accept without a pending nomination |

For the underlying on-chain semantics (and USDC/XLM fee failures like missing trustlines), see **[Contract errors](doc:contract-errors)**.

## Idempotent retries

Contract write routes accept an \`Idempotency-Key\` header (up to 200 chars). The first response for a key is cached for 24 hours; retries replay it with the \`Idempotency-Replayed: true\` header. Use it to make submit retries safe after timeouts or \`tx_submit_error\`.
    `,
};
