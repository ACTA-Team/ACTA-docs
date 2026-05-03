import type { DocPage } from "@/@types/docs";
import { overview } from "./overview";
import { useCredential } from "./use-credential";
import { useVault } from "./use-vault";
import { useVaultRead } from "./use-vault-read";
import { actaClientSponsoredVault } from "./acta-client-sponsored-vault";

export const pages: Record<string, DocPage> = {
  "sdk-overview": overview,
  useCredential,
  useVault,
  useVaultRead,
  actaClientSponsoredVault,
};
