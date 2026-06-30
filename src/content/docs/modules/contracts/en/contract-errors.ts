import type { DocPage } from "@/@types/docs";

export const contractErrors: DocPage = {
  slug: "contract-errors",
  title: "Contract errors",
  section: "Contracts",
  tocItems: [
    "In one minute",
    "When you see this",
    "Issuance fee (USDC)",
    "Vault (vc-vault)",
    "Factory (vc-vault-factory)",
    "did:stellar registry",
    "API-level errors",
    "For developers",
  ],
  content: `
# Contract errors

If something goes wrong inside a Soroban contract, Stellar surfaces **\`Error(Contract, #N)\`** where **N** is a number. **Important:** the same **N** means different things on the **vault** than on the **factory**, the **did:stellar registry**, or the **USDC token** that collects the issuance fee. Always match the code to the contract you actually invoked. The codes below match the deployed v0.4.0 contracts; enums can be renumbered between releases, so when in doubt confirm against the source (see *For developers*).

## In one minute

- **Factory (vc-vault-factory)** - One per network. Deploys single-tenant \`vc-vault\` contracts deterministically from a vault template WASM, and provides the on-chain fee quote (\`quote_fee\`).
- **Vault (vc-vault)** - One per owner, deployed by the factory. Holds that owner's credentials. Issuance is **open by default** (deny-by-exception): owners block/unblock issuers. The issuance fee is charged on-chain in USDC, paid by the issuer. Vaults are **immutable** (the template is fixed at deploy).
- **did:stellar registry** - A separate contract for issuer DID metadata; it has its own error codes.
- **USDC token** - Issuance charges a fee, transferred by the USDC token contract. Its errors are about trustlines and balances, not vaults (see below).
- **API-level errors** - Some failures (like a DID controller mismatch) are returned by the ACTA API, before a contract is ever reached.

## When you see this

- **Often on submit** - Prepare may still return XDR; the error frequently appears only when your signed transaction runs on-chain.
- **Often on prepare** - The API simulates while preparing, so on-chain failures (including the USDC fee transfer) can also surface as the prepare call's error.
- **RPC / Horizon** - Failed simulation or submission responses include the contract error code and a diagnostic event log.
- **API responses** - API-level errors arrive as a structured error in the HTTP response, before or instead of a Soroban code.

## Issuance fee (USDC)

Issuing a credential charges an **on-chain fee in USDC** (quoted by the factory's \`quote_fee\`, paid by the **issuer**). That transfer runs inside the **USDC token contract**, so when it fails the error comes from the token, not from the vault. This is the most common real-world issuance failure on mainnet.

| What you see | What happened & what to try |
|-------|----------------------------|
| **"trustline entry is missing for account"** | The issuer wallet has no **USDC trustline**, so it cannot hold or send USDC. **Try:** add a USDC trustline to the issuer wallet (Circle USDC on mainnet), then retry. |
| **insufficient / "balance is not sufficient"** | The issuer has a USDC trustline but **not enough USDC** to cover the fee. **Try:** top up the issuer wallet with USDC and retry. |

> The USDC token contract has its **own** error codes that do **not** match the vault's. For example the token's "trustline missing" is its own code, unrelated to any vault \`#N\`. Identify a fee failure by the diagnostic text (trustline / balance) and by the token contract id in the event log, not by the bare number.

If your deployment does not want to charge a fee yet, the factory admin can disable it with \`set_fee_enabled(false)\` or set the standard fee to \`0\`.

## Vault (vc-vault)

These codes are **only** for \`vc-vault\`, under the **deny-by-exception** model (every issuer is allowed until the owner blocks it).

| Error | What happened & what to try |
|-------|----------------------------|
| **#4** · VaultRevoked | The vault is revoked, so writes that need an active vault are blocked. **Try:** stop issuing into this vault; handle recovery off-chain. |
| **#6** · VCNotFound | No credential with that \`vc_id\` in this vault (typo, wrong network, or wrong vault). **Try:** list the vault's \`vc_id\`s; recheck \`owner\` + \`vc_id\`. |
| **#7** · VCAlreadyRevoked | You revoked a credential that is already revoked. **Try:** refresh state from chain; treat the VC as invalid. |
| **#8** · VaultNotInitialized | There is no vault for this owner yet. **Try:** create the owner's vault (via the factory) before issuing. |
| **#9** · NotInitialized | The contract has no admin/config. **Try:** confirm you are calling the right vault \`C...\` for this network. |
| **#10** · InvalidVaultContract | A \`vault_contract\` parameter does not point at the vault being called. **Try:** pass the correct \`C...\` vault id; refresh the derived address and retry. |
| **#12** · VCAlreadyExists | Issue used a \`vc_id\` that already exists in this vault. **Try:** pick a new \`vc_id\`, or treat the credential as already issued. |
| **#13** · NoPendingAdmin | \`accept_contract_admin\` ran but no admin nomination is pending. **Try:** nominate the new admin first, then accept. |
| **#15** · VaultFull | The vault reached its maximum number of active credentials. **Try:** revoke unused VCs or use a separate vault. |
| **#16** · LimitTooLarge | A pagination \`limit\` exceeds the contract maximum. **Try:** request a smaller page size. |
| **#17** · BatchTooLarge | A batch issuance exceeds \`MAX_BATCH_SIZE\`. **Try:** split into smaller batches. |
| **#18** · BatchEmpty | Batch issuance was called with an empty list. **Try:** include at least one credential. |
| **#19** · InputTooLong | A field (vc_id, vc_data, did_uri, issuer_did, or date) exceeds its maximum length. **Try:** shorten the field. |
| **#23** · FeeOutOfBounds | The batch fee total (per-credential fee x batch size) overflowed \`i128\`. **Try:** reduce the batch size. |
| **#24** · SourceNotAVault | A push source is not a vault deployed by the factory. **Try:** only push between factory-deployed vaults. |
| **#25** · IssuerDenied | The issuer is in this vault's **denied list**, so issuance is rejected. **Try:** the owner can unblock it with \`allow_issuer\`, or use a different (allowed) issuer. |
| **#26** · PushOwnerMismatch | A \`receive_push\` source vault has a different owner than this vault. **Try:** only push between vaults with the same owner. |

> Codes **#2** (IssuerNotAuthorized), **#3** (IssuerAlreadyAuthorized), and **#20** (IssuerListTooLong) are retired from the old issuer-whitelist model and are no longer raised, but kept for ABI stability.

## Factory (vc-vault-factory)

One factory per network deploys and tracks every \`vc-vault\`. These codes are **only** for \`vc-vault-factory\`.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · NoPendingAdmin | \`accept_admin\` ran but no admin nomination is pending. **Try:** nominate the new admin first, then accept. |
| **#2** · InvalidFeeAmount | A fee amount is negative. **Try:** pass a non-negative amount. |
| **#3** · FeeOutOfBounds | A fee amount exceeds \`MAX_FEE_AMOUNT\`. **Try:** use a value within the allowed range. |
| **#4** · FeeBelowMin | A fee amount is below the configured \`MinFee\`. **Try:** raise the amount to at least the minimum. |
| **#5** · FeeNotConfigured | \`set_fee_enabled(true)\` was called before token + dest + standard fee were set. **Try:** configure the fee (\`set_fee_config\`) before enabling it. |
| **#6** · ExpiryInPast | A custom per-issuer fee expiry is not in the future. **Try:** use a future timestamp or omit the expiry. |
| **#7** · NotInitialized | \`VaultMeta\` is missing (the constructor never ran or state was lost). **Try:** use the live factory for this network. |

## did:stellar registry

Codes here belong **only** to the **did:stellar registry**, the contract that stores issuer DID records. Do not mix them with vault or factory codes.

| Error | What happened & what to try |
|-------|----------------------------|
| **#1** · DidAlreadyExists | \`register\` was called for a DID id that already exists. **Try:** resolve the existing DID, or use a new id. |
| **#2** · DidNotFound | Update / resolve / transfer referenced a DID that is not registered. **Try:** verify the DID id and network; register it first. |
| **#3** · VersionMismatch | An update sent a version that does not match the stored record (optimistic concurrency). **Try:** re-read the record and retry with the current version. |
| **#4** · DidDeactivated | The DID was deactivated and can no longer be updated or used. **Try:** register a new DID. |
| **#5** · InvalidAuthKeyCount | The authentication key count is outside the allowed range. **Try:** include a valid number of authentication keys. |
| **#6** · InvalidAssertionKeyCount | The assertionMethod key count is outside the allowed range. **Try:** adjust the assertion keys. |
| **#7** · InvalidKeyAgreementCount | The keyAgreement key count is outside the allowed range. **Try:** adjust the key agreement keys. |
| **#8** · InvalidServiceCount | The number of services exceeds the limit. **Try:** reduce the number of services. |
| **#9** · DuplicateKey | The same key appears more than once where it must be unique. **Try:** remove the duplicate. |
| **#10** · KeyTooLong | A key multibase value exceeds the max length. **Try:** check the key encoding/length. |
| **#11** · KeyEmpty | A key value is empty. **Try:** provide a valid multibase key. |
| **#12** · ServiceTypeTooLong | A service \`type\` exceeds the max length. **Try:** shorten the type. |
| **#13** · ServiceIdTooLong | A service \`id\` suffix exceeds the max length. **Try:** shorten the id suffix. |
| **#14** · ServiceIdInvalidFormat | A service \`id\` suffix has an invalid format. **Try:** use a valid id suffix. |
| **#15** · ServiceEndpointInvalid | A service endpoint is not a valid URI. **Try:** provide a valid endpoint URI. |
| **#16** · MetadataUriInvalid | A metadata URI is invalid. **Try:** provide a valid URI. |
| **#17** · NoProposedAdmin | \`accept_admin\` ran with no admin nomination pending. **Try:** nominate first, then accept. |
| **#18** · ServiceTypeEmpty | A service \`type\` is empty. **Try:** provide a non-empty type. |
| **#19** · VersionOverflow | The record version counter overflowed. **Try:** this is effectively unreachable in practice; contact the maintainers. |
| **#20** · MetadataInconsistent | The stored metadata is internally inconsistent. **Try:** re-submit a consistent record. |
| **#21** · DuplicateServiceId | Two services share the same \`id\` suffix. **Try:** make every service id suffix unique. |

## API-level errors

Some failures never reach a contract: the ACTA API rejects them first and returns a structured error (a stable \`code\` plus a message).

**Issuer DID (\`did:stellar\` only):** the issuer must be a registered, resolvable \`did:stellar\` whose on-chain controller equals the signing issuer. Bare wallet addresses and \`did:pkh\` values are not accepted as the issuer DID.

| Code | Meaning & what to try |
|------|-----------------------|
| **\`issuerDid_required\`** | No issuer DID was provided. **Try:** register your \`did:stellar\` (Dashboard -> My DID) and pass it. |
| **\`issuerDid_invalid\`** | The value is not a well-formed \`did:stellar\`. **Try:** use the form \`did:stellar:{network}:{id}\`. |
| **\`issuerDid_unresolvable\`** | The DID does not resolve on this network's registry (not registered, or registered elsewhere). **Try:** register the DID on this network before issuing. |
| **\`issuerDid_controller_mismatch\`** | The DID's on-chain controller is not the signing issuer. **Try:** sign with the wallet that controls the DID. |
| **\`issuerDid_network_mismatch\`** | The DID's network does not match the network you are issuing on. **Try:** switch network, or use a DID registered on this one. |
| **\`issuerDid_deactivated\`** | The DID has been deactivated. **Try:** register a new DID. |
| **\`issuerDid_registry_unavailable\`** | No registry is configured for this network on the API. **Try:** retry later or contact the operator. |

**Validation:** \`owner_invalid\` / \`owner_required\`, \`issuer_invalid\` / \`issuer_required\`, \`vcId_required\`, \`vcData_required\`, \`vaultContract_invalid\` (must be a valid \`C...\`), and \`userSalt_invalid\` (must be 32 bytes in hex) are returned for malformed requests. **Try:** fix the offending field and resend.

## For developers

Authoritative enums live in **contracts-acta**: \`contracts/vc-vault/src/error.rs\`, \`contracts/vc-vault-factory/src/error.rs\`, and \`contracts/did-stellar-registry/src/errors.rs\`. The USDC fee error comes from the **Stellar Asset Contract** of the configured fee token (its codes are defined by Stellar, not by ACTA). The API maps recognised contract codes to stable string \`code\`s; confirm against the source for your deployed release.
    `,
};
