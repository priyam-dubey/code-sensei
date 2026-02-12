import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
  process.exit(1);
}


const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Real-time Code Analysis
app.post("/api/analyze", async (req: Request, res: Response) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Code and language are required." });
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-1.5-pro",

      contents: `You are a Senior Software Engineer.

Analyze this ${language} code and provide:
1. Time & Space Complexity (Big-O)
2. Bug Report (if any)
3. Cleaner Optimized Version

Code:
${code}`,
    });

    res.json({
      feedback: response.text,
    });

  } catch (error: any) {
    console.error("❌ Gemini API Error:", error);

    res.status(500).json({
      error: "AI Review failed.",
      details: error.message || "Unknown error",
    });
  }
});

// Health check route
app.get("/", (_req, res) => {
  res.send("🚀 Code Sensei API is live and running!");
});

app.listen(port, () => {
  console.log(`🔥 Backend engine roaring at http://localhost:${port}`);
});
