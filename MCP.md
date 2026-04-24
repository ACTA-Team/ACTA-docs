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
