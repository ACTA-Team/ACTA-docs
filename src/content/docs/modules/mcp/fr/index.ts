import type { DocPage } from "@/@types/docs";
import { agentSkills } from "./agent-skills";
import { mcp } from "./mcp";

export const pages: Record<string, DocPage> = {
  "agent-skills": agentSkills,
  mcp,
};
