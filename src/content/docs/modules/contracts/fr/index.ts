import type { DocPage } from "@/@types/docs";
import { contractsReference } from "./contracts-reference";
import { contractErrors } from "./contract-errors";

export const pages: Record<string, DocPage> = {
  "contracts-reference": contractsReference,
  "contract-errors": contractErrors,
};
