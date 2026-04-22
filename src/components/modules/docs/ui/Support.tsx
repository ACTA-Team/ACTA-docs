"use client";

import React, { useState, type ComponentType } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Bug,
  ChevronRight,
  Lightbulb,
  Mail,
} from "lucide-react";
import { DiscordIcon } from "@/components/ui/discord-icon";
import {
  ContactSection,
  type ContactInfoRow,
} from "@/components/modules/support/contact-section";
import { useI18n } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const DISCORD_INVITE = "https://discord.gg/DsUSE3aMDZ";
const ACTA_PUBLIC_EMAIL = "acta.xyz@gmail.com";

interface SupportProps {
  onNavigate?: (slug: string) => void;
}

export function Support({ onNavigate }: SupportProps) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors: string[] = [];
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name) {
      errors.push(t.validationNameRequired);
    } else if (name.length > 200) {
      errors.push(t.validationNameTooLong);
    }

    if (!email) {
      errors.push(t.validationEmailRequired);
    } else if (email.length > 320) {
      errors.push(t.validationEmailInvalid);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push(t.validationEmailInvalid);
    }

    if (!message) {
      errors.push(t.validationMessageRequired);
    } else if (message.length > 4000) {
      errors.push(t.validationMessageTooLong);
    }

    if (errors.length > 0) {
      errors.forEach(errorMessage => {
        toast({
          title: t.validationErrorTitle,
          description: errorMessage,
          variant: "destructive",
        });
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const messageText =
          (data && (data.error || data.details)) || t.supportSendFailed;
        throw new Error(
          typeof messageText === "string" ? messageText : t.supportSendFailed
        );
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });

      toast({
        title: t.messageSent,
      });

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Contact form submit error:", error);
      setIsSubmitting(false);

      toast({
        title: t.supportErrorTitle,
        description:
          error instanceof Error ? error.message : t.supportSendFailed,
        variant: "destructive",
      });
    }
  };

  type QuickItem = {
    icon: ComponentType<{ className?: string }>;
    title: string;
    description: string;
    external?: boolean;
    href?: string;
    slug?: string;
  };

  const quickLinks: QuickItem[] = [
    {
      icon: BookOpen,
      title: t.documentation,
      description: t.supportDocLinkDescription,
      slug: "introduction",
    },
    {
      icon: DiscordIcon,
      title: t.community,
      description: t.supportCommunityLinkDescription,
      href: DISCORD_INVITE,
      external: true,
    },
    {
      icon: Bug,
      title: t.reportIssue,
      description: t.supportIssueLinkDescription,
      href: "https://github.com/ACTA-Team/issues",
      external: true,
    },
    {
      icon: Lightbulb,
      title: t.featureRequest,
      description: t.supportFeatureLinkDescription,
      href: "https://github.com/ACTA-Team/discussions",
      external: true,
    },
  ];

  const contactInfoRows: ContactInfoRow[] = [
    {
      kind: "link",
      icon: <DiscordIcon className="text-muted-foreground" />,
      label: t.discord,
      value: "discord.gg/DsUSE3aMDZ",
      href: DISCORD_INVITE,
      external: true,
    },
    {
      kind: "link",
      icon: <Mail className="text-muted-foreground" />,
      label: t.supportEmailLabel,
      value: ACTA_PUBLIC_EMAIL,
      href: `mailto:${ACTA_PUBLIC_EMAIL}`,
    },
    ...(onNavigate
      ? ([
          {
            kind: "nav" as const,
            icon: <BookOpen className="text-muted-foreground" />,
            label: t.documentation,
            value: t.supportDocLinkDescription,
            slug: "introduction",
          },
        ] satisfies ContactInfoRow[])
      : []),
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-8 md:px-10 md:py-10 xl:max-w-5xl">
      <ContactSection
        contactFormSrLabel={t.contactUs}
        description={t.supportDescription}
        email={formData.email}
        eyebrow={t.supportTitle}
        heading={t.support}
        infoRows={contactInfoRows}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        labels={{
          name: t.yourName,
          email: t.yourEmail,
          message: t.yourMessage,
          send: t.sendMessage,
          sending: t.supportSending,
        }}
        message={formData.message}
        messageSentLabel={t.messageSent}
        name={formData.name}
        onEmailChange={value =>
          setFormData(prev => ({ ...prev, email: value }))
        }
        onInfoNavigate={onNavigate}
        onMessageChange={value =>
          setFormData(prev => ({ ...prev, message: value }))
        }
        onNameChange={value => setFormData(prev => ({ ...prev, name: value }))}
        onSubmit={handleSubmit}
        placeholders={{
          name: t.supportPlaceholderName,
          email: t.supportPlaceholderEmail,
          message: t.supportPlaceholderMessage,
        }}
        responseHint={t.supportResponseHint}
      />

      <div className="space-y-10">
        <div className="rounded-xl border border-border/60 bg-muted/10 p-4 text-sm leading-relaxed">
          <p className="font-medium text-foreground">
            {t.supportImmediateHelpTitle}
          </p>
          <p className="mt-2 text-muted-foreground">
            {t.supportImmediateHelpBody}
          </p>
        </div>

        <aside className="space-y-8">
          <div>
            <h3 className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
              {t.quickLinks}
            </h3>
            <ul
              className="mt-4 divide-y divide-border/50 overflow-hidden rounded-xl border border-border/60 bg-card/50"
              role="list"
            >
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                const rowClass = cn(
                  "flex w-full items-start gap-3 px-4 py-3.5 text-left text-sm transition-colors",
                  "hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                );

                const inner = (
                  <>
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/80 text-muted-foreground"
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 font-medium text-foreground">
                        {link.title}
                        {link.external ? (
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                        {link.description}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={index}>
                    {link.slug && onNavigate ? (
                      <button
                        type="button"
                        className={rowClass}
                        onClick={() => onNavigate(link.slug!)}
                      >
                        {inner}
                      </button>
                    ) : (
                      <a
                        className={rowClass}
                        href={link.href}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        target={link.external ? "_blank" : undefined}
                      >
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
