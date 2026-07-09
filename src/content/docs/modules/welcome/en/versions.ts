import type { DocPage } from "@/@types/docs";

export const versions: DocPage = {
  slug: "versions",
  title: "Versions & Changelog",
  section: "Welcome",
  tocItems: [
    "Current release line",
    "Compatibility",
    "What's new in v0.4.0",
    "Removed in v0.4.0",
    "Deprecations & back-compat",
    "Where the changelogs live",
  ],
  content: `
# Versions & Changelog

The versions this documentation describes, how they fit together, and what changed in the current release line.

## Current release line

| Component | Package / artifact | Version |
|-----------|--------------------|---------|
| Credentials SDK | \`@acta-team/credentials\` | 1.1.4 |
| DID library | \`@acta-team/did-stellar\` | 0.1.1 |
| ACTA API | acta-api | 1.1.1 |
| dApp | dapp.acta.build | 2.1.1 |
| vc-vault contract | template WASM | 0.4.0 |
| vc-vault-factory contract | per network | 0.1.0 |
| did-stellar-registry contract | mainnet | 0.2.0 |
| Docs MCP server | \`@acta-team/docs-mcp\` | 0.1.0 |

## Compatibility

- **SDK 1.1.2+** requires **acta-api 1.1.1** (the vc-vault-factory v0.4.0 API surface). Older SDK releases target removed endpoints and will fail.
- The SDK's default base URLs point at the hosted API for both networks, which runs the versions above; \`GET /config\` tells you at runtime which factory, template WASM hash, and DID registry a deployment uses.
- SDK peer dependency: React 18 or 19.

## What's new in v0.4.0

The current release line ("vc-vault-factory v0.4.0 + did:stellar", 2026-06-30) introduced:

- **Single-tenant vaults deployed by a factory**: one \`vc-vault\` per owner, deterministic addresses, replacing the previous multi-tenant vault (v0.3.0).
- **Deny-by-exception issuance**: open by default; owners block/unblock issuers (\`deny-issuer\` / \`allow-issuer\`).
- **did:stellar as the mandatory issuer identity**, with controller-to-signer binding enforced by the API; the SDK auto-onboards issuer DIDs (\`getOrCreateIssuerIdentity\`).
- **On-chain fees** via the factory's \`quote_fee\` (mainnet 1 USDC, testnet 5 XLM), removing API-side fee logic and fee overrides.
- **Immutable vaults**: the vault's \`upgrade\` entrypoint was removed.
- SDK 1.1.4 hardening: \`ActaApiError\` on every failure, 30s timeouts, memoized hooks, IndexedDB identities encrypted at rest.
- dApp 2.1.x: issuer access reframed as a block-list, session-only API key storage, security headers, transaction-safety checks before signing.

## Removed in v0.4.0

If you integrated against v0.3.0, these no longer exist:

- Endpoints: \`POST /contracts/vc/issue-linked\`, \`GET /contracts/vault/get-vc-parent\`, batch \`authorize-issuers\`, the authorized-issuers list/count reads, role-based fee tier endpoints, and the sponsor whitelist endpoints (\`open-to-all\`, \`add-sponsor\`, \`remove-sponsor\`).
- Request fields: the separate \`holder\` field (the holder now lives in \`vcData.credentialSubject.id\`) and any fee override in request bodies.
- Identity: \`did:pkh\` and bare wallet addresses as issuer DID.
- SDK methods: \`vcIssueLinked\`/\`issueLinked\`, \`vaultGetVcParent\`/\`getVcParent\` (1.1.2) and \`vaultMigrate\`, batch \`vaultAuthorizeIssuers\`, the sponsored-vault whitelist helpers (1.1.3).

## Deprecations & back-compat

Still working today, scheduled to change:

| Item | Status |
|------|--------|
| \`POST /contracts/vault/authorize-issuer\` / \`revoke-issuer\` | Back-compat aliases of \`allow-issuer\` / \`deny-issuer\` |
| \`actaContractId\` in \`GET /config\` | Back-compat alias of \`factoryContractId\` |
| Path-prefixed URLs (\`acta.build/api/{network}/...\` style) | Legacy; the canonical hosts are \`api.{network}.acta.build\` |
| SDK \`createCredential\`, \`getDefaults\`, \`prepareStoreTx\`, \`prepareListVcIdsTx\`, \`prepareGetVcTx\`, \`vaultStore\` | Deprecated stubs, removal planned for SDK 2.0.0 |

## Where the changelogs live

Every repository keeps its own \`CHANGELOG.md\` on the [ACTA-Team GitHub organization](https://github.com/ACTA-Team): the API, the credentials SDK, the dApp, the contracts, the DID monorepo, and this documentation site.
    `,
};
