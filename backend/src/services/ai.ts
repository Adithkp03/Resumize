import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeResume(resumeText: string, role: string) {
  const prompt = `You are an expert ATS reviewer, hiring manager, and career coach.

Analyze the following resume for the role of ${role}.

Evaluate:
ATS compatibility
Skill relevance
Resume quality
Missing skills
Market competitiveness

Return ONLY valid JSON.

Expected JSON schema:
{
  "ats_score": number (0-100),
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "missing_skills": string[],
  "improvements": string[],
  "recommended_projects": string[],
  "learning_roadmap": string[]
}

Resume:
${resumeText}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error("AI analysis failed.");
  }
}
