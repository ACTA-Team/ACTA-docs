import type { DocPage } from "@/@types/docs";
import { quickstart } from "./quickstart";
import { mainnetGuide } from "./mainnet-guide";
import { verifyCredentials } from "./verify-credentials";

export const pages: Record<string, DocPage> = {
  quickstart,
  "mainnet-guide": mainnetGuide,
  "verify-credentials": verifyCredentials,
};
