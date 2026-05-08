import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Contract errors",
  section: "Contracts",
  tocItems: [
    "In one minute",
    "When you see this",
    "Vault (vc-vault)",
    "Issuer registry",
    "For developers",
  ],
  content: `
# Contract errors

If something goes wrong inside the Soroban contract, Stellar surfaces **\`Error(Contract, #N)\`** — **N** is just a number. **Important:** the same **N** can mean different things on the **vault** contract than on the **issuer registry**. Always match the code to the contract you invoked.

## In one minute

- **Vault** — Holds credentials per owner: create vault, issue, revoke, sponsored flows, and related operations.
- **Issuer registry** — A separate contract for issuer metadata; it has its own error codes in the section below.

## When you see this

- **Usually on submit** — Prepare may still return XDR; the error often appears only after your signed transaction runs on-chain.
- **RPC / Horizon** — Failed simulation or submission responses include the contract error code.

## Vault (vc-vault)

Codes **1–14** below are **only** for \`vc-vault\`. If your deployed WASM is older, you may not see codes above **10** yet.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · Already initialized | Vault or contract was set up already — e.g. \`create_vault\` / \`create_sponsored_vault\` twice for the same owner. **Try:** check the vault exists first; do not replay init. |
| **#2** · Issuer not authorized | This issuer is not on the vault’s allow list for the operation. **Try:** authorize the issuer first, or use the correct issuer address. |
| **#3** · Issuer already authorized | You added an issuer who is already allowed. **Try:** skip the duplicate or refresh the list before changing. |
| **#4** · Vault revoked | This owner’s vault is revoked — writes that need an active vault are blocked. **Try:** stop issuing for this vault; handle recovery off-chain if needed. |
| **#5** · Already migrated | Migrate was called when there is nothing left to migrate. **Try:** treat migration as done; don’t call migrate again. |
| **#6** · VC not found | No credential with that \`vc_id\` for this owner (typo, wrong network, or wrong contract id). **Try:** list VC ids, double-check \`owner\` + \`vc_id\`. |
| **#7** · VC already revoked | You acted on a credential that is already revoked (e.g. revoke twice). **Try:** refresh state from chain; treat the VC as invalid. |
| **#8** · Vault not initialized | There is no vault yet for this owner. **Try:** create the vault (normal or sponsored flow) before issuing. |
| **#9** · Not initialized | The contract instance was never bootstrapped (no admin). **Try:** run the deploy init flow; confirm the contract id is the right vault for this network. |
| **#10** · Invalid vault contract | A parameter must point at **this** vault contract but points elsewhere. **Try:** pass the correct \`C...\` vault id for your network. |
| **#11** · Sponsor not allowed | Sponsored vault: sponsor isn’t admin and isn’t on the sponsor list while “open to all” is off. **Try:** admin adds sponsor, enables open mode, or you use an allowed sponsor. |
| **#12** · VC already exists | Issue used a \`vc_id\` that already exists for this owner. **Try:** pick a new \`vc_id\` or treat the credential as already issued. |
| **#13** · No pending admin | Accepting admin transfer but no transfer was nominated. **Try:** complete \`set_contract_admin\` (or equivalent) first; don’t accept twice. |
| **#14** · Parent VC invalid | Linked issue: parent VC missing, wrong, or revoked. **Try:** verify parent \`owner\` + \`vc_id\` and that the parent is still active. |

## Issuer registry

Codes **1–5** here belong **only** to \`vc-issuer-registry\` — do not mix them with vault codes.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · Already initialized | \`initialize\` ran after the registry was already set up. **Try:** don’t re-initialize; use the live registry. |
| **#2** · Issuer not found | Update/remove referenced an issuer that isn’t in the registry. **Try:** verify the address; list issuers from your indexer or tooling. |
| **#3** · Issuer already exists | Register was called for an issuer already stored. **Try:** treat as idempotent success or skip duplicate registration. |
| **#4** · Not initialized | A registry operation ran before \`initialize\`. **Try:** run initialize with the correct admin/config first. |
| **#5** · Invalid metadata | Metadata is larger than the contract allows. **Try:** shorten JSON/URI fields; check size limits in contract source. |

## For developers

Authoritative enums live in **contracts-acta**: \`contracts/vc-vault/src/error.rs\` and \`contracts/vc-issuer-registry/src/error.rs\`.
    `,
};
