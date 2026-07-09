import type { DocPage } from "@/@types/docs";
import { pages as welcomePages } from "../modules/welcome/es";
import { pages as guidesPages } from "../modules/guides/es";
import { pages as sdkPages } from "../modules/sdk/es";
import { pages as apiReferencePages } from "../modules/api-reference/es";
import { pages as contractsPages } from "../modules/contracts/es";
import { pages as didPages } from "../modules/did/es";
import { pages as mcpPages } from "../modules/mcp/es";
import { pages as dappPages } from "../modules/dapp/es";

export const docsData: Record<string, DocPage> = {
  ...welcomePages,
  ...guidesPages,
  ...sdkPages,
  ...apiReferencePages,
  ...contractsPages,
  ...didPages,
  ...mcpPages,
  ...dappPages,
};
