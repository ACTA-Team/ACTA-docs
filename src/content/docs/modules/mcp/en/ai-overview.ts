import type { DocPage } from "@/@types/docs";

export const aiOverview: DocPage = {
  slug: "ai-overview",
  title: "AI Overview",
  section: "AI",
  tocItems: [
    "Two ways to use AI with ACTA",
    "AI on top of ACTA",
    "Credentials for agents",
    "What is in this section",
    "Security principles",
  ],
  content: `
# AI at ACTA

This section brings together everything about artificial intelligence and ACTA: how to connect AI assistants to ACTA's documentation and APIs, and how to use verifiable credentials as a trust layer for AI agents.

## Two ways to use AI with ACTA

There are two distinct axes, and it helps to keep them separate:

1. **AI on top of ACTA.** You use an assistant (Claude, Cursor, VS Code, Windsurf, or another) to build on ACTA faster: ask how the SDK works, generate snippets, understand errors, or verify credentials through tools.
2. **Credentials for agents.** You use ACTA to give AI agents their own identity and verifiable credentials, so they can prove who they are, what permissions they hold, and who operates them.

## AI on top of ACTA

The entry point is the **documentation MCP server** (\`@acta-team/docs-mcp\`), which exposes ACTA's official, up-to-date documentation to any client that speaks [Model Context Protocol](https://modelcontextprotocol.io). With it, the assistant answers questions about ACTA grounded in real sources instead of generic model knowledge.

On top of that you can give a model **read-only tools** against the ACTA API (for example, verifying a credential) using function calling. Issuance, signing, and wallet access should never be left to the model autonomously.

## Credentials for agents

The same primitives ACTA offers for people and organizations (\`did:stellar\` DIDs, vaults, and verifiable credentials) apply to AI agents. An agent can hold its own DID, carry credentials that declare its operator and permissions, and present them verifiably to other services or agents.

See [Identity for AI Agents](/en/agent-identity) for the conceptual detail and integration patterns.

## What is in this section

- **[MCP](/en/mcp):** the read-only documentation server, per-client setup (Claude, Cursor, VS Code, Windsurf), and troubleshooting.
- **[Prompt Recipes](/en/ai-prompts):** concrete examples to get the most out of the MCP.
- **[Identity for AI Agents](/en/agent-identity):** verifiable credentials applied to agents.

## Security principles

- The documentation MCP is **read-only**: it does not issue credentials, sign transactions, or access wallets.
- When exposing API tools to a model, scope them to read operations unless a human approves every sensitive action.
- Treat any configurable context source (for example \`ACTA_DOCS_MCP_DATA_URL\`) as trusted only if you control its origin.
  `,
};
