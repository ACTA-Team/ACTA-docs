"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { DiscordIcon } from "@/components/ui/discord-icon";
import { useI18n } from "@/lib/i18n";

/** Official ACTA org - https://github.com/ACTA-Team */
const GITHUB_ORG_URL = "https://github.com/ACTA-Team";
/** Community - https://discord.gg/DsUSE3aMDZ */
const DISCORD_INVITE_URL = "https://discord.gg/DsUSE3aMDZ";

type FooterNavItem =
  | { kind: "internal"; slug: string; label: string }
  | { kind: "external"; href: string; label: string };

interface FooterProps {
  onNavigate?: (slug: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useI18n();

  const columns: Array<{ heading: string; items: FooterNavItem[] }> = [
    {
      heading: t.documentation,
      items: [
        { kind: "internal", slug: "introduction", label: t.introduction },
        { kind: "internal", slug: "getting-started", label: t.gettingStarted },
        { kind: "internal", slug: "sdk-overview", label: t.reactSdk },
        { kind: "internal", slug: "api-overview", label: t.apiReference },
      ],
    },
    {
      heading: t.supportTitle,
      items: [
        { kind: "internal", slug: "faq", label: t.faq },
        { kind: "internal", slug: "support", label: t.support },
      ],
    },
    {
      heading: t.community,
      items: [
        { kind: "external", href: "https://acta.build", label: t.website },
        { kind: "external", href: GITHUB_ORG_URL, label: t.footerGithub },
        { kind: "external", href: DISCORD_INVITE_URL, label: t.discord },
      ],
    },
  ];

  const socialLinks = [
    {
      href: DISCORD_INVITE_URL,
      label: t.discord,
      icon: <DiscordIcon className="size-4" />,
    },
    {
      href: GITHUB_ORG_URL,
      label: t.footerGithub,
      icon: <GithubIcon className="size-4" />,
    },
  ] as const;

  const renderItem = (item: FooterNavItem) => {
    if (item.kind === "internal" && onNavigate) {
      return (
        <button
          type="button"
          className="transition-colors hover:text-foreground"
          onClick={() => onNavigate(item.slug)}
        >
          {item.label}
        </button>
      );
    }
    if (item.kind === "internal") {
      return <span>{item.label}</span>;
    }
    return (
      <a
        className="transition-colors hover:text-foreground"
        href={item.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {item.label}
      </a>
    );
  };

  return (
    <footer className="shrink-0 border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-10 lg:px-14">
        <div className="grid gap-10 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start gap-4">
            {onNavigate ? (
              <button
                type="button"
                onClick={() => onNavigate("introduction")}
                className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`ACTA - ${t.introduction}`}
              >
                <Image
                  src="/acta-logo.png"
                  alt=""
                  width={28}
                  height={28}
                  className="size-7 shrink-0 rounded-md"
                />
                <span className="text-sm font-semibold tracking-wide text-foreground">
                  ACTA
                </span>
              </button>
            ) : (
              <span className="flex items-center gap-2">
                <Image
                  src="/acta-logo.png"
                  alt="ACTA"
                  width={28}
                  height={28}
                  className="size-7 shrink-0 rounded-md"
                />
                <span className="text-sm font-semibold tracking-wide text-foreground">
                  ACTA
                </span>
              </span>
            )}
            <div className="flex items-center gap-0.5">
              {socialLinks.map(({ href, label, icon }) => (
                <Button asChild key={href} size="icon-sm" variant="ghost">
                  <a
                    aria-label={label}
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {icon}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map(column => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {column.heading}
              </p>
              <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                {column.items.map(item => (
                  <li key={item.kind === "internal" ? item.slug : item.href}>
                    {renderItem(item)}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border/50 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {t.poweredBy}
          </p>

          <p>
            <a
              className="text-foreground/80 hover:text-foreground hover:underline"
              href={GITHUB_ORG_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              {t.footerSourceCommunity}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
