import type { DocPage } from "@/@types/docs";

export const mcpClients: DocPage = {
  slug: "mcp-clients",
  title: "MCP Client Setup",
  section: "AI",
  tocItems: [
    "Requirements",
    "Claude Desktop",
    "Claude Code",
    "Cursor",
    "VS Code",
    "Windsurf",
    "Verify the connection",
    "Troubleshooting",
  ],
  content: `
# MCP client setup

ACTA's documentation MCP server (\`@acta-team/docs-mcp\`) runs in any client that speaks [Model Context Protocol](https://modelcontextprotocol.io). Below are ready-to-paste blocks per client. They all run the same command; only the location of the config changes.

## Requirements

- **Node.js 18 or newer** on the PATH (\`npx\` ships with it).
- Outbound network access to \`https://docs.acta.build\` (to fetch the latest documentation). If you do not have it, see offline mode in [MCP](/en/mcp).

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

## Troubleshooting

- **\`npx\` or \`node\` not found:** install Node.js 18+ and make sure it is on the PATH of the environment where the client runs. On Windows, restart the client after installing Node.
- **Server does not appear:** verify the JSON is valid (no trailing commas) and fully restart or reload the client.
- **No network or corporate proxy:** use \`ACTA_DOCS_MCP_OFFLINE=1\` to serve the bundled documentation, or point \`ACTA_DOCS_MCP_DATA_URL\` at a trusted internal copy. See [MCP](/en/mcp).
- **Stale documentation:** the server loads docs at startup. Restart or reload the client to re-fetch; you usually do not need to update the npm package.
- **Slow first launch:** the first \`npx\` run downloads the package. Later runs use the cache.
  `,
};
