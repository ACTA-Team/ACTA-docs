import type { DocPage } from "@/@types/docs";
import { pages as welcomePages } from "../modules/welcome/en";
import { pages as sdkPages } from "../modules/sdk/en";
import { pages as apiReferencePages } from "../modules/api-reference/en";
import { pages as mcpPages } from "../modules/mcp/en";
import { pages as dappPages } from "../modules/dapp/en";

export const docsData: Record<string, DocPage> = {
  ...welcomePages,
  ...sdkPages,
  ...apiReferencePages,
  ...mcpPages,
  ...dappPages,
};
