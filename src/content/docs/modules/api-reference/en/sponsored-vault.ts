import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "api-sponsored-vault",
  title: "Sponsored Vault",
  section: "API Reference",
  tocItems: [
    "Concept",
    "On-chain (factory.deploy_sponsored)",
    "HTTP API",
    "Prepare / submit",
    "Operational notes",
  ],
  content: `
# Sponsored Vault

A **sponsored vault** is a normal single-tenant ACTA vault, deployed through **\`deploy_sponsored\`** on the **vc-vault-factory**. The **sponsor** invokes the factory and signs the transaction (mapped on-chain to the deployer); the **owner** receives the vault and does not sign. Use this when an organization orchestrates onboarding while the end user only receives the vault.

For comparison, \`POST /contracts/vault/create\` prepares the factory's \`deploy\`, where the **owner** typically signs. The sponsored flow uses \`POST /contracts/sponsored-vault/create\`. Either way, the owner ends up with the deterministic vault at \`(factory, owner, userSalt)\`.

## Concept

| Role | Responsibility |
|------|----------------|
| **Sponsor** | Signs the transaction; mapped on-chain to the deployer. Pays network/fees like any invoke. |
| **Owner** | Receives the single-tenant vault; address stored as vault admin; \`didUri\` stored for the vault. |

**Sponsored deploy is open** - any sponsor address may call \`deploy_sponsored\` (subject to Stellar/Soroban auth and fees). There is **no sponsor whitelist** and **no open-to-all flag** to manage.

On success the factory deploys the owner's vault at the deterministic \`(factory, owner, userSalt)\` address.

## On-chain (factory.deploy_sponsored)

Relevant Soroban entrypoint on the **vc-vault-factory**:

| Function | Auth | Description |
|----------|------|-------------|
| \`deploy_sponsored(sponsor, owner, did_uri, user_salt)\` | Sponsor | Deterministically deploys a single-tenant vault for \`owner\`; the sponsor authorizes the deploy. |

**Public HTTP:** the ACTA API documents only **\`POST /contracts/sponsored-vault/create\`** (prepare/submit for \`deploy_sponsored\`). There are no admin/whitelist routes - sponsored deploy is open.

## HTTP API

This route uses the same middleware as other public \`/contracts/*\` write routes: **\`X-ACTA-Key\`** header, valid API key, and rate limits. Prefix paths with your network base URL (e.g. \`https://api.testnet.acta.build\`).

### POST /contracts/sponsored-vault/create

Prepares or submits \`deploy_sponsored\`.

**Prepare body:**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:stellar:testnet:znfxngsh46vkyqu6inrx4omphi",
  "userSalt": "0000...0000",
  "sourcePublicKey": "G..."
}
\`\`\`

- **sponsor** (required): Stellar address mapped to the on-chain deployer (must satisfy auth when the transaction is signed and submitted).
- **owner** (required): Vault owner (\`G...\`); the vault is deployed deterministically for this owner.
- **didUri** (required): DID URI stored for the vault.
- **userSalt** (optional): 32-byte salt (hex) selecting the vault. Defaults to all-zero.
- **sourcePublicKey** (required): Stellar account used as the **transaction source** when the API prepares the XDR. Typically the sponsor account is both \`sponsor\` and the signing/source account.

**Submit body:** \`{ "signedXdr": "AAAA..." }\`

**Responses:** Prepare → \`{ "xdr", "network" }\`; Submit → \`{ "tx_id" }\`.

## Prepare / submit

This write endpoint follows the standard two-step flow:

1. **Prepare** - JSON with operation fields (no \`signedXdr\`) → \`xdr\` + \`network\` passphrase.
2. **Sign** - Stellar wallet signs the XDR so the sponsor's auth requirements are met.
3. **Submit** - POST the same path with \`{ "signedXdr" }\` → \`tx_id\`.

## Operational notes

- Sponsored deploy is **open**: no whitelist or open-to-all flag to check before calling **create**.
- Avoid calling **create** when the owner already has a vault at the same \`userSalt\`; prefer an API read of vault existence first (see vault read operations).
    `,
};
