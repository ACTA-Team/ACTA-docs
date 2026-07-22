import type { DocPage } from "@/@types/docs";

export const aiPrompts: DocPage = {
  slug: "ai-prompts",
  title: "Prompt Recipes",
  section: "AI",
  tocItems: [
    "How to use these recipes",
    "Understand ACTA",
    "Integrate the SDK",
    "Work with the API",
    "Debug errors",
    "DID and identity",
    "Tips for better answers",
  ],
  content: `
# Prompt recipes

With the documentation MCP server connected ([see MCP](/en/mcp)), your assistant can answer questions about ACTA grounded in the official docs. These are ready-to-use recipes, grouped by task.

## How to use these recipes

Paste the prompt into your assistant and adapt it to your case. When the MCP is active, the model will call \`search_acta_docs\` or \`read_acta_doc\` to answer from real sources instead of generic knowledge.

## Understand ACTA

> Explain in 5 lines what ACTA is and how a credential differs from a vault. Use the official documentation.

> What is ACTA's architecture? Summarize the main components and how they relate.

## Integrate the SDK

> Show me the minimal code to issue a credential with the ACTA SDK. Include imports and explain each step.

> What is the difference between \`useVault\` and \`useVaultRead\`? Give me an example of each.

> Generate a React component that verifies a credential using the ACTA SDK.

## Work with the API

> List the ACTA API endpoints for vault operations and explain which are read and which are write.

> How do I obtain and use an ACTA API key? Show me an authenticated request example with \`curl\`.

> Explain the sponsored vault flow and when I should use it.

## Debug errors

> I am getting this ACTA contract error: <paste the code or message>. What does it mean and how do I fix it according to the docs?

> My API request returned <paste the response>. Explain the error and the next step.

## DID and identity

> What is \`did:stellar\` in ACTA and how is a DID registered and resolved? Summarize from the official docs.

> Show me how to use ACTA's DID TypeScript library to resolve a DID.

## Tips for better answers

- Explicitly ask it to use the official docs ("according to the ACTA documentation").
- Give context about your stack (framework, language) to get applicable snippets.
- When debugging, paste the exact error or code so the model can cross-reference the errors page.
- If an answer looks generic, ask it to cite the documentation page it used.
  `,
};
