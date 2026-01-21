import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const fileBytes = await file.arrayBuffer();

    const filePart = {
      inlineData: {
        data: Buffer.from(fileBytes).toString('base64'),
        mimeType: "application/pdf"
      }
    };
    const prompt = `You are a hyper-critical venture capital pitch deck analyst with 20+ years of experience evaluating startup investments. 

CRITICAL SCORING GUIDELINES:

When calculating the SINGLE overall score (0-100), consider these weighted factors:
- Market Potential: 25%
- Problem-Solution Clarity: 20%
- Business Model Viability: 15%
- Team Credibility: 15%
- Financial Projections: 10%
- Presentation Quality: 10%
- Innovation Factor: 5%

SCORING PRINCIPLES:
- NEVER use round numbers (avoid 75, 80, 90)
- Use precise, granular scores (e.g., 73, 86, 91) and try to use specific scores , not ranges
- Penalize vagueness and reward specificity
- Penalize generic statements and reward unique insights  
- Reward concrete, data-backed claims and penalize generalized without data information
- Minor imperfections dramatically reduce score

SLIDE BY SLIDE Review Principle
- Must use Areas for Improvement keyword then tell the details of that
- Before the Areas for Improvement keyword , strength content should be there but without the keyword

RESPONSE MUST FOLLOW EXACT PREVIOUS STRUCTURE:
{
  "score": <precise number between 0-100>,
  "spelling": <precise number between 0-100>,
  "structure": <precise number between 0-100>,
  "deckLength": <number of slides>,
  "clarity": <precise number between 0-100>,
  "slideBySlideReview": [
    {
      "slideNumber": <number>,
      "title": "<slide title>",
      "review": "<single paragraph, hyper-analytical review>"
    }
  ],
  "feedback": {
    "content": "<brutally honest content analysis>",
    "design": "<design critique with specific recommendations include strength and area of improvement>",
    "spelling": "<exhaustive spelling/grammar error list>"
  },
  "recommendation": "<most critical improvement needed>"
}

EXECUTION INSTRUCTIONS:
- Be ruthlessly analytical
- Provide razor-sharp, specific feedback
- No generic statements
- Quantify everything possible
- Expose even minor weaknesses

The JSON response must be directly parseable with JSON.parse() - no text before or after, no markdown formatting.`;

    console.log("Sending request to Gemini API...");

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const analysisText = response.text();

    console.log("Received response from Gemini API");
    // console.log("Raw response:", analysisText);

    let cleanResponse = analysisText;
    const jsonExtractors = [
      () => cleanResponse.replace(/```json\n|\n```|```/g, ""),
      () => {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        return jsonMatch ? jsonMatch[0] : null;
      },
      () => {
        const match = analysisText.match(/\{[\s\S]*?"score"[\s\S]*?\}/);
        return match ? match[0] : null;
      }
    ];

    let analysisData = null;
    for (const extractor of jsonExtractors) {
      try {
        const extractedJson = extractor();
        if (extractedJson) {
          analysisData = JSON.parse(extractedJson);
          console.log("Successfully parsed JSON!");
          break;
        }
      } catch (e) {
        console.error("JSON extraction failed:", e);
      }
    }

    if (!analysisData) {
      console.error("Could not extract valid JSON from response");
      return NextResponse.json({
        error: "Failed to parse AI response",
        rawResponse: analysisText
      }, { status: 500 });
    }

    const validatedData = {
      score: ensureNumberInRange(analysisData.score, 0, 100),
      spelling: ensureNumberInRange(analysisData.spelling, 0, 100),
      structure: ensureNumberInRange(analysisData.structure, 0, 100),
      deckLength: ensureNumber(analysisData.deckLength, 0),
      clarity: ensureNumberInRange(analysisData.clarity, 0, 100),
      slideBySlideReview: analysisData.slideBySlideReview || [],
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