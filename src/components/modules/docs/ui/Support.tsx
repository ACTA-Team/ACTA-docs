"use client";

import React, { useState } from "react";
import {
  Headphones,
  Send,
  BookOpen,
  MessageCircle,
  Bug,
  Lightbulb,
  ExternalLink,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { DiscordIcon } from "@/components/ui/discord-icon";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function Support() {
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

    // Client-side validation mirroring API (Zod) rules
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
          (data && (data.error || data.details)) ||
          "Failed to submit contact form";
        throw new Error(message);
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });

      toast({
        title: t.messageSent,
      });

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Contact form submit error:", error);
      setIsSubmitting(false);

      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "We couldn't send your message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const quickLinks = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: t.documentation,
      description: "Browse the complete ACTA documentation",
      href: "#",
      internal: true,
    },
    {
      icon: <DiscordIcon className="w-5 h-5" />,
      title: t.community,
      description: "Join our Discord community",
      href: "https://discord.gg/DsUSE3aMDZ",
      internal: false,
    },
    {
      icon: <Bug className="w-5 h-5" />,
      title: t.reportIssue,
      description: "Report bugs on GitHub",
      href: "https://github.com/ACTA-Team/issues",
      internal: false,
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: t.featureRequest,
      description: "Suggest new features",
      href: "https://github.com/ACTA-Team/discussions",
      internal: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Headphones className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t.support}</h1>
        </div>
        <p className="text-muted-foreground">{t.supportDescription}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            {t.contactUs}
          </h2>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-lg font-medium text-foreground">
                {t.messageSent}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t.yourName}
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="bg-background"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t.yourEmail}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="bg-background"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t.yourMessage}
                </label>
                <Textarea
                  value={formData.message}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, message: e.target.value }))
                  }
                  required
                  className="bg-background min-h-[120px] resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t.sendMessage}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t.quickLinks}
          </h2>
          <div className="space-y-3">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target={link.internal ? undefined : "_blank"}
                rel={link.internal ? undefined : "noopener noreferrer"}
                className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 hover:border-primary/50 transition-all group"
              >
                <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {link.title}
                    </span>
                    {!link.internal && (
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {link.description}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Need immediate help?</strong>{" "}
              Join our Discord community for real-time support from the team and
              other developers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
