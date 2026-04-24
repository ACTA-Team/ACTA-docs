# ACTA Docs MCP Server

This repository includes a publishable, read-only MCP server that exposes the ACTA documentation to AI clients.

## What It Exposes

- Resources: `acta-docs://{locale}/{slug}`
- Tools:
  - `list_acta_docs`
  - `read_acta_doc`
  - `search_acta_docs`
- Prompt:
  - `answer_acta_question`

Supported locales are `en` and `es`.

## Use From npm

```bash
npx -y @acta-team/docs-mcp
```

By default, the npm package tries to load the latest docs from:

```text
https://docs.acta.build/api/mcp/docs-data
```

If the remote endpoint is unavailable, the MCP server falls back to the docs snapshot bundled in the npm package.

## MCP Client Config

Use this style of config in an MCP-compatible client:

```json
{
  "mcpServers": {
    "acta-docs": {
      "command": "npx",
      "args": ["-y", "@acta-team/docs-mcp"]
    }
  }
}
```

## Develop Locally

The package lives in `packages/docs-mcp`.

```bash
npm install
npm run mcp:generate-docs
npm run mcp:build
npm run mcp:test
```

For local MCP client testing from this repo:

```json
{
  "mcpServers": {
    "acta-docs": {
      "command": "cmd",
      "args": [
        "/c",
        "cd /d C:\\Users\\Danny\\Documents\\GitHub\\ACTA-docs && npm run mcp"
      ]
    }
  }
}
```

## Package Scripts

- `npm run mcp:generate-docs`: generate static docs JSON from `src/content/docs`.
- `npm run mcp:build`: generate docs and compile the MCP package.
- `npm run mcp:test`: run a smoke test against the compiled MCP server.
- `npm run mcp:pack`: create the npm tarball locally.
- `npm run mcp:publish`: publish `@acta-team/docs-mcp` publicly to npm.

## Remote Docs Data

The docs site exposes the MCP data at:

```text
/api/mcp/docs-data
```

The MCP package supports these optional environment variables:

- `ACTA_DOCS_MCP_DATA_URL`: override the remote docs JSON URL.
- `ACTA_DOCS_MCP_OFFLINE=1`: skip the remote fetch and use bundled docs only.

## Publishing

Before publishing, make sure the npm account has access to the `@acta-team` scope:

```bash
npm login
npm run mcp:test
npm run mcp:pack
npm run mcp:publish
```

After publishing, validate from a clean folder:

```bash
npx -y @acta-team/docs-mcp
```
