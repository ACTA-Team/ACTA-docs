"use client";

import Image from "next/image";
import Link from "next/link";
import { CompassIcon, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useI18n } from "@/lib/i18n";

const ACTA_WEBSITE = "https://acta.build";

export function NotFoundContent() {
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/50 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Image
            src="/acta-logo.png"
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-md"
          />
          <span className="text-sm font-semibold tracking-tight text-foreground">
            ACTA
          </span>
        </Link>
        <AnimatedThemeToggler className="h-8 w-8 rounded-lg border-0 bg-transparent hover:bg-muted/40" />
      </header>

      <div className="relative flex flex-1 items-center justify-center p-6">
        <Empty className="max-w-lg border-none bg-transparent md:p-12">
          <EmptyHeader>
            <EmptyTitle className="mask-b-from-20% mask-b-to-80% font-extrabold text-9xl text-foreground">
              404
            </EmptyTitle>
            <EmptyDescription className="-mt-8 text-nowrap text-foreground/80">
              {t.notFoundDescription}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button asChild>
                <Link href="/">
                  <HomeIcon data-icon="inline-start" />
                  {t.notFoundGoDocs}
                </Link>
              </Button>

              <Button asChild variant="outline">
                <a
                  href={ACTA_WEBSITE}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <CompassIcon data-icon="inline-start" />
                  {t.notFoundVisitWebsite}
                </a>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
