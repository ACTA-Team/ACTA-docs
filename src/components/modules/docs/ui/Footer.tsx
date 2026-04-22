"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import { DiscordIcon } from "@/components/ui/discord-icon";
import { useI18n } from "@/lib/i18n";

/** Official ACTA org — https://github.com/ACTA-Team */
const GITHUB_ORG_URL = "https://github.com/ACTA-Team";
/** Community — https://discord.gg/DsUSE3aMDZ */
const DISCORD_INVITE_URL = "https://discord.gg/DsUSE3aMDZ";

type FooterNavItem =
  | { kind: "internal"; slug: string; label: string }
  | { kind: "external"; href: string; label: string };

interface FooterProps {
  onNavigate?: (slug: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t } = useI18n();

  const navItems: FooterNavItem[] = [
    { kind: "internal", slug: "introduction", label: t.introduction },
    { kind: "internal", slug: "getting-started", label: t.gettingStarted },
    { kind: "internal", slug: "sdk-overview", label: t.reactSdk },
    { kind: "internal", slug: "api-overview", label: t.apiReference },
    { kind: "internal", slug: "faq", label: t.faq },
    { kind: "internal", slug: "support", label: t.support },
    {
      kind: "external",
      href: "https://acta.build",
      label: t.website,
    },
    { kind: "external", href: GITHUB_ORG_URL, label: t.footerGithub },
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

  return (
    <footer className="shrink-0 border-t border-border/50 bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="mx-auto max-w-5xl *:px-0">
        <div className="flex flex-col gap-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {onNavigate ? (
                <button
                  type="button"
                  onClick={() => onNavigate("introduction")}
                  className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`ACTA — ${t.introduction}`}
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
                  <span className="text-sm font-semibold tracking-tight text-foreground">
                    ACTA
                  </span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-0.5 sm:justify-end">
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

          <nav aria-label={t.documentation}>
            <ul className="flex flex-wrap gap-4 font-medium text-muted-foreground text-sm md:gap-6">
              {navItems.map(item => (
                <li key={item.kind === "internal" ? item.slug : item.href}>
                  {item.kind === "internal" && onNavigate ? (
                    <button
                      type="button"
                      className="hover:text-foreground"
                      onClick={() => onNavigate(item.slug)}
                    >
                      {item.label}
                    </button>
                  ) : item.kind === "internal" ? (
                    <span className="text-muted-foreground">{item.label}</span>
                  ) : (
                    <a
                      className="hover:text-foreground"
                      href={item.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/50 py-4 text-muted-foreground text-sm sm:flex-row sm:items-center sm:justify-between">
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
