import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Contract errors",
  section: "Contracts",
  tocItems: [
    "How errors appear",
    "vc-vault",
    "vc-vault enum (Rust)",
    "vc-issuer-registry",
    "Source",
  ],
  content: `
# Contract errors

Soroban reports failed invocations as \`Error(Contract, #<code>)\`. The numeric **code** is the \`#[repr(u32)]\` discriminant of the contract’s \`ContractError\` enum (see \`contracts-acta\`).

Codes are **per WASM contract**: the same number can mean a different variant on another binary. Map errors using the **contract id** you invoked (vc-vault vs vc-issuer-registry) and the **\`error.rs\` revision** shipped with that WASM.

## How errors appear

- **Simulation / submission:** Horizon or RPC returns \`tx_failed\` with contract error details including the code.
- **API prepare/submit:** Prepare can return unsigned XDR successfully; the contract error appears after **submit** when the signed transaction executes on-chain.

## vc-vault

Crate: \`contracts-acta/contracts/vc-vault\` — \`src/error.rs\`.

### vc-vault enum (Rust)

The on-chain error set is a single Soroban \`#[contracterror]\` enum. The module documents the Horizon/RPC shape:

\`\`\`rust
//! Contract error codes. Exposed as Error(Contract, #code) by Soroban.

use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum ContractError {
    // variants …
}
\`\`\`

Each variant’s assigned \`u32\` (1, 2, …) is what you see as \`#code\` in \`Error(Contract, #code)\`.

### vc-vault error table

| Code | Variant | Meaning |
|------|---------|---------|
| 1 | \`AlreadyInitialized\` | Resource already initialized (contract or vault). |
| 2 | \`IssuerNotAuthorized\` | Issuer not in the vault’s authorized list. |
| 3 | \`IssuerAlreadyAuthorized\` | Issuer already authorized. |
| 4 | \`VaultRevoked\` | Vault is revoked; writes blocked. |
| 5 | \`VCSAlreadyMigrated\` | Migration already done; nothing to migrate. |
| 6 | \`VCNotFound\` | VC not found in vault or status registry. |
| 7 | \`VCAlreadyRevoked\` | VC already revoked. |
| 8 | \`VaultNotInitialized\` | Vault not initialized for this owner. |
| 9 | \`NotInitialized\` | Contract not initialized (no admin). |
| 10 | \`InvalidVaultContract\` | \`vault_contract\` parameter is not this contract. |
| 11 | \`NotAuthorizedSponsor\` | Signer is not the contract admin nor an authorized sponsor (sponsored vault). |
| 12 | \`VCAlreadyExists\` | \`vc_id\` already exists in this vault; re-issuance not allowed. |
| 13 | \`NoPendingAdmin\` | \`accept_contract_admin\` called but no admin nomination is pending. |
| 14 | \`ParentVCInvalid\` | Parent VC does not exist or has been revoked (linked issuance). |

If your checkout or deployment only defines variants through \`InvalidVaultContract\` (code **10**), your binary does not yet include sponsored-vault / linked-issuance / admin-handoff variants (**11–14**). Compare with the \`error.rs\` in your tree before mapping codes in support tooling.

## vc-issuer-registry

Crate: \`contracts-acta/contracts/vc-issuer-registry\` — \`src/error.rs\`.

Uses the same \`#[contracterror]\` / \`#[repr(u32)]\` pattern; codes below are **issuer-registry only** (not interchangeable with vc-vault).

| Code | Variant | Meaning |
|------|---------|---------|
| 1 | \`AlreadyInitialized\` | \`initialize()\` has already been called. |
| 2 | \`IssuerNotFound\` | Issuer address not found in the registry. |
| 3 | \`IssuerAlreadyExists\` | Issuer address already registered. |
| 4 | \`NotInitialized\` | Contract has not been initialized yet. |
| 5 | \`InvalidMetadata\` | Metadata field exceeds maximum allowed size. |

## Source

Authoritative definitions and doc comments live in the repository:

- \`contracts-acta/contracts/vc-vault/src/error.rs\`
- \`contracts-acta/contracts/vc-issuer-registry/src/error.rs\`
    `,
};
