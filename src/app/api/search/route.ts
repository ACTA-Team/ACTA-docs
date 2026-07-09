import { NextResponse } from "next/server";
import { docsDataEn } from "@/content/docs";

const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SLUGS = [
  "introduction",
  "quickstart",
  "architecture",
  "getting-started",
  "security",
  "versions",
  "glossary",
  "mainnet-guide",
  "verify-credentials",
  "sdk-overview",
  "actaClient",
  "useCredential",
  "useVault",
  "useVaultRead",
  "sponsoredVault",
  "api-overview",
  "api-health-status",
  "api-keys",
  "api-contract-info",
  "api-vault-read",
  "api-vault-write",
  "api-sponsored-vault",
  "api-credentials",
  "api-errors",
  "contracts-reference",
  "contract-errors",
  "did-overview",
  "did-registry",
  "did-library",
  "mcp",
  "dapp-overview",
  "dapp-getting-started",
  "dapp-features",
];

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const docsContext = Object.values(docsDataEn)
      .map(page => `## ${page.title}\n${page.content}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are an AI assistant for ACTA documentation. ACTA is a verifiable credentials infrastructure on Stellar blockchain.

Answer questions based ONLY on the documentation context below. Be concise and helpful. If the question is unrelated to ACTA, politely redirect to ACTA topics. Answer in the same language the question is asked in.

Format the answer as Markdown:
- Use fenced code blocks with language tags (\`\`\`bash, \`\`\`tsx, etc.) for commands and code samples
- Use bullet lists for enumerations (hooks, steps, options)
- Use inline \`backticks\` for identifiers, package names, and hook names
- Keep paragraphs short; avoid headings unless the answer is long

At the end, suggest 1-3 relevant page slugs from this list that might help the user: ${SLUGS.join(", ")}.

Documentation context:

${docsContext}`;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: query }] }],
        generationConfig: {
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              answer: {
                type: "STRING",
                description: "The helpful answer to the user's question",
              },
              suggestedPages: {
                type: "ARRAY",
                items: { type: "STRING", enum: SLUGS },
                description: "Relevant page slugs (1-3 items)",
              },
            },
            required: ["answer", "suggestedPages"],
          },
        },
      }),
    });

    const data = (await res.json()) as GeminiResponse;

    if (!res.ok) {
      const message = data.error?.message ?? res.statusText;
      console.error("Gemini API error:", res.status, message);
      return NextResponse.json(
        { error: `Gemini API error (${res.status}): ${message}` },
        { status: 500 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text ?? "")
      .join("");

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(text) as {
      answer: string;
      suggestedPages: string[];
    };

    return NextResponse.json({
      answer: parsed.answer,
      suggestedPages: (parsed.suggestedPages ?? []).filter(slug =>
        SLUGS.includes(slug)
      ),
    });
  } catch (error) {
    console.error("Search error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Internal server error: ${message}` },
      { status: 500 }
    );
  }
}
