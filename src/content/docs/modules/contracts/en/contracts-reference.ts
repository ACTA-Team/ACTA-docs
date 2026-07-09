import type { DocPage } from "@/@types/docs";

export const contractsReference: DocPage = {
  slug: "contracts-reference",
  title: "Contracts Reference",
  section: "Contracts",
  tocItems: [
    "Overview",
    "vc-vault",
    "Vault roles",
    "Vault functions",
    "Vault limits",
    "Vault events",
    "vc-vault-factory",
    "Factory functions",
    "Deterministic addresses",
    "Deployed contracts",
    "Immutability & storage",
  ],
  content: `
# Contracts Reference

The public interface of ACTA's Soroban contracts, for teams integrating at the contract level (Rust, CLI, or custom tooling) without going through the ACTA API. Source lives in the **contracts-acta** repository; error codes are on **[Contract errors](doc:contract-errors)** and the did:stellar registry interface is documented in the **[DID section](doc:did-registry)**.

## Overview

| Contract | Version | Role |
|----------|---------|------|
| \`vc-vault\` | 0.4.0 | Single-tenant credential vault, one per owner, instantiated by the factory from a template WASM |
| \`vc-vault-factory\` | 0.1.0 | One per network; deploys vaults deterministically and quotes the issuance fee |
| \`did-stellar-registry\` | 0.2.0 | Issuer DID records (see [DID section](doc:did-registry)) |

## vc-vault

Each vault is constructed by the factory with \`(vault_owner, contract_admin, did_uri, factory_address)\`. The vault admin starts as the owner.

## Vault roles

| Role | Can call |
|------|----------|
| \`contract_admin\` | \`nominate_admin\`; a nominee calls \`accept_contract_admin\` (no upgrade or fee powers) |
| Vault admin (owner by default) | \`set_vault_admin\`, \`deny_issuer\`, \`allow_issuer\`, \`revoke_vault\`, \`push\` |
| \`vault_owner\` | \`set_vault_did\`, \`revoke\` |
| Any non-denied issuer | \`issue\`, \`batch_issue\` |

## Vault functions

| Function | Auth | Notes |
|----------|------|-------|
| \`version() -> String\` | None | Returns the crate version, e.g. \`"0.4.0"\` |
| \`vault_owner() -> Address\` | None | |
| \`vault_did() -> Option<String>\` | None | |
| \`set_vault_did(did_uri)\` | Vault owner | \`did_uri\` up to 256 bytes |
| \`set_vault_admin(new_admin)\` | Vault admin | |
| \`deny_issuer(issuer_addr)\` | Vault admin | No-op if already denied; list capped at 1,000 |
| \`allow_issuer(issuer_addr)\` | Vault admin | No-op if absent |
| \`revoke_vault()\` | Vault admin | **Irreversible**; blocks all writes |
| \`issue(vc_id, vc_data, vault_contract, issuer_addr, issuer_did) -> String\` | Issuer | Charges the factory-quoted fee from the issuer; duplicate \`vc_id\` fails |
| \`batch_issue(issuer_addr, vault_contract, issuer_did, vcs) -> Vec<String>\` | Issuer | \`vcs\` = list of \`(vc_id, vc_data)\`, 1 to 5 entries; single fee transfer of unit x n |
| \`revoke(vc_id, date)\` | Vault owner | Credential must be valid; status becomes \`Revoked(date)\` |
| \`push(vc_id, dest_vault)\` | Vault admin | Moves a valid credential to another factory-deployed vault with the **same owner**, then deletes it locally |
| \`receive_push(source_vault, source_owner, vc_id, vc_data, issuer_did)\` | Source vault | Validates the source via factory \`is_vault\` and the same-owner rule |
| \`list_vc_ids(offset, limit) -> Vec<String>\` | None | \`limit\` up to 200 |
| \`vc_count() -> u32\` | None | |
| \`get_vc(vc_id) -> Option<VerifiableCredential>\` | None | Returns \`{ id, data, issuance_contract, issuer_did }\`; \`data\` is the encrypted payload |
| \`verify_vc(vc_id) -> VCStatus\` | None | \`Valid\`, \`Invalid\`, or \`Revoked(date)\`. **Status only**: it does not prove who issued; check \`issuer_did\` for that |
| \`list_denied_issuers(offset, limit) -> Vec<Address>\` | None | \`limit\` up to 200 |
| \`denied_issuer_count() -> u32\` | None | |
| \`nominate_admin(new_admin)\` / \`accept_contract_admin()\` | Admin / nominee | Two-step contract-admin handover |

## Vault limits

| Limit | Value |
|-------|-------|
| \`vc_id\` | max 64 bytes |
| \`vc_data\` | max 10,000 bytes |
| \`did_uri\` / \`issuer_did\` | max 256 bytes |
| \`date\` | max 64 bytes |
| Batch size | max 5 credentials |
| List page size | max 200 |
| Denied issuers | max 1,000 |

## Vault events

\`ContractInitialized\`, \`VaultCreated\`, \`AdminNominated\`, \`AdminTransferred\`, \`VaultAdminChanged\`, \`VaultDidChanged\`, \`IssuerDenied\`, \`IssuerAllowed\`, \`VaultRevoked\`, \`VCIssued\` (per credential, also emitted on batch and on \`receive_push\`), \`VCRevoked\`, \`VCPushed\`.

## vc-vault-factory

Constructed once per network with \`VaultInitMeta { vault_hash, contract_admin }\`. The template hash has **no setter**: shipping new vault code means deploying a new factory.

## Factory functions

| Function | Auth | Notes |
|----------|------|-------|
| \`deploy(owner, did_uri, user_salt) -> Address\` | Owner | Deploys the owner's vault; emits \`VaultDeployed\` |
| \`deploy_sponsored(deployer, owner, did_uri, user_salt) -> Address\` | Deployer | Sponsor pays and signs; vault belongs to \`owner\`; emits \`SponsoredVaultDeployed\` |
| \`is_vault(vault_address) -> bool\` | None | True iff deployed by this factory |
| \`quote_fee(issuer) -> FeeQuote\` | None | \`{ enabled, amount, token, dest }\`; per-issuer custom fee (with optional expiry) wins over the standard fee |
| \`set_fee_config(token, dest, standard)\` | Admin | |
| \`set_fee_enabled(enabled)\` | Admin | Enabling requires token + dest + standard configured |
| \`set_fee_standard(amount)\` / \`set_min_fee(amount)\` | Admin | Amounts validated non-negative, above the min fee, and at most 10^18 |
| \`set_fee_custom(issuer, amount, expires_at?)\` / \`remove_fee_custom(issuer)\` | Admin | Expiry must be in the future |
| \`nominate_admin\` / \`accept_admin\` / \`get_admin\` | Admin / nominee / none | Two-step handover |

## Deterministic addresses

The vault address is derived before deployment, with no lookup table:

\`\`\`
deploy_salt = keccak256(user_salt (32 bytes) || XDR(ScAddress(owner)))
\`\`\`

The owner is encoded as canonical ScAddress **XDR** (not the \`G...\` text form). The same \`(owner, user_salt)\` always yields the same address; the default salt is 32 zero bytes (one canonical vault per owner). Mixing the owner into the salt prevents cross-owner collisions and front-running.

## Deployed contracts

**Mainnet** (passphrase \`Public Global Stellar Network ; September 2015\`)

| Contract | ID / hash |
|----------|-----------|
| vc-vault-factory | \`CCWNZ6UMUXCDOVP2TWOPVLI4KP4VY4YF7VKPN6XLYVHNFAT24NDB33CX\` |
| vc-vault template WASM | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| Fee config | Enabled; 1 USDC per credential (USDC SAC \`CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75\`) |

**Testnet** (passphrase \`Test SDF Network ; September 2015\`)

| Contract | ID / hash |
|----------|-----------|
| vc-vault-factory | \`CDRFQRIP4FA3WMPWCSAM3XEY6EM6EGKRYZRSCSVZ5NHCF6AGEVR2XEPQ\` |
| vc-vault template WASM | \`2bd0323a98acb8469606808368da6c79824f2dd8391494b94ddbeb3d22c1a957\` |
| Fee config | Enabled; 5 XLM per credential (native XLM SAC) |

The \`vc-vault\` contract has no standalone contract ID on either network: it exists only as per-owner instances deployed by the factory.

## Immutability & storage

- **No upgrade entrypoints**: neither the vault (since 0.4.0) nor the factory can swap their code.
- Vault credential data and indexes live in **persistent** Soroban storage; instance storage holds admin state. TTLs are extended on both reads and writes (threshold ~30 days, bump ~180 days at 5-second ledgers).
- Contracts are built for the \`wasm32v1-none\` target and optimized with the Stellar CLI.
    `,
};
