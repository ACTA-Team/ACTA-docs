import type { DocPage } from "@/@types/docs";

const tocItems = [
  "How errors appear",
  "vc-vault",
  "Reference table",
  ...Array.from({ length: 14 }, (_, i) => `Vault error ${i + 1}`),
  "vc-issuer-registry",
  "Reference table (issuer registry)",
  ...Array.from({ length: 5 }, (_, i) => `Registry error ${i + 1}`),
  "Source",
];

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Contract errors",
  section: "Contracts",
  tocItems,
  content: `
# Contract errors

When a Soroban contract \`panic\`s with a \`ContractError\`, the network reports **\`Error(Contract, #N)\`** where **N** is the numeric code below. Each subsection **Vault error N** / **Registry error N** explains that code in plain language.

Codes belong to **one WASM**: vc-vault and vc-issuer-registry each have their own \`error.rs\`. The same number **N** can mean different things on different contracts.

## How errors appear

- **RPC / Horizon:** failed simulation or submission includes the contract error code.
- **ACTA API:** \`prepare\` may still return XDR; the code usually shows up after **\`submit\`** when the transaction runs on-chain.

## vc-vault

Crate \`contracts-acta/contracts/vc-vault\`, file \`src/error.rs\`. Subsections **Vault error 1** … **Vault error 14** match the enum in this repository. If your deployed WASM only goes up to code **10**, your tree does not yet include errors **11–14** (sponsored vault, duplicate VC id, admin handoff, linked parent VC).

### Reference table

| N | Variant |
|---|---------|
| 1 | \`AlreadyInitialized\` |
| 2 | \`IssuerNotAuthorized\` |
| 3 | \`IssuerAlreadyAuthorized\` |
| 4 | \`VaultRevoked\` |
| 5 | \`VCSAlreadyMigrated\` |
| 6 | \`VCNotFound\` |
| 7 | \`VCAlreadyRevoked\` |
| 8 | \`VaultNotInitialized\` |
| 9 | \`NotInitialized\` |
| 10 | \`InvalidVaultContract\` |
| 11 | \`NotAuthorizedSponsor\` |
| 12 | \`VCAlreadyExists\` |
| 13 | \`NoPendingAdmin\` |
| 14 | \`ParentVCInvalid\` |

### Vault error 1

**Variant:** \`AlreadyInitialized\` (code **1**). Something was initialized twice: the **contract** already has an admin, or this **owner** already has a vault. Typical cases: calling \`create_vault\` or \`create_sponsored_vault\` again for the same owner, or running init when the instance is already set up. **What to do:** treat the vault as existing; use read APIs or \`has_vault\`-style checks before create; never replay the same initialization flow.

### Vault error 2

**Variant:** \`IssuerNotAuthorized\` (code **2**). An operation required the issuer to be on the vault’s **authorized issuer list**, and they are not (for example issue or revoke paths that validate issuer). **What to do:** call authorize flows first, or use the correct issuer address.

### Vault error 3

**Variant:** \`IssuerAlreadyAuthorized\` (code **3**). You tried to add an issuer that is **already** in the authorized set. **What to do:** skip duplicate authorize, or fetch the current issuer list and diff.

### Vault error 4

**Variant:** \`VaultRevoked\` (code **4**). The vault for this owner was **revoked**; further writes that require an active vault are blocked. **What to do:** do not issue or mutate VCs for that owner on this vault; recover policy off-chain or use a new owner flow if your product supports it.

### Vault error 5

**Variant:** \`VCSAlreadyMigrated\` (code **5**). The **migrate** path was executed when there is nothing left to migrate (already migrated). **What to do:** treat migration as complete; avoid calling migrate repeatedly.

### Vault error 6

**Variant:** \`VCNotFound\` (code **6**). The given \`vc_id\` (and owner) does not exist in vault storage or the status path you hit does not have that VC. **What to do:** verify \`owner\` + \`vc_id\`, list VC ids first, check for typos or wrong network/contract id.

### Vault error 7

**Variant:** \`VCAlreadyRevoked\` (code **7**). You attempted an operation on a VC that is **already revoked** (for example revoke twice). **What to do:** treat the VC as invalid; refresh client state from chain.

### Vault error 8

**Variant:** \`VaultNotInitialized\` (code **8**). Logic expected a **per-owner vault** that does not exist yet for this owner. **What to do:** run vault creation (\`create_vault\` / sponsored create) before issuing or other vault operations.

### Vault error 9

**Variant:** \`NotInitialized\` (code **9**). The **contract instance** was never initialized (no contract admin / bootstrap). **What to do:** run the contract’s initialization path with the deployer; verify you are invoking the correct contract id.

### Vault error 10

**Variant:** \`InvalidVaultContract\` (code **10**). A parameter that must reference **this** vc-vault contract id points to a **different** contract. **What to do:** pass the correct vault contract address for the network you are on.

### Vault error 11

**Variant:** \`NotAuthorizedSponsor\` (code **11**). **Sponsored vault** creation: the sponsor is not the contract admin and not on the **authorized sponsor list**, while **open-to-all** mode is off. **What to do:** have an admin add the sponsor, enable open mode, or sign with an allowed sponsor.

### Vault error 12

**Variant:** \`VCAlreadyExists\` (code **12**). Issue tried to store a \`vc_id\` that **already exists** for that owner; re-issue with the same id is not allowed. **What to do:** use a new \`vc_id\` or treat the credential as already issued.

### Vault error 13

**Variant:** \`NoPendingAdmin\` (code **13**). \`accept_contract_admin\` (or equivalent handoff) ran when **no admin transfer** was pending. **What to do:** ensure \`set_contract_admin\` / nomination happened first; do not accept twice.

### Vault error 14

**Variant:** \`ParentVCInvalid\` (code **14**). **Linked issuance:** the parent VC is missing, wrong, or **revoked**, so the child cannot be anchored. **What to do:** verify parent \`owner\` + \`vc_id\` and that the parent VC is active.

## vc-issuer-registry

Crate \`contracts-acta/contracts/vc-issuer-registry\`, file \`src/error.rs\`. Codes **1–5** below are **only** for this contract.

### Reference table (issuer registry)

| N | Variant |
|---|---------|
| 1 | \`AlreadyInitialized\` |
| 2 | \`IssuerNotFound\` |
| 3 | \`IssuerAlreadyExists\` |
| 4 | \`NotInitialized\` |
| 5 | \`InvalidMetadata\` |

### Registry error 1

**Variant:** \`AlreadyInitialized\` (code **1**). \`initialize\` was called **after** the registry was already set up. **What to do:** do not re-initialize; treat the registry as live.

### Registry error 2

**Variant:** \`IssuerNotFound\` (code **2**). Update/remove referenced an issuer address that is **not** in the registry. **What to do:** check the address and list issuers off-chain or via your indexer.

### Registry error 3

**Variant:** \`IssuerAlreadyExists\` (code **3**). Register attempted for an issuer that is **already** stored. **What to do:** use idempotent registration logic or return success on duplicate depending on product rules.

### Registry error 4

**Variant:** \`NotInitialized\` (code **4**). Registry operations ran before **initialize**. **What to do:** call initialize with the correct admin/config first.

### Registry error 5

**Variant:** \`InvalidMetadata\` (code **5**). Metadata payload **exceeds** the maximum size allowed by the contract. **What to do:** shorten JSON/URI fields or split data; consult the contract’s size limits in source.

## Source

Authoritative enum and comments:

- \`contracts-acta/contracts/vc-vault/src/error.rs\`
- \`contracts-acta/contracts/vc-issuer-registry/src/error.rs\`
    `,
};
