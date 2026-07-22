import type { DocPage } from "@/@types/docs";

export const mcp: DocPage = {
  slug: "mcp",
  title: "MCP",
  section: "MCP",
  tocItems: [
    "What it is",
    "Requirements",
    "Quick install",
    "Claude Desktop",
    "Claude Code",
    "Cursor",
    "VS Code",
    "Windsurf",
    "Verify the connection",
    "Documentation updates",
    "Advanced configuration",
    "Available tools",
    "Available resources",
    "Troubleshooting",
    "When to use this MCP",
  ],
  content: `
# MCP

**MCP** (npm package \`@acta-team/docs-mcp\`) is a read-only [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server. MCP-compatible clients - for example Claude, Cursor, or other assistants with MCP support - can query the **official ACTA documentation** through it.

Use it when you want an assistant to answer about ACTA grounded in **public, official, up-to-date** documentation, not just the model's generic knowledge.

## What it is

The package is \`@acta-team/docs-mcp\`.

It provides read access to ACTA's public documentation. No API key required.

This MCP server:

- Does not perform actions inside ACTA.
- Does not issue credentials.
- Does not sign transactions.
- Does not access wallets.
- Does not query private data.
- Does not modify smart contracts.
- Only provides read access to ACTA's public documentation.

## Requirements

- **Node.js 18 or newer** on the PATH (\`npx\` ships with it).
- Outbound network access to \`https://docs.acta.build\` to fetch the latest documentation. If you do not have it, see offline mode under Advanced configuration.

## Quick install

Run the server directly with \`npx\`:

\`\`\`bash
npx -y @acta-team/docs-mcp
\`\`\`

Most users should use this command unchanged. All the clients below run the same command; only the location of the config changes.

## Claude Desktop

Edit the config file:

- **macOS:** \`~/Library/Application Support/Claude/claude_desktop_config.json\`
- **Windows:** \`%APPDATA%\\Claude\\claude_desktop_config.json\`

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

Save and restart Claude Desktop.

## Claude Code

From the terminal, at your project root:

\`\`\`bash
claude mcp add acta-docs -- npx -y @acta-team/docs-mcp
\`\`\`

Confirm it registered with \`claude mcp list\`.

## Cursor

Create \`.cursor/mcp.json\` in your project (or Cursor's global MCP file):

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

Open **Settings > MCP** and confirm \`acta-docs\` shows as active.

## VS Code

Create \`.mcp.json\` at the workspace root (supported by Copilot Chat in agent mode):

\`\`\`json
{
  "servers": {
    "acta-docs": {
      "command": "npx",
      "args": ["-y", "@acta-team/docs-mcp"]
    }
  }
}
\`\`\`

## Windsurf

Edit \`~/.codeium/windsurf/mcp_config.json\`:

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

Reload MCP servers from the Cascade panel.

## Verify the connection

With the server connected, ask the assistant something it can only answer from the docs, for example:

> List the available ACTA documentation pages.

You should see it call the \`list_acta_docs\` tool. If it answers generically without calling any tool, check the troubleshooting below.

## Documentation updates

On startup, the server loads the latest documentation from:

\`\`\`text
https://docs.acta.build/api/mcp/docs-data
\`\`\`

If ACTA's documentation changes, you normally do **not** need to update the npm package. Just **restart or reload** the MCP client so the server process loads the updated documentation.

**New npm versions** are only needed when the MCP server **code** changes. If the remote endpoint fails, the server falls back to the documentation copy **bundled** in the npm package.

## Advanced configuration

- **\`ACTA_DOCS_MCP_OFFLINE=1\`:** skips the remote download and uses only the documentation bundled in the package.
- **\`ACTA_DOCS_MCP_DATA_URL\`:** uses a different remote URL for the documentation JSON.

Use \`ACTA_DOCS_MCP_DATA_URL\` only if you fully trust the configured source. The AI client will use that content as context to answer questions about ACTA.

## Available tools

- **\`list_acta_docs\`:** lists the available documentation pages.
- **\`read_acta_doc\`:** reads a specific page using its \`slug\` and locale.
- **\`search_acta_docs\`:** searches content within ACTA's documentation.

## Available resources

Documentation pages are exposed using this URI format:

\`\`\`text
acta-docs://{locale}/{slug}
\`\`\`

Currently supported locales:

- \`en\`
- \`es\`
- \`fr\`

## Troubleshooting

- **\`npx\` or \`node\` not found:** install Node.js 18+ and make sure it is on the PATH of the environment where the client runs. On Windows, restart the client after installing Node.
- **Server does not appear:** verify the JSON is valid (no trailing commas) and fully restart or reload the client.
- **No network or corporate proxy:** use \`ACTA_DOCS_MCP_OFFLINE=1\` to serve the bundled documentation, or point \`ACTA_DOCS_MCP_DATA_URL\` at a trusted internal copy.
- **Stale documentation:** the server loads docs at startup. Restart or reload the client to re-fetch; you usually do not need to update the npm package.
- **Slow first launch:** the first \`npx\` run downloads the package. Later runs use the cache.

## When to use this MCP

Use this MCP to ask about:

- What ACTA is.
- How credential issuance and verification work.
- How to integrate with the ACTA API or SDK.
- How ACTA's documented architecture works.
- Which endpoints, flows, or concepts are explained in the official documentation.

This MCP is designed for documentation and technical support. It does not replace a direct integration with the ACTA API.
  `,
};
