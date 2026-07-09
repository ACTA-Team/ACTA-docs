import type { DocPage } from "@/@types/docs";

export const sponsoredVault: DocPage = {
  slug: "api-sponsored-vault",
  title: "Sponsored Vault",
  section: "API Reference",
  tocItems: [
    "Concept",
    "On-chain (vc-vault-factory)",
    "HTTP API",
    "Prepare / submit",
    "Operational notes",
  ],
  content: `
# Sponsored Vault

A **sponsored vault** is a normal single-tenant ACTA vault deployed through **\`deploy_sponsored\`** on the **vc-vault-factory** contract. The **sponsor** invokes the factory and must satisfy Soroban auth (\`sponsor.require_auth()\`); the **owner** is the vault admin and does not sign this transaction. Use this when an organization pays fees or orchestrates onboarding while the end user only receives the vault.

For comparison, \`POST /contracts/vault/create\` prepares the owner's own factory deploy, where the **owner** typically signs. The sponsored flow uses \`POST /contracts/sponsored-vault/create\`; the invoke must satisfy on-chain auth for **sponsor** - in practice the prepared XDR is usually signed by the sponsor account (see **sourcePublicKey** below).

## Concept

| Role | Responsibility |
|------|----------------|
| **Sponsor** | Signs the transaction. Pays network/fees like any invoke. |
| **Owner** | Receives the vault; address stored as vault admin; \`didUri\` stored for the vault. |

**Open sponsorship on-chain, admin-gated over HTTP:** on the contract, any sponsor address may call \`deploy_sponsored\` for an owner (subject to Stellar/Soroban auth and fees) - there is no sponsor allowlist and no open-to-all toggle. The ACTA API route, however, requires an **admin-role API key** (see below).

The factory derives the vault address deterministically from \`(factory, owner, userSalt)\`, so a sponsored deploy and a self-service deploy for the same owner + salt resolve to the same vault. Calling deploy again for an owner that already has a vault at that salt fails on-chain (already deployed).

On success the factory emits a vault-deployed event with the \`sponsor\`, \`owner\`, and \`did_uri\`.

## On-chain (vc-vault-factory)

The relevant factory entrypoint is:

| Function | Auth | Description |
|----------|------|-------------|
| \`deploy_sponsored(deployer, owner, did_uri, user_salt)\` | Deployer (sponsor) | Deterministically deploys the owner's vault if not already deployed at that salt. |

The API's \`sponsor\` request field maps to the contract's \`deployer\` parameter.

**Public HTTP:** the ACTA API documents only **\`POST /contracts/sponsored-vault/create\`** (prepare/submit for \`deploy_sponsored\`).

## HTTP API

This route requires an **API key with the admin role** (\`X-ACTA-Key\` header) and is rate limited per key. Standard keys receive \`403\`. Prefix paths with your network base URL (e.g. \`https://api.testnet.acta.build\`).

> **Getting an admin key:** admin keys are not self-service; they are provisioned by the ACTA team. Reach out via **[Support](doc:support)** or [Discord](https://discord.gg/DsUSE3aMDZ) if your organization needs sponsored onboarding.

### POST /contracts/sponsored-vault/create

Prepares or submits \`deploy_sponsored\`.

**Prepare body:**

\`\`\`json
{
  "sponsor": "G...",
  "owner": "G...",
  "didUri": "did:stellar:...",
  "userSalt": "00...00",
  "sourcePublicKey": "G..."
}
\`\`\`

- **sponsor** (required): Stellar address passed to the factory as the sponsor (must satisfy \`sponsor.require_auth()\` when the transaction is signed and submitted).
- **owner** (required): Vault owner (\`G...\`).
- **didUri** (required): DID URI stored for the vault.
- **userSalt** (optional): 32-byte salt selecting the owner's vault; defaults to 32 zero bytes (one canonical vault per owner).
- **sourcePublicKey** (required): Stellar account used as the **transaction source** when the API prepares the XDR. The signed invoke must still authorize **sponsor** on the contract; typically the sponsor account is both \`sponsor\` and the signing/source account.

**Submit body:** \`{ "signedXdr": "AAAA..." }\`

**Responses:** Prepare returns \`{ "xdr", "network" }\`; Submit returns \`{ "tx_id" }\`.

## Prepare / submit

This write endpoint follows the standard two-step flow:

1. **Prepare** - JSON with operation fields (no \`signedXdr\`) returns \`xdr\` + \`network\` passphrase.
2. **Sign** - Stellar wallet signs the XDR so the sponsor's auth requirements are met.
3. **Submit** - POST the same path with \`{ "signedXdr" }\` returns \`tx_id\`.

## Operational notes

- Avoid calling **create** when the owner already has a vault at the chosen \`userSalt\`; the on-chain deploy fails if the vault already exists. Prefer an on-chain or API read of vault existence first (see vault read operations).
- Issuance fees are charged on-chain by the vault (via the factory's \`quote_fee\`) and paid by the issuer at issuance time, independently of who sponsored the vault deploy.
    `,
};
