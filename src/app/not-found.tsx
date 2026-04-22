import { I18nProvider } from "@/lib/i18n";
import { NotFoundContent } from "@/components/modules/not-found";

export default function NotFound() {
  return (
    <I18nProvider>
      <NotFoundContent />
    </I18nProvider>
  );
}
