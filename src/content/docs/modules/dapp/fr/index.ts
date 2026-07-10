import type { DocPage } from "@/@types/docs";
import { overview } from "./overview";
import { gettingStarted } from "./getting-started";
import { features } from "./features";

export const pages: Record<string, DocPage> = {
  "dapp-overview": overview,
  "dapp-getting-started": gettingStarted,
  "dapp-features": features,
};
