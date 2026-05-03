import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Contract errors",
  section: "Contracts",
  tocItems: [
    "How errors appear",
    "vc-vault",
    "vc-issuer-registry",
    "Source",
  ],
  content: `
# Contract errors

Soroban reports failed invocations as \`Error(Contract, #<code>)\`. The numeric **code** matches the \`#[repr(u32)]\` discriminant of each contract’s \`ContractError\` enum in **contracts-acta**.

Codes are **per contract**: the same number can mean different variants on different WASM binaries. Always map codes using the contract ID (vc-vault vs vc-issuer-registry) you invoked.

## How errors appear

- **Simulation / submission:** Horizon or RPC returns a result with \`tx_failed\` and contract error details including the code.
- **API prepare/submit:** A rejected Soroban invoke surfaces the same underlying contract error after submission; prepare may succeed and only fail once the signed transaction hits the network.

## vc-vault

Crate: \`contracts-acta/contracts/vc-vault\` — \`src/error.rs\`.

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

## vc-issuer-registry

Crate: \`contracts-acta/contracts/vc-issuer-registry\` — \`src/error.rs\`.

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
