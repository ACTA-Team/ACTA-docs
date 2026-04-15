import type { DocPage } from "@/@types/docs";
import { pages as welcomePages } from "../modules/welcome/es";
import { pages as sdkPages } from "../modules/sdk/es";
import { pages as apiReferencePages } from "../modules/api-reference/es";
import { pages as dappPages } from "../modules/dapp/es";
import { pages as zkProofsPages } from "../modules/zk-proofs/es";
import { pages as scfPages } from "../modules/scf/es";

export const docsData: Record<string, DocPage> = {
  ...welcomePages,
  ...sdkPages,
  ...apiReferencePages,
  ...dappPages,
  ...zkProofsPages,
  ...scfPages,
};
