"use client";

import type { FormEvent, ReactNode } from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ContactInfoRow =
  | {
      kind: "link";
      icon: ReactNode;
      label: string;
      value: string;
      href: string;
      external?: boolean;
    }
  | {
      kind: "nav";
      icon: ReactNode;
      label: string;
      value: string;
      slug: string;
    }
  | {
      kind: "static";
      icon: ReactNode;
      label: string;
      value: string;
    };

export interface ContactSectionProps {
  className?: string;
  eyebrow?: string;
  heading: string;
  description: string;
  responseHint: string;
  infoRows: ContactInfoRow[];
  onInfoNavigate?: (slug: string) => void;
  name: string;
  email: string;
  message: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  labels: {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
  };
  placeholders: {
    name: string;
    email: string;
    message: string;
  };
  isSubmitting: boolean;
  isSubmitted: boolean;
  messageSentLabel: string;
  contactFormSrLabel: string;
}

export function ContactSection({
  className,
  eyebrow,
  heading,
  description,
  responseHint,
  infoRows,
  onInfoNavigate,
  name,
  email,
  message,
  onNameChange,
  onEmailChange,
  onMessageChange,
  onSubmit,
  labels,
  placeholders,
  isSubmitting,
  isSubmitted,
  messageSentLabel,
  contactFormSrLabel,
}: ContactSectionProps) {
  return (
    <div
      className={cn(
        "relative mx-auto grid h-full w-full max-w-4xl rounded-2xl border border-border/60 bg-card/30 shadow-none backdrop-blur-sm md:grid-cols-[1fr_0.7fr]",
        className
      )}
    >
      <div className="col-span-1 flex flex-col space-y-4 p-8 lg:p-10">
        {eyebrow ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-medium text-2xl tracking-tight text-foreground md:text-3xl">
          {heading}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
        <p className="max-w-md text-xs leading-relaxed text-muted-foreground md:text-sm">
          {responseHint}
        </p>
        <div className="grid gap-1">
          {infoRows.map((row, index) => (
            <ContactInfoRowView
              key={`${row.kind}-${row.label}-${index}`}
              row={row}
              onNavigate={onInfoNavigate}
            />
          ))}
        </div>
      </div>
      <div className="col-span-1 flex items-center border-t border-border/60 p-8 md:border-t-0 md:border-l md:border-border/60">
        <div className="w-full">
          <h2 className="sr-only">{contactFormSrLabel}</h2>
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border/60 bg-muted/20"
                aria-hidden
              >
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {messageSentLabel}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="w-full">
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="contact-name">{labels.name}</FieldLabel>
                  <Input
                    autoComplete="name"
                    id="contact-name"
                    name="name"
                    placeholder={placeholders.name}
                    type="text"
                    value={name}
                    onChange={e => onNameChange(e.target.value)}
                    required
                    className="border-border/60 bg-background shadow-none"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contact-email">
                    {labels.email}
                  </FieldLabel>
                  <Input
                    autoComplete="email"
                    id="contact-email"
                    name="email"
                    placeholder={placeholders.email}
                    type="email"
                    value={email}
                    onChange={e => onEmailChange(e.target.value)}
                    required
                    className="border-border/60 bg-background shadow-none"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="contact-message">
                    {labels.message}
                  </FieldLabel>
                  <Textarea
                    autoComplete="off"
                    id="contact-message"
                    name="message"
                    placeholder={placeholders.message}
                    value={message}
                    onChange={e => onMessageChange(e.target.value)}
                    required
                    className="min-h-[140px] resize-none border-border/60 bg-background shadow-none"
                  />
                </Field>
              </FieldGroup>
              <Button
                className="mt-8 w-full shadow-none"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {labels.sending}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {labels.send}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactInfoRowView({
  row,
  onNavigate,
}: {
  row: ContactInfoRow;
  onNavigate?: (slug: string) => void;
}) {
  const inner = (
    <>
      <div className="rounded-lg border border-border/60 bg-card p-3 shadow-xs [&_svg]:size-5">
        {row.icon}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-foreground">{row.label}</p>
        <p className="text-muted-foreground text-xs">{row.value}</p>
      </div>
    </>
  );

  const interactiveClass = cn(
    "flex items-center gap-3 rounded-lg py-3 text-left transition-colors",
    "hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  );

  if (row.kind === "link") {
    return (
      <a
        className={cn(interactiveClass, "-mx-2 px-2")}
        href={row.href}
        rel={row.external ? "noopener noreferrer" : undefined}
        target={row.external ? "_blank" : undefined}
      >
        {inner}
      </a>
    );
  }

  if (row.kind === "nav" && onNavigate) {
    return (
      <button
        type="button"
        className={cn(interactiveClass, "w-full -mx-2 px-2")}
        onClick={() => onNavigate(row.slug)}
      >
        {inner}
      </button>
    );
  }

  if (row.kind === "nav" && !onNavigate) {
    return <div className={cn(interactiveClass, "px-0")}>{inner}</div>;
  }

  return <div className="flex items-center gap-3 py-3">{inner}</div>;
}
