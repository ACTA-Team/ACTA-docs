import type { DocPage } from "@/@types/docs";
import { pages as welcomePages } from "../modules/welcome/fr";
import { pages as guidesPages } from "../modules/guides/fr";
import { pages as sdkPages } from "../modules/sdk/fr";
import { pages as apiReferencePages } from "../modules/api-reference/fr";
import { pages as contractsPages } from "../modules/contracts/fr";
import { pages as didPages } from "../modules/did/fr";
import { pages as mcpPages } from "../modules/mcp/fr";
import { pages as dappPages } from "../modules/dapp/fr";

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
