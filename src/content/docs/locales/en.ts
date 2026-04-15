import type { DocPage } from "@/@types/docs";
import { pages as welcomePages } from "../modules/welcome/en";
import { pages as sdkPages } from "../modules/sdk/en";
import { pages as apiReferencePages } from "../modules/api-reference/en";
import { pages as dappPages } from "../modules/dapp/en";
import { pages as zkProofsPages } from "../modules/zk-proofs/en";
import { pages as scfPages } from "../modules/scf/en";

export const docsData: Record<string, DocPage> = {
  ...welcomePages,
  ...sdkPages,
  ...apiReferencePages,
  ...dappPages,
  ...zkProofsPages,
  ...scfPages,
};
