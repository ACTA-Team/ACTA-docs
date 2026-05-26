import type { DocPage } from "@/@types/docs";
import { didStellarOverview } from "./overview";
import { didStellarSdk } from "./sdk";
import { didStellarApi } from "./api";
import { didStellarProofOfControl } from "./proof-of-control";

export const pages: Record<string, DocPage> = {
  "did-stellar-overview": didStellarOverview,
  "did-stellar-sdk": didStellarSdk,
  "did-stellar-api": didStellarApi,
  "did-stellar-proof-of-control": didStellarProofOfControl,
};
