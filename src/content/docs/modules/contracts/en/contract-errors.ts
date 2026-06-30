import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Contract errors",
  section: "Contracts",
  tocItems: [
    "In one minute",
    "When you see this",
    "Vault (vc-vault)",
    "API-level errors",
    "Issuer registry",
    "DID registry (did-stellar-registry)",
    "For developers",
  ],
  content: `
# Contract errors

If something goes wrong inside the Soroban contract, Stellar surfaces **\`Error(Contract, #N)\`** — **N** is just a number. **Important:** the same **N** can mean different things on the **vault** contract, the **issuer registry**, or the **DID registry**. Always match the code to the contract you invoked.

> **v0.4.0:** vaults are single-tenant and deployed by the \`vc-vault-factory\`. Issuance is **open by default** — owners **block** issuers (deny-by-exception) rather than authorizing them. The old allow-list and linked-VC error codes no longer apply.

## In one minute

- **Vault** — A single-tenant \`vc-vault\` (one per owner) deployed by the factory: issue, revoke, deny/allow issuer, and related operations.
- **Issuer registry** — A separate contract for issuer metadata; it has its own error codes in the section below.
- **DID registry** — The \`did:stellar\` identity registry contract; manages DID registration, updates, transfers, and deactivation.

## When you see this

- **Usually on submit** — Prepare may still return XDR; the error often appears only after your signed transaction runs on-chain.
- **RPC / Horizon** — Failed simulation or submission responses include the contract error code.

## Vault (vc-vault)

Codes below are **only** for \`vc-vault\`.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · Vault already exists | A vault already exists for this owner at this \`userSalt\` — e.g. deploying twice for the same owner. **Try:** check the vault exists first; do not replay the deploy. |
| **#2** · Issuer denied | This issuer has been **blocked** on the vault (deny-by-exception). **Try:** the owner can \`allow_issuer\` to unblock, or issue from an unblocked account. |
| **#3** · Issuer already in that state | You blocked an issuer already blocked, or unblocked one that wasn't blocked. **Try:** refresh the denied-issuer list before changing it. |
| **#4** · Vault revoked / not active | This owner's vault is revoked or inactive — writes that need an active vault are blocked. **Try:** stop issuing for this vault; handle recovery off-chain if needed. |
| **#6** · VC not found | No credential with that \`vc_id\` for this owner (typo, wrong network, or wrong vault). **Try:** list VC ids, double-check \`owner\` + \`vc_id\` + \`userSalt\`. |
| **#7** · VC already revoked | You acted on a credential that is already revoked (e.g. revoke twice). **Try:** refresh state from chain; treat the VC as invalid. |
| **#8** · Vault not initialized | There is no vault yet for this owner. **Try:** deploy the vault (normal or sponsored flow) before issuing. |
| **#9** · Not initialized | The contract instance was never bootstrapped (no admin). **Try:** run the deploy init flow; confirm the id is the right factory/vault for this network. |
| **#10** · Invalid vault contract | A parameter must point at **this** vault contract but points elsewhere. **Try:** pass the correct \`C...\` vault id for your network, or derive it from \`(factory, owner, userSalt)\`. |
| **#12** · VC already exists | Issue used a \`vc_id\` that already exists for this owner. **Try:** pick a new \`vc_id\` or treat the credential as already issued. |
| **#13** · No pending admin | Accepting admin transfer but no transfer was nominated. **Try:** complete \`set_contract_admin\` (or equivalent) first; don't accept twice. |
| **#15** · Vault full | Vault has reached the maximum number of active VCs. **Try:** revoke unused VCs or use a new vault. |
| **#16** · Limit too large | Pagination \`limit\` exceeds \`MAX_LIST_LIMIT\`. **Try:** use a smaller page size. |
| **#17** · Batch too large | Batch issuance request exceeds \`MAX_BATCH_SIZE\`. **Try:** split into smaller batches. |
| **#18** · Batch empty | Batch issuance called with an empty \`vcs\` list. **Try:** provide at least one VC in the batch. |
| **#19** · Input too long | A string input exceeds its per-field maximum length. **Try:** shorten the field value. |
| **#22** · Invalid fee amount | Fee amount is negative. **Try:** use a non-negative fee value. |
| **#23** · Fee out of bounds | Fee amount exceeds \`MAX_FEE_AMOUNT\`. **Try:** use a smaller fee, or rely on the factory's standard fee. |

## API-level errors

Some errors come from the **ACTA API** before a transaction reaches the contract — they are string codes, not \`Error(Contract, #N)\`:

| Error | What happened & what to try |
|-------|----------------------------|
| **\`issuerDid_controller_mismatch\`** | The on-chain controller of the \`issuerDid\` does not equal the signing issuer. The API enforces this controller↔DID binding at issuance. **Try:** issue with the DID you actually control, or transfer the DID's controller to your issuing account. |

## Issuer registry

Codes **1–5** here belong **only** to \`vc-issuer-registry\` — do not mix them with vault codes.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · Already initialized | \`initialize\` ran after the registry was already set up. **Try:** don't re-initialize; use the live registry. |
| **#2** · Issuer not found | Update/remove referenced an issuer that isn't in the registry. **Try:** verify the address; list issuers from your indexer or tooling. |
| **#3** · Issuer already exists | Register was called for an issuer already stored. **Try:** treat as idempotent success or skip duplicate registration. |
| **#4** · Not initialized | A registry operation ran before \`initialize\`. **Try:** run initialize with the correct admin/config first. |
| **#5** · Invalid metadata | Metadata is larger than the contract allows. **Try:** shorten JSON/URI fields; check size limits in contract source. |

## DID registry (did-stellar-registry)

Codes **1–20** here belong **only** to \`did-stellar-registry\` — the on-chain registry for \`did:stellar\` identifiers.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · DID already exists | \`register\` called with a \`did_id\` that already has a record. **Try:** resolve the DID first; use a different identifier if already taken. |
| **#2** · DID not found | \`update\` / \`transfer_controller\` / \`deactivate\` called for an unknown DID. **Try:** verify the DID string and network. |
| **#3** · Version mismatch | \`expected_version\` does not match the current on-chain version. **Try:** re-read the record, get the latest version, and retry. |
| **#4** · DID deactivated | Mutation attempted on a deactivated (tombstone) DID. **Try:** deactivation is irreversible; create a new DID instead. |
| **#5** · Invalid auth key count | \`authentication\` count is outside the allowed range (1–3). **Try:** provide between 1 and 3 authentication keys. |
| **#6** · Invalid assertion key count | \`assertion_method\` count exceeds the maximum (3). **Try:** reduce the number of assertion method keys. |
| **#7** · Invalid key agreement count | \`key_agreement\` count exceeds the maximum (1). **Try:** provide at most 1 key agreement key. |
| **#8** · Invalid service count | \`services\` count exceeds the maximum (3). **Try:** reduce the number of services. |
| **#9** · Duplicate key | The same \`public_key_multibase\` appears twice in a single relationship. **Try:** remove the duplicate key. |
| **#10** · Key too long | \`public_key_multibase\` exceeds the maximum length (128 chars). **Try:** verify the key encoding. |
| **#11** · Key empty | \`public_key_multibase\` is empty. **Try:** provide a valid multibase-encoded public key. |
| **#12** · Service type too long | \`service.service_type\` exceeds the maximum length (64 chars). **Try:** shorten the service type string. |
| **#13** · Service ID too long | \`service.id_suffix\` exceeds the maximum length (32 chars). **Try:** use a shorter service ID. |
| **#14** · Service ID invalid format | \`service.id_suffix\` does not match the required pattern (\`^[a-z0-9-]+$\`). **Try:** use only lowercase letters, digits, and hyphens. |
| **#15** · Service endpoint invalid | \`service.service_endpoint\` is not a valid \`https://\` URL or exceeds the max length (255 chars). **Try:** provide a valid HTTPS URL. |
| **#16** · Metadata URI invalid | \`metadata_uri\` is not a valid \`https://\` URL or exceeds the max length (255 chars). **Try:** provide a valid HTTPS URL. |
| **#17** · No proposed admin | \`accept_admin\` called when no admin has been proposed. **Try:** call the propose admin function first. |
| **#18** · Service type empty | \`service.service_type\` is empty. **Try:** provide a non-empty service type. |
| **#19** · Version overflow | The record version has reached the maximum (\`u32::MAX\`). **Try:** this is extremely unlikely in practice; contact support. |
| **#20** · Metadata inconsistent | \`metadata_hash\` is provided but \`metadata_uri\` is missing. **Try:** provide both \`metadata_uri\` and \`metadata_hash\`, or omit both. |

## For developers

Authoritative enums live in **contracts-acta**: \`contracts/vc-vault-factory/src/error.rs\`, \`contracts/vc-vault/src/error.rs\`, \`contracts/vc-issuer-registry/src/error.rs\`, and \`contracts/did-stellar-registry/src/errors.rs\`. The \`issuerDid_controller_mismatch\` code is enforced in the ACTA API, not the contract.
    `,
};
