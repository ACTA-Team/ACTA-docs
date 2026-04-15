import type { DocPage } from "@/@types/docs";
import { overview } from "./overview";
import { circuits } from "./circuits";
import { generation } from "./generation";
import { verification } from "./verification";

export const pages: Record<string, DocPage> = {
  "zk-overview": overview,
  "zk-circuits": circuits,
  "zk-generation": generation,
  "zk-verification": verification,
};
