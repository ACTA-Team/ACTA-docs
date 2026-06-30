# ACTA Docs

The documentation site for **ACTA**: verifiable credentials and decentralized
identity on **Stellar**. It is the single reference for everything an issuer,
holder, verifier, or integrator needs to build on ACTA, from the REST API and
the SDK to the Soroban contracts and the dApp.

- Live: https://docs.acta.build
- dApp: https://dapp.acta.build
- DID resolver: https://did.acta.build
- API: `https://api.{testnet,mainnet}.acta.build`

## About ACTA

ACTA issues W3C-style verifiable credentials anchored on Stellar and Soroban:

- **`did:stellar` identities** resolved from an on-chain registry, decoupled
  from any single wallet (key rotation, portability).
- **Single-tenant credential vaults**, one Soroban contract per owner, deployed
  by a `vc-vault-factory`. Status and revocation are publicly verifiable on
  Stellar; issuance fees settle on-chain in USDC.
- A **prepare/submit** flow so the user's Stellar wallet signs every
  transaction; the services never hold keys.

## What this site documents

Bilingual (English / Spanish) content for:

- **Welcome**: introduction, architecture, getting started.
- **API Reference**: vault, credential, contract-info, sponsored-vault, and
  health endpoints (prepare/submit XDR).
- **SDK** (`@acta-team/credentials`): `useVault`, `useCredential`,
  `useVaultRead`, sponsored vault.
- **Contracts**: `vc-vault-factory`, single-tenant `vc-vault`,
  `did-stellar-registry`, and contract errors.
- **dApp**: features and usage of the web app.
- **MCP**: the docs MCP server for AI assistants.

## Tech stack

- Next.js (App Router), React, TypeScript, Tailwind CSS.
- Content is authored as typed `DocPage` modules (not Markdown files), which
  keeps it type-checked and lets the build generate a machine-readable index.
- `@acta-team/docs-mcp` (in `packages/docs-mcp`): an MCP server that exposes the
  docs to AI assistants, built from a generated `docs-data.json`.

## Quick start

```bash
npm install
npm run dev
```

The site runs at `http://localhost:3000/`.

## Scripts

| Script                      | What it does                                     |
| --------------------------- | ------------------------------------------------ |
| `npm run dev`               | Start the dev server                             |
| `npm run build`             | Generate the docs index and build the site       |
| `npm run start`             | Run the production server                        |
| `npm run lint`              | Run ESLint                                       |
| `npm run format`            | Format with Prettier                             |
| `npm run mcp:generate-docs` | Regenerate the MCP `docs-data.json` from content |

## Content structure

- `src/content/docs/modules/<module>/<lang>/<page>.ts` - one `DocPage` per page
  (`slug`, `title`, `section`, `tocItems`, `content`). `<lang>` is `en` or `es`.
- `src/content/docs/navigation/{en,es}.ts` - sidebar navigation per language.
- `src/content/docs/locales/` - UI strings.
- `packages/docs-mcp/` - the MCP server and the generated `docs-data.json`.

After editing content, run `npm run mcp:generate-docs` so the search index and
MCP data stay in sync.

## License

MIT.
