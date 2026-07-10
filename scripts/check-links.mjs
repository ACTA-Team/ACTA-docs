// Docs content sanity checks, run in CI:
// 1. every `doc:` link points at an existing page slug
// 2. no `](#...)` pseudo-anchor links (use doc: for page navigation)
// 3. no em dashes in content (project style rule)
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const MODULES_DIR = new URL("../src/content/docs/modules", import.meta.url)
  .pathname;
// Slugs handled by the shell without a content module.
const EXTRA_SLUGS = new Set(["faq", "support"]);

const root =
  process.platform === "win32" && MODULES_DIR.startsWith("/")
    ? MODULES_DIR.slice(1)
    : MODULES_DIR;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk(root).filter(file => file.endsWith(".ts"));

const definedSlugs = new Set(EXTRA_SLUGS);
for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/slug: "([^"]+)"/g)) {
    definedSlugs.add(match[1]);
  }
}

const errors = [];
for (const file of files) {
  const source = readFileSync(file, "utf8");
  const label = relative(root, file);

  for (const match of source.matchAll(/\]\(doc:([^)]+)\)/g)) {
    if (!definedSlugs.has(match[1])) {
      errors.push(`${label}: doc link to unknown slug "${match[1]}"`);
    }
  }
  for (const match of source.matchAll(/\]\(#([a-z0-9-]+)\)/g)) {
    errors.push(
      `${label}: pseudo-anchor link "#${match[1]}" (use doc: links for pages)`
    );
  }
  if (source.includes("—")) {
    errors.push(`${label}: contains an em dash (use "-" instead)`);
  }
}

if (errors.length > 0) {
  console.error(`check-links: ${errors.length} problem(s) found\n`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `check-links: OK (${files.length} files, ${definedSlugs.size} slugs)`
);
