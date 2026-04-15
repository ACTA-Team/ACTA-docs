import type { DocPage } from "@/@types/docs";
import { overview } from "./overview";
import { healthStatus } from "./health-status";
import { keys } from "./keys";
import { contractInfo } from "./contract-info";
import { vaultRead } from "./vault-read";
import { vaultWrite } from "./vault-write";
import { credentials } from "./credentials";

export const pages: Record<string, DocPage> = {
  "api-overview": overview,
  "api-health-status": healthStatus,
  "api-keys": keys,
  "api-contract-info": contractInfo,
  "api-vault-read": vaultRead,
  "api-vault-write": vaultWrite,
  "api-credentials": credentials,
};
