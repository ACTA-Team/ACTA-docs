import type { DocPage } from "@/@types/docs";

export const agentSkills: DocPage = {
  slug: "agent-skills",
  title: "Agent Skills",
  section: "AI",
  tocItems: [
    "What it is",
    "Install",
    "What the skill covers",
    "How it works",
    "Skill vs MCP",
    "Source of truth",
  ],
  content: `
# Agent Skills

The **ACTA Agent Skill** teaches an AI coding agent how to build with ACTA correctly. It is published as an open [Agent Skill](https://www.skills.sh) that installs into Claude Code, Cursor, GitHub Copilot, Windsurf, Gemini, and other MCP or skill-compatible agents.

Use it when you want your coding agent to write ACTA integrations without guessing: the right package name, base URLs, the prepare/submit flow, \`did:stellar\` issuer identity, error codes, and the security model all come from the official docs instead of stale training data.

- **Skill page:** [skills.sh/acta-team/skills/stellar-verifiable-credentials](https://www.skills.sh/acta-team/skills/stellar-verifiable-credentials)
- **Repository page:** [skills.sh/acta-team/skills](https://www.skills.sh/acta-team/skills)
- **Source:** [github.com/ACTA-Team/skills](https://github.com/ACTA-Team/skills)

## What it is

A skill is a reusable folder (a \`SKILL.md\` plus references and examples) that an agent loads as context. The agent reads the skill's description, decides it is relevant to your ACTA task, and follows its instructions in place of guessing. See [AI Overview](doc:ai-overview) for how skills fit next to the other AI tooling.

## Install

Install into any supported agent with the skills CLI:

\`\`\`bash
# Install every skill in the repo
npx skills add ACTA-Team/skills

# Or install just the credentials skill
npx skills add ACTA-Team/skills/stellar-verifiable-credentials
\`\`\`

The CLI writes the skill into your agent's skills directory (for example \`.claude/skills/\` for Claude Code) and the agent picks it up automatically. See the [skills.sh docs](https://www.skills.sh/docs) for per-agent details.

You can also copy the \`stellar-verifiable-credentials/\` folder from the repo directly into your agent's skills directory.

## What the skill covers

- The \`@acta-team/credentials\` React SDK: \`ActaConfig\`, \`useCredential\`, \`useVault\`, \`useVaultRead\`, \`useActaClient\`, and \`ActaClient\`.
- The REST API: \`/contracts/*\` endpoints, the \`X-ACTA-Key\` header, the prepare/submit XDR flow, ownership rules, rate limits, and idempotency.
- \`did:stellar\` issuer and holder identity, resolution, and issuer verification.
- Vaults: single-tenant, deterministic addressing, sponsored vaults, and push.
- Error handling: HTTP codes, validation, issuer-DID errors, contract errors, and the mainnet USDC fee failures.
- The security and data model: who signs what, what is on-chain versus encrypted.

The skill is structured for progressive disclosure: a concise \`SKILL.md\` entry point, with deeper material in \`references/\` and runnable code in \`examples/\`.

## How it works

[skills.sh](https://www.skills.sh) has no separate publish step. A repository is indexed automatically through anonymous install telemetry the first time someone runs \`npx skills add ACTA-Team/skills\`. The more it is installed, the higher it ranks in the directory.

## Skill vs MCP

The skill and the [MCP server](doc:mcp) are complementary:

- The **skill** ships opinionated, ready-to-use integration guidance that the agent follows while writing code.
- The **MCP** (\`@acta-team/docs-mcp\`) lets the agent query the live official documentation on demand.

Install both for the best result: the skill for how to build, the MCP for looking things up.

## Source of truth

The skill is distilled from the official documentation at [docs.acta.build](https://docs.acta.build). When a detail in the skill conflicts with the live docs, the live docs win.
  `,
};
