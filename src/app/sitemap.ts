import type { MetadataRoute } from "next";
import { docsByLocale } from "@/content/docs";

const BASE_URL = "https://docs.acta.build";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = [...Object.keys(docsByLocale.en), "faq", "support"];

  return slugs.map(slug => ({
    url: `${BASE_URL}/${slug}`,
    changeFrequency: "weekly",
    priority: slug === "introduction" ? 1 : 0.7,
    alternates: {
      languages: {
        en: `${BASE_URL}/${slug}`,
        es: `${BASE_URL}/es/${slug}`,
        fr: `${BASE_URL}/fr/${slug}`,
      },
    },
  }));
}
