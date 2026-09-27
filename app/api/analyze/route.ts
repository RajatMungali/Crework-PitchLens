import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";

// Note: `export const config = { api: { bodyParser: ... } }` is a Pages Router
// convention and has no effect on an App Router route.ts — removed. File size
// is validated manually below instead.

const MODEL_NAME = "gemini-3.5-flash-lite"; // current GA model as of July 2026; gemini-2.5-flash-lite was retired
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

const SYSTEM_INSTRUCTION = `You are a partner at a top-tier seed/Series A venture fund who has personally reviewed thousands of pitch decks, including the decks of companies that went through Y Combinator and later raised from Sequoia, a16z, and similar funds.

You are evaluating a deck from an early-stage, first-time founder who is building a tech product and wants specific, actionable feedback to get investor-ready — not encouragement, not vague platitudes.

How you score (0-100 overall, weighted):
- Market Potential — 25%
- Problem/Solution Clarity — 20%
- Business Model Viability — 15%
- Team Credibility — 15%
- Financial Projections — 10%
- Presentation Quality — 10%
- Innovation Factor — 5%

Scoring discipline:
- Use precise, granular integers (e.g. 73, 86, 91) — never round numbers like 70/80/90, never ranges.
- A deck that would make a real investor say "pass" scores below 50. A deck good enough to get a second meeting scores 70+. A deck in the top 5% you've seen scores 90+. Calibrate hard — most first drafts should land in the 40-65 range.
- Reward specificity, data-backed claims, and evidence of customer validation. Penalize vague claims, unverified TAM numbers, and generic language ("huge market", "no competitors").
- Small issues (typos, unlabeled axes, inconsistent numbers across slides) should visibly move the score, not just get a mention.

What strong decks (the kind that get funded) typically get right, and what you should be checking for:
- A specific, narrow wedge problem — not "we're disrupting X industry"
- Evidence the founder has talked to real customers, not just a hypothesis
- A market sizing that's built bottom-up, not a top-down "if we get 1% of a $50B market"
- Traction or a credible proxy for it if pre-revenue (waitlist, pilot, LOI)
- A team slide that explains "why us" for this specific problem, not just titles
- Visual clarity: one idea per slide, readable at a glance, no walls of text

For each slide, write a single paragraph that starts with what's working (if anything), then transitions into what to fix using the exact phrase "Areas for Improvement" as a marker before the improvement content — the frontend splits on this phrase, so it must appear verbatim exactly once per slide review, never at the very start of the paragraph.

Output must be valid JSON only — no markdown fences, no commentary before or after.`;

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    score: { type: SchemaType.NUMBER },
    spelling: { type: SchemaType.NUMBER },
    structure: { type: SchemaType.NUMBER },
    deckLength: { type: SchemaType.NUMBER },
    clarity: { type: SchemaType.NUMBER },
    slideBySlideReview: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          slideNumber: { type: SchemaType.NUMBER },
          title: { type: SchemaType.STRING },
          review: { type: SchemaType.STRING },
        },
        required: ["slideNumber", "title", "review"],
      },
    },
    feedback: {
      type: SchemaType.OBJECT,
      properties: {
        content: { type: SchemaType.STRING },
        design: { type: SchemaType.STRING },
        spelling: { type: SchemaType.STRING },
      },
      required: ["content", "design", "spelling"],
    },
    recommendation: { type: SchemaType.STRING },
  },
  required: [
    "score",
    "spelling",
    "structure",
    "deckLength",
    "clarity",
    "slideBySlideReview",
    "feedback",
    "recommendation",
  ],
};

export async function POST(request: Request) {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error("Missing Google AI API key");
      return NextResponse.json(
        { error: "Google AI API key not configured" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Please upload a PDF file" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File too large — max 10MB" },
        { status: 400 },
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.4,
      },
    });

    const fileBytes = await file.arrayBuffer();
    const filePart = {
      inlineData: {
        data: Buffer.from(fileBytes).toString("base64"),
        mimeType: "application/pdf",
      },
    };

    const result = await model.generateContent([
      "Evaluate this pitch deck and return the JSON result.",
      filePart,
    ]);

    const analysisText = result.response.text();

    let analysisData: any;
    try {
      analysisData = JSON.parse(analysisText);
    } catch (e) {
      console.error("Failed to parse model JSON output:", e);
      return NextResponse.json(
        { error: "Failed to parse AI response", rawResponse: analysisText },
        { status: 502 },
      );
    }

    const validatedData = {
      score: clamp(analysisData.score, 0, 100),
      spelling: clamp(analysisData.spelling, 0, 100),
      structure: clamp(analysisData.structure, 0, 100),
      deckLength: toNumber(analysisData.deckLength, 0),
      clarity: clamp(analysisData.clarity, 0, 100),
      slideBySlideReview: Array.isArray(analysisData.slideBySlideReview)
        ? analysisData.slideBySlideReview
        : [],
      feedback: {
        content:
          analysisData.feedback?.content || "Content analysis unavailable",
        design: analysisData.feedback?.design || "Design analysis unavailable",
        spelling:
          analysisData.feedback?.spelling || "Spelling analysis unavailable",
      },
      recommendation:
        analysisData.recommendation ||
        "Focus on improving the overall structure and content clarity of your pitch deck.",
    };

    return NextResponse.json(validatedData);
  } catch (error: any) {
    console.error("Analyze route error:", error?.message, error?.stack);
    return NextResponse.json(
      { error: error?.message || "An error occurred during processing" },
      { status: 500 },
    );
  }
}

function clamp(value: any, min: number, max: number): number {
  const num = Number(value);
  if (Number.isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

function toNumber(value: any, fallback: number): number {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}
