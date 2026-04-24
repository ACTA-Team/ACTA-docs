import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { DocsByLocale } from "../src/types";

type DocsModule = {
  docsByLocale?: DocsByLocale;
  default?: {
    docsByLocale?: DocsByLocale;
  };
};

const docsModule =
  (await import("../../../src/content/docs/index")) as DocsModule;
const docsByLocale =
  docsModule.docsByLocale ?? docsModule.default?.docsByLocale;

if (!docsByLocale) {
  throw new Error("Unable to load docsByLocale from src/content/docs.");
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../src/generated/docs-data.json");

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(docsByLocale, null, 2)}\n`);

const locales = Object.keys(docsByLocale);
const pageCount = Object.values(docsByLocale).reduce(
  (total, pages) => total + Object.keys(pages).length,
  0
);

console.log(
  `Generated ${pageCount} ACTA docs pages for locales: ${locales.join(", ")}`
);
