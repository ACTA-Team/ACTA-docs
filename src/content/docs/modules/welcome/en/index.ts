import type { DocPage } from "@/@types/docs";
import { introduction } from "./introduction";
import { architecture } from "./architecture";
import { gettingStarted } from "./getting-started";

export const pages: Record<string, DocPage> = {
  introduction,
  architecture,
  "getting-started": gettingStarted,
};
