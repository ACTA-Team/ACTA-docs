"use client";

import { AppShell } from "@/layouts/app-shell/AppShell";
import { I18nProvider } from "@/lib/i18n";

export default function DocsPage() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}
