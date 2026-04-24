import { NextResponse } from "next/server";
import { docsByLocale } from "@/content/docs";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(docsByLocale, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=300",
    },
  });
}
