# ACTA Docs MCP

MCP server for ACTA documentation.

## Usage

Run directly with `npx`:

```bash
npx -y @acta-team/docs-mcp
```

## MCP Client Config

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

## Tools

- `list_acta_docs`: list available documentation pages.
- `read_acta_doc`: read a page by `slug` and `locale`.
- `search_acta_docs`: search the ACTA docs.

Supported locales are `en` and `es`.

## Resources

Pages are exposed as:

```txt
acta-docs://{locale}/{slug}
```

Examples:

```txt
acta-docs://en/sdk-overview
acta-docs://es/introduction
```

## Example Prompts

- Use ACTA docs to explain how credential issuance works.
- Search ACTA docs for vault read operations.
- Read the ACTA SDK overview and summarize the available hooks.
