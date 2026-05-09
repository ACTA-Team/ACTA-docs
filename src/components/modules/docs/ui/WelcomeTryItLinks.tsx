"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const DAPP_URL = "https://dapp.acta.build/";
const GITHUB_URL = "https://github.com/ACTA-Team";
const DISCORD_URL = "https://discord.gg/DsUSE3aMDZ";

const primaryBtn =
  "inline-flex w-full max-w-md items-center justify-between gap-3 rounded-full bg-primary px-7 py-3.5 text-[15px] font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:w-auto";

const secondaryBtn =
  "inline-flex w-full max-w-md items-center justify-between gap-3 rounded-full border border-border/80 bg-background px-7 py-3.5 text-[15px] font-medium text-foreground shadow-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:w-auto";

function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <span className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center sm:items-start sm:text-left">
        {children}
      </span>
      <ExternalLink className="size-4 shrink-0 opacity-80" aria-hidden />
    </a>
  );
}

export function WelcomeTryItLinks() {
  const { t } = useI18n();

  return (
    <div className="my-8 flex max-w-md flex-col gap-3">
      <CtaLink href={DAPP_URL} className={primaryBtn}>
        <span className="leading-tight">{t.welcomeTryItDapp}</span>
        <span className="text-[13px] font-normal opacity-90">
          {t.welcomeTryItDappHint}
        </span>
      </CtaLink>
      <CtaLink href={GITHUB_URL} className={secondaryBtn}>
        <span className="leading-tight">{t.welcomeTryItGithub}</span>
        <span className="text-[13px] font-normal text-muted-foreground">
          {t.welcomeTryItGithubHint}
        </span>
      </CtaLink>
      <CtaLink href={DISCORD_URL} className={secondaryBtn}>
        <span className="leading-tight">{t.welcomeTryItDiscord}</span>
        <span className="text-[13px] font-normal text-muted-foreground">
          {t.welcomeTryItDiscordHint}
        </span>
      </CtaLink>
    </div>
  );
}
