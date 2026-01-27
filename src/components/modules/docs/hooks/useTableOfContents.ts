import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { FeedbackType } from "@/@types/docs";

export function useTableOfContents() {
  const { t } = useI18n();
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  return {
    feedback,
    setFeedback,
    t,
  };
}
