import type { DocPage } from "@/@types/docs";
import { contractErrors } from "./contract-errors";

export const pages: Record<string, DocPage> = {
  "contract-errors": contractErrors,
};
