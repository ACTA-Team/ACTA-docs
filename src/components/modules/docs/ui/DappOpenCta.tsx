"use client";

import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const DAPP_URL = "https://dapp.acta.build/";

export function DappOpenCta() {
  const { t } = useI18n();

  return (
    <div className="my-8">
      <a
        href={DAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[15px] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        {t.dappOpenCtaButton}
        <ExternalLink className="size-4 shrink-0 opacity-90" aria-hidden />
      </a>
    </div>
  );
}
