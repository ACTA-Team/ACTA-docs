import type { DocPage } from "@/@types/docs";
import { aiOverview } from "./ai-overview";
import { agentSkills } from "./agent-skills";
import { mcp } from "./mcp";
import { aiPrompts } from "./ai-prompts";
import { agentIdentity } from "./agent-identity";

export const pages: Record<string, DocPage> = {
  "ai-overview": aiOverview,
  "agent-skills": agentSkills,
  mcp,
  "ai-prompts": aiPrompts,
  "agent-identity": agentIdentity,
};
