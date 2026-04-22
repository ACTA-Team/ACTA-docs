import { NextResponse } from "next/server";
import { docsDataEn } from "@/content/docs";

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

    // Prepare documentation context for Gemini (using English version)
    const docsContext = Object.values(docsDataEn)
      .map(page => `## ${page.title}\n${page.content}`)
      .join("\n\n---\n\n");

    const prompt = `You are an AI assistant for ACTA documentation. ACTA is a verifiable credentials infrastructure on Stellar blockchain.

Here is the documentation context:

${docsContext}

---

User question: ${query}

Instructions:
1. Answer the question based ONLY on the documentation provided above
2. Be concise and helpful
3. If the question is not related to ACTA or the documentation, politely redirect to ACTA topics
4. At the end, suggest 1-3 relevant page slugs from this list that might help: introduction, architecture, getting-started, sdk-overview, useCredential, useVault, useVaultRead

Format your response as JSON:
{
  "answer": "Your helpful answer here",
  "suggestedPages": ["slug1", "slug2"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to parse JSON response
    let answer = textResponse;
    let suggestedPages: string[] = [];

    try {
      // Extract JSON from response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        answer = parsed.answer || textResponse;
        suggestedPages = parsed.suggestedPages || [];
      }
    } catch {
      // If JSON parsing fails, use the raw text
      answer = textResponse;
    }

    return NextResponse.json({ answer, suggestedPages });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
