import { NextResponse } from "next/server";

/** Testnet API host (Swagger: https://api.testnet.acta.build/docs). */
const ACTA_TESTNET_API_HEALTH = "https://api.testnet.acta.build/health";

export async function GET() {
  try {
    const res = await fetch(ACTA_TESTNET_API_HEALTH, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Upstream fetch failed",
        message: e instanceof Error ? e.message : String(e),
      },
      { status: 502 }
    );
  }
}
