import type { DocPage } from "@/@types/docs";
import { aiOverview } from "./ai-overview";
import { mcp } from "./mcp";
import { mcpClients } from "./mcp-clients";
import { aiPrompts } from "./ai-prompts";
import { agentIdentity } from "./agent-identity";

export const pages: Record<string, DocPage> = {
  "ai-overview": aiOverview,
  mcp,
  "mcp-clients": mcpClients,
  "ai-prompts": aiPrompts,
  "agent-identity": agentIdentity,
};
