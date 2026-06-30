import type { DocPage } from "@/@types/docs";

export const mcp: DocPage = {
  slug: "mcp",
  title: "MCP",
  section: "MCP",
  tocItems: [
    "What it is",
    "Quick installation",
    "MCP client configuration",
    "Documentation updates",
    "Advanced configuration",
    "Available tools",
    "Available resources",
    "When to use this MCP",
  ],
  content: `
# MCP

**MCP** (npm package \`@acta-team/docs-mcp\`) is a read-only [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server. MCP-compatible clients-for example Claude, Cursor, or other assistants that support MCP-can query the **official ACTA documentation** through it.

Use it when you want an assistant to answer questions about ACTA using **public, official, and up-to-date** documentation, not guesses from general training data alone.

## What it is

The package is \`@acta-team/docs-mcp\`.

It provides read-only access to public ACTA documentation. It does not require an API key.

This MCP server:

- Does not perform actions inside ACTA.
- Does not issue credentials.
- Does not sign transactions.
- Does not access wallets.
- Does not query private data.
- Does not modify smart contracts.
- Only provides read access to public ACTA documentation.

## Quick installation

Run the server directly with \`npx\`:

\`\`\`bash
npx -y @acta-team/docs-mcp
\`\`\`

Most users should use this command without changes.

## MCP client configuration

Use this configuration in an MCP-compatible client:

\`\`\`json
{
  "mcpServers": {
    "acta-docs": {
      "command": "npx",
      "args": ["-y", "@acta-team/docs-mcp"]
    }
  }
}
\`\`\`

After saving the configuration, restart or reload your MCP client.

## Documentation updates

When it starts, the server loads the latest documentation from:

\`\`\`text
https://docs.acta.build/api/mcp/docs-data
\`\`\`

If ACTA documentation changes, users **do not** need to update the npm package. Restarting or reloading the MCP client is enough for the server process to load the updated documentation.

New npm versions are **only** needed when the MCP server **code** changes. If the remote endpoint fails, the server uses the documentation copy **bundled** in the npm package.

## Advanced configuration

- **\`ACTA_DOCS_MCP_OFFLINE=1\`:** skip the remote fetch and use bundled documentation only.
- **\`ACTA_DOCS_MCP_DATA_URL\`:** use a different remote docs JSON URL.

Use \`ACTA_DOCS_MCP_DATA_URL\` only if you completely trust the configured source. The AI client will use that content as context to answer questions about ACTA.

## Available tools

- **\`list_acta_docs\`:** lists the available documentation pages.
- **\`read_acta_doc\`:** reads a specific page using its \`slug\` and locale.
- **\`search_acta_docs\`:** searches content inside the ACTA documentation.

## Available resources

Documentation pages are exposed using this URI format:

\`\`\`text
acta-docs://{locale}/{slug}
\`\`\`

Currently supported locales:

- \`en\`
- \`es\`

## When to use this MCP

Use this MCP to ask about:

- What ACTA is.
- How credential issuance and verification work.
- How to integrate with the ACTA API or SDK.
- How the documented ACTA architecture works.
- Which endpoints, flows, or concepts are explained in the official documentation.

This MCP is designed for documentation and technical support. It does not replace a direct integration with the ACTA API.
  `,
};
