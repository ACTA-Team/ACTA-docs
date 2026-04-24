import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const transport = new StdioClientTransport({
  command: "node",
  args: ["dist/server.js"],
  cwd: packageDir,
});

const client = new Client({
  name: "acta-docs-mcp-smoke-test",
  version: "0.1.0",
});

await client.connect(transport);

const tools = await client.listTools();
const toolNames = tools.tools.map(tool => tool.name);
for (const expected of [
  "list_acta_docs",
  "read_acta_doc",
  "search_acta_docs",
]) {
  if (!toolNames.includes(expected)) {
    throw new Error(`Missing MCP tool: ${expected}`);
  }
}

const resources = await client.listResources();
if (resources.resources.length === 0) {
  throw new Error("Expected MCP resources to be listed.");
}

const search = await client.callTool({
  name: "search_acta_docs",
  arguments: { query: "credential issuance", locale: "en", limit: 2 },
});
const searchText = search.content?.[0]?.text ?? "";
if (!searchText.includes("api-credentials")) {
  throw new Error("Expected search results to include api-credentials.");
}

const read = await client.callTool({
  name: "read_acta_doc",
  arguments: { slug: "sdk-overview", locale: "en" },
});
const readText = read.content?.[0]?.text ?? "";
if (!readText.includes("React SDK Overview")) {
  throw new Error("Expected read_acta_doc to return sdk-overview content.");
}

await client.close();

console.log(
  JSON.stringify(
    {
      tools: toolNames,
      resources: resources.resources.length,
      search: "ok",
      read: "ok",
    },
    null,
    2
  )
);
