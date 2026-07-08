import type { DocPage } from "@/@types/docs";
import { overview } from "./overview";
import { registry } from "./registry";
import { library } from "./library";

export const pages: Record<string, DocPage> = {
  "did-overview": overview,
  "did-registry": registry,
  "did-library": library,
};
