import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export async function POST(request: Request) {
  console.log("API route started - Gemini API approach");

  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error("Missing Google AI API key");
      return NextResponse.json({ error: "Google AI API key not configured" }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.includes('pdf')) {
      return NextResponse.json({ error: "Please upload a PDF file" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const fileBytes = await file.arrayBuffer();

    const filePart = {
      inlineData: {
        data: Buffer.from(fileBytes).toString('base64'),
        mimeType: "application/pdf"
      }
    };

    const prompt = `You are an expert pitch deck analyst with experience in venture capital . Analyze this pitch deck and provide a detailed analysis in JSON format.

IMPORTANT: Return ONLY raw JSON with no markdown formatting, code blocks, or explanatory text. Do not wrap the JSON in \`\`\`json or any other tags.

The response MUST follow this precise structure considering the given file is a pitch deck not any random document:

{
  "score": <number between 0-100, representing overall quality ( try to not get round figured number )>,
  "spelling": <number between 0-100, representing spelling/grammar quality>,
  "structure": <number between 0-100, representing structural quality>,
  "deckLength": <number of slides or 0 if unable to determine>,
  "clarity": <number between 0-100, representing clarity of messaging>,
  "feedback": {
    "content": "<1-3 paragraphs analyzing the content, value proposition, market analysis, business model, etc. Be specific about what works and what doesn't>",
    "design": "<1-3 paragraphs analyzing the visual design, layout, readability, graphics, and presentation quality>",
    "spelling": "<Specific list of spelling and grammar errors found, or 'No major spelling or grammar issues detected' if none are found>"
  },
  "recommendation": "<1-2 sentences with the MOST important actionable suggestion to improve the deck>"
}

The JSON response must be directly parseable with JSON.parse() - no text before or after, no markdown formatting.`;

    console.log("Sending request to Gemini API...");

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const analysisText = response.text();

    console.log("Received response from Gemini API");

    let cleanResponse = analysisText;
    if (cleanResponse.includes("```")) {
      cleanResponse = cleanResponse.replace(/```json\n|\n```|```/g, "");
    }

    let analysisData;
    try {
      analysisData = JSON.parse(cleanResponse);
      console.log("Analysis successfully parsed as JSON");
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e);

      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisData = JSON.parse(jsonMatch[0]);
          console.log("Extracted and parsed JSON from response");
        } catch (e2) {
          console.error("Failed to extract valid JSON:", e2);
          return NextResponse.json({
            error: "Failed to parse AI response",
            rawResponse: analysisText
          }, { status: 500 });
        }
      } else {
        console.error("No JSON content found in response");
        return NextResponse.json({
          error: "AI response did not contain JSON data",
          rawResponse: analysisText
        }, { status: 500 });
      }
    }

    const validatedData = {
      score: ensureNumberInRange(analysisData.score, 0, 100),
      spelling: ensureNumberInRange(analysisData.spelling, 0, 100),
      structure: ensureNumberInRange(analysisData.structure, 0, 100),
      deckLength: ensureNumber(analysisData.deckLength, 0),
      clarity: ensureNumberInRange(analysisData.clarity, 0, 100),
      wordCount: ensureNumber(analysisData.wordCount, 0),
      feedback: {
        content: analysisData.feedback?.content || "Content analysis unavailable",
        design: analysisData.feedback?.design || "Design analysis unavailable",
        spelling: analysisData.feedback?.spelling || "Spelling analysis unavailable"
      },
      recommendation: analysisData.recommendation || "Focus on improving the overall structure and content clarity of your pitch deck."
    };

    return NextResponse.json(validatedData);

  } catch (error: any) {
    console.error("API route error:", error.message);
    console.error("Stack trace:", error.stack);

    return NextResponse.json({
      error: error.message || "An error occurred during processing",
      details: error.stack || "No stack trace available"
    }, { status: 500 });
  }
}

function ensureNumberInRange(value: any, min: number, max: number): number {
  const num = Number(value);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

function ensureNumber(value: any, defaultValue: number): number {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}