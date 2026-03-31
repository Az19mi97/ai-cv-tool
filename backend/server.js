import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CohereClientV2 } from "cohere-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/**Cohere client**/
const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});


app.post("/generate", async (req, res) => {
  try {
    console.log("📩 REQUEST RECEIVED");

    const { cv, job } = req.body || {};

    if (!cv || !job) {
      return res.status(400).json({
        error: "Missing cv or job",
      });
    }

    const prompt = `
You are a professional CV + cover letter generator.

TASK:
From the input CV and job description, create:

1. A modern ATS-optimized CV
2. A natural cover letter

IMPORTANT OUTPUT FORMAT:
Return ONLY valid JSON:

{
  "cv": "formatted CV in clean structured sections with bullet points",
  "coverLetter": "natural flowing text ONLY - NO bullet points, NO CV formatting"
}

RULES:

CV:
- Use sections like:
  - Summary
  - Experience
  - Skills
  - Education
- Use bullet points where appropriate
- Make it ATS optimized
- Professional structure

COVER LETTER:
- Must be a natural letter
- 3–5 paragraphs
- NO bullet points
- NO CV formatting
- Write like a human applying for the job

DO NOT include explanations.

CV:
${cv}

JOB:
${job}
`;

    console.log("Sending request to Cohere...");

    const response = await cohere.chat({
      model: "command-a-reasoning-08-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("RAW RESPONSE:", JSON.stringify(response, null, 2));

    const content = response?.message?.content || [];

    const text = content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n")
      .trim();

    if (!text) {
      throw new Error("No valid text response from model");
    }

    /**PARSE JSON SAFELY**/
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.log("JSON PARSE FAILED:", text);
      throw new Error("Model did not return valid JSON");
    }

    console.log("SUCCESS - CV + LETTER GENERATED");

    res.json(parsed);

  } catch (err) {
    console.error("ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});