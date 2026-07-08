import type { DocPage } from "@/@types/docs";
import { introduction } from "./introduction";
import { architecture } from "./architecture";
import { gettingStarted } from "./getting-started";
import { quickstart } from "./quickstart";
import { security } from "./security";

export const pages: Record<string, DocPage> = {
  introduction,
  architecture,
  "getting-started": gettingStarted,
  quickstart,
  security,
};
