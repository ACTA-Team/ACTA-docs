import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { docsDataEn } from "@/content/docs";

const SLUGS = [
  "introduction",
  "architecture",
  "getting-started",
  "sdk-overview",
  "useCredential",
  "useVault",
  "useVaultRead",
];

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const docsContext = Object.values(docsDataEn)
      .map(page => `## ${page.title}\n${page.content}`)
      .join("\n\n---\n\n");

    const systemPrompt = `You are an AI assistant for ACTA documentation. ACTA is a verifiable credentials infrastructure on Stellar blockchain.

Answer questions based ONLY on the documentation context below. Be concise and helpful. If the question is unrelated to ACTA, politely redirect to ACTA topics.

At the end, suggest 1-3 relevant page slugs from this list that might help the user: ${SLUGS.join(", ")}.

Documentation context:

${docsContext}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: query }],
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              answer: {
                type: "string",
                description: "The helpful answer to the user's question",
              },
              suggestedPages: {
                type: "array",
                items: { type: "string", enum: SLUGS },
                description: "Relevant page slugs (1-3 items)",
              },
            },
            required: ["answer", "suggestedPages"],
            additionalProperties: false,
          },
        },
      },
    });

    const textBlock = response.content.find(b => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "Empty response from Claude" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(textBlock.text) as {
      answer: string;
      suggestedPages: string[];
    };

    return NextResponse.json({
      answer: parsed.answer,
      suggestedPages: parsed.suggestedPages ?? [],
    });
  } catch (error) {
    console.error("Search error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error (${error.status}): ${error.message}` },
        { status: 500 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Internal server error: ${message}` },
      { status: 500 }
    );
  }
}
