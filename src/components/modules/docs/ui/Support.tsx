"use client";

import React, { useState, type ComponentType } from "react";
import {
  Send,
  CheckCircle,
  Loader2,
  ArrowUpRight,
  ChevronRight,
  BookOpen,
  Bug,
  Lightbulb,
} from "lucide-react";
import { DiscordIcon } from "@/components/ui/discord-icon";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

  const handleSubmit = async (e: React.FormEvent) => {
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
        const message =
          (data && (data.error || data.details)) || t.supportSendFailed;
        throw new Error(
          typeof message === "string" ? message : t.supportSendFailed
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
      href: "https://discord.gg/DsUSE3aMDZ",
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

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-8 md:px-10 md:py-10 xl:max-w-5xl">
      <div className="max-w-xl space-y-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
          {t.supportTitle}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {t.support}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t.supportDescription}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(100%,17.5rem)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_min(100%,19rem)]">
        <section
          className="rounded-xl border border-border/60 bg-card/80 p-6 shadow-none backdrop-blur-sm md:p-8"
          aria-labelledby="support-form-heading"
        >
          <h2
            id="support-form-heading"
            className="sr-only"
          >
            {t.contactUs}
          </h2>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-muted/20"
                aria-hidden
              >
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {t.messageSent}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="support-name"
                  className="text-xs font-medium text-foreground"
                >
                  {t.yourName}
                </label>
                <Input
                  id="support-name"
                  type="text"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  required
                  autoComplete="name"
                  placeholder={t.supportPlaceholderName}
                  className="border-border/60 bg-background shadow-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="support-email"
                  className="text-xs font-medium text-foreground"
                >
                  {t.yourEmail}
                </label>
                <Input
                  id="support-email"
                  type="email"
                  value={formData.email}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                  required
                  autoComplete="email"
                  placeholder={t.supportPlaceholderEmail}
                  className="border-border/60 bg-background shadow-none"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="support-message"
                  className="text-xs font-medium text-foreground"
                >
                  {t.yourMessage}
                </label>
                <Textarea
                  id="support-message"
                  value={formData.message}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, message: e.target.value }))
                  }
                  required
                  placeholder={t.supportPlaceholderMessage}
                  className="min-h-[140px] resize-none border-border/60 bg-background shadow-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full shadow-none sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.supportSending}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t.sendMessage}
                  </>
                )}
              </Button>
            </form>
          )}
        </section>

        <aside className="space-y-8 lg:pt-1">
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
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={
                          link.external ? "noopener noreferrer" : undefined
                        }
                        className={rowClass}
                      >
                        {inner}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/10 p-4 text-sm leading-relaxed">
            <p className="font-medium text-foreground">
              {t.supportImmediateHelpTitle}
            </p>
            <p className="mt-2 text-muted-foreground">
              {t.supportImmediateHelpBody}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
