import type { DocPage } from "@/@types/docs";
import { introduction } from "./introduction";
import { architecture } from "./architecture";
import { gettingStarted } from "./getting-started";
import { security } from "./security";
import { versions } from "./versions";
import { glossary } from "./glossary";

export const pages: Record<string, DocPage> = {
  introduction,
  architecture,
  "getting-started": gettingStarted,
  security,
  versions,
  glossary,
};
