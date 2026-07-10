import { permanentRedirect } from "next/navigation";

/** The docs home is the Introduction page; every page has its own URL. */
export default function DocsIndex() {
  permanentRedirect("/introduction");
}
