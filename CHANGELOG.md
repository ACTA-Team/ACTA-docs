# Changelog

All notable changes to the ACTA documentation site (`docs.acta.build`) are
documented in this file. The site hosts the API Reference, SDK, dApp,
Contracts, and MCP docs for ACTA on Stellar.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-06-30 - vc-vault-factory v0.4.0 + did:stellar

Brings every doc module from the legacy multi-tenant `vc-vault` (v0.3.0) model
to the v0.4.0 `vc-vault-factory` + single-tenant vault architecture, with
`did:stellar` as the issuer identity. English and Spanish kept in sync.

### Changed

- **API Reference**: single-tenant vaults deployed by the factory and addressed
  by owner (deterministic vault address, optional `userSalt` / `vaultContract`);
  on-chain fees via the factory's `quote_fee`; `did:stellar` issuer with the
  controller / DID binding (`issuerDid_controller_mismatch`); updated `/config`
  shape (`factoryContractId`, `networkType`, `vaultWasmHash`,
  `didStellarRegistryId`, with `actaContractId` as an alias); `revoke` requires
  `owner`; `version` is per-vault (`?owner=`).
- **Issuer model**: documented the deny-by-exception model (issuance open by
  default) with `deny-issuer` / `allow-issuer`; `authorize-issuer` /
  `revoke-issuer` noted as back-compat aliases.
- **SDK**: `denyIssuer` / `allowIssuer`, `userSalt` passthrough, `revoke` sends
  `owner`, new `ConfigResponse` fields, `getOrCreateIssuerIdentity` auto
  onboarding.
- **dApp**: issuance open by default; the "Authorize" page is now "Issuer
  access" (block / unblock); issuing requires a registered `did:stellar`.
- **Contracts / Welcome**: `vc-vault-factory` + single-tenant `vc-vault` v0.4.0
  architecture, with mainnet and testnet contract IDs and the vault template
  hash; contract-errors reframed to the deny model plus an API-level errors
  section.

### Removed

- Docs for endpoints dropped in v0.4.0: issue-linked, get-vc-parent,
  authorize-issuers (batch), authorized-issuers list/count, role-based fee
  tiers, sponsor whitelist (open-to-all / add-sponsor / remove-sponsor), and the
  separate `holder` field on issuance (the holder lives in
  `vcData.credentialSubject.id`).
