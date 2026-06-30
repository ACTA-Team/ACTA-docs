import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Contract errors",
  section: "Contracts",
  tocItems: [
    "In one minute",
    "When you see this",
    "Vault (vc-vault)",
    "Factory (vc-vault-factory)",
    "did:stellar registry",
    "API-level errors",
    "For developers",
  ],
  content: `
# Contract errors

If something goes wrong inside the Soroban contract, Stellar surfaces **\`Error(Contract, #N)\`** - **N** is just a number. **Important:** the same **N** can mean different things on the **vault** contract than on the **factory** or the **did:stellar registry**. Always match the code to the contract you invoked. The **N** values shown below are **indicative**, not authoritative: enums can be renumbered between releases, so identify errors by their **name/meaning** and confirm against the source (see *For developers*).

## In one minute

- **Factory (vc-vault-factory)** - One per network. Deploys single-tenant \`vc-vault\` contracts deterministically from a vault template WASM, and provides the on-chain fee quote (\`quote_fee\`).
- **Vault (vc-vault)** - One per owner, deployed by the factory. Holds that owner's credentials. Issuance is **open by default** (deny-by-exception): owners block/unblock issuers. Fees are charged on-chain (paid by the issuer). Vaults are **immutable** (the template is fixed at deploy).
- **did:stellar registry** - A separate contract for issuer DID metadata; it has its own error codes in the section below.
- **API-level errors** - Some failures (like a DID controller mismatch) are returned by the ACTA API, not by a Soroban contract.

## When you see this

- **Usually on submit** - Prepare may still return XDR; the error often appears only after your signed transaction runs on-chain.
- **RPC / Horizon** - Failed simulation or submission responses include the contract error code.
- **API responses** - API-level errors arrive as a structured error in the HTTP response, before or instead of a Soroban code.

## Vault (vc-vault)

The codes below are **only** for \`vc-vault\`, and follow the **deny-by-exception** model: every issuer is allowed until the owner blocks it. Numbers are indicative - match by name.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · Already initialized | The vault or contract was set up already - e.g. an init/create call ran twice for the same owner. **Try:** check the vault exists first; do not replay init. |
| **#2** · Vault not initialized | There is no vault yet for this owner. **Try:** create the owner's vault (via the factory) before issuing. |
| **#3** · Contract not initialized | The contract instance was never bootstrapped (no admin/config). **Try:** run the deploy init flow; confirm the contract id is the right vault for this network. |
| **#4** · Issuer denied | This issuer is **blocked** for this vault, so the operation is rejected. **Try:** the owner can unblock it with \`allow_issuer\`, or use a different (allowed) issuer. |
| **#5** · Issuer already denied | \`deny_issuer\` was called for an issuer that is already blocked. **Try:** treat as idempotent; refresh the block list before changing it. |
| **#6** · Issuer not denied | \`allow_issuer\` was called for an issuer that is not currently blocked. **Try:** nothing to undo; the issuer is already allowed. |
| **#7** · Vault not active / revoked | This owner's vault is not active (e.g. revoked) - writes that need an active vault are blocked. **Try:** stop issuing for this vault; handle recovery off-chain if needed. |
| **#8** · VC not found | No credential with that \`vc_id\` for this owner (typo, wrong network, or wrong contract id). **Try:** list VC ids, double-check \`owner\` + \`vc_id\`. |
| **#9** · VC already exists | Issue used a \`vc_id\` that already exists for this owner. **Try:** pick a new \`vc_id\` or treat the credential as already issued. |
| **#10** · VC already revoked | You acted on a credential that is already revoked (e.g. revoke twice). **Try:** refresh state from chain; treat the VC as invalid. |
| **#11** · Invalid vault contract | A parameter must point at **this** vault contract but points elsewhere. **Try:** pass the correct \`C...\` vault id for your network. |
| **#12** · Fee out of bounds | The fee passed/observed is outside the bounds the vault accepts (vs. the factory's \`quote_fee\`). **Try:** re-quote the fee and submit a value within the allowed range. |

## Factory (vc-vault-factory)

One factory per network deploys and tracks every \`vc-vault\`. These codes are **only** for \`vc-vault-factory\`. Numbers are indicative - match by name.

| Error | What happened & what to try |
|-------|----------------------------|
| **Already initialized** | The factory was already bootstrapped. **Try:** do not re-initialize; use the live factory for this network. |
| **Not initialized** | A factory operation ran before the factory was set up. **Try:** run the factory init flow with the correct admin/config first. |
| **Vault already deployed** | A deterministic deploy was requested for a \`(owner, userSalt)\` whose vault already exists. **Try:** treat as done; read the existing vault address derived from \`(factory, owner, userSalt)\`. |
| **Deploy failed / invalid template** | Deploying from the vault template WASM failed (e.g. wrong/unknown wasm hash). **Try:** confirm the configured vault template wasm hash for this network. |
| **Fee out of bounds** | A fee passed to \`quote_fee\` / set as a custom per-issuer fee is outside the allowed range. **Try:** use a value within the standard/custom fee bounds. |
| **Unauthorized** | The caller is not allowed to perform this admin/config action (e.g. changing fees, deploying). **Try:** call with the correct admin, or have the admin perform it. |

## did:stellar registry

Codes here belong **only** to the **did:stellar registry** - do not mix them with vault or factory codes. Numbers are indicative - match by name.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · Already initialized | \`initialize\` ran after the registry was already set up. **Try:** don't re-initialize; use the live registry. |
| **#2** · Issuer not found | Update/remove referenced an issuer that isn't in the registry. **Try:** verify the address; list issuers from your indexer or tooling. |
| **#3** · Issuer already exists | Register was called for an issuer already stored. **Try:** treat as idempotent success or skip duplicate registration. |
| **#4** · Not initialized | A registry operation ran before \`initialize\`. **Try:** run initialize with the correct admin/config first. |
| **#5** · Invalid metadata | Metadata is larger than the contract allows. **Try:** shorten JSON/URI fields; check size limits in contract source. |

## API-level errors

Some failures never reach a contract: the ACTA API rejects them first and returns a structured error.

- **\`issuerDid_controller_mismatch\`** - The issuer must be a registered, resolvable **\`did:stellar\`**. The API enforces a controller-to-DID binding: the DID's on-chain controller must equal the **signing issuer**. If you issue with a \`did:stellar\` whose controller differs from the signer, the request fails with this error (returned by the API, not as a Soroban contract code). Bare wallet addresses and \`did:pkh\` values are no longer accepted as the issuer DID. **Try:** sign with the wallet that controls the DID, or register/resolve a \`did:stellar\` whose controller matches your signer.

## For developers

Authoritative enums live in **contracts-acta**: \`contracts/vc-vault/src/error.rs\`, \`contracts/vc-vault-factory/src/error.rs\`, and the did:stellar registry's \`error.rs\`. Treat the **N** numbers above as indicative and confirm names/codes against that source for your deployed release.
    `,
};
