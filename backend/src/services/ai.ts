import Groq from "groq-sdk";

let _groq: Groq | null = null;
function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return _groq;
}
const MODEL = "llama-3.3-70b-versatile";

async function callGroq(prompt: string) {
  try {
    const chatCompletion = await getGroq().chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: MODEL,
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

async function extractAndMatchSkills(resumeText: string, jdText: string) {
  const prompt = `You are an expert technical recruiter and resume analyzer.
Analyze the following resume against the job description (or role).
Extract skills, match them, and categorize them.

Return ONLY valid JSON.
Expected JSON schema:
{
  "resume_skills": ["string"],
  "jd_skills": ["string"],
  "matched_skills": ["string"],
  "missing_skills": ["string"],
  "skills_by_category": [
    {
      "category": "string (e.g. Frontend, Backend, Tools)",
      "skills": [
        { "name": "string", "found": boolean }
      ]
    }
  ]
}

Resume:
${resumeText}

Job Description / Role:
${jdText}
`;
  return callGroq(prompt);
}

async function evaluateATS(resumeText: string, jdText: string) {
  const prompt = `You are an expert ATS (Applicant Tracking System) algorithm.
Evaluate the resume against the job description/role. Score out of 100.
Also, benchmark against a theoretical "Top Candidate" for this role.

Return ONLY valid JSON.
Expected JSON schema:
{
  "overall_score": number,
  "breakdown": {
    "keyword_match": number,
    "projects": number,
    "experience": number,
    "formatting": number,
    "impact_metrics": number,
    "education": number
  },
  "top_candidate_score": number,
  "top_candidate_gaps": ["string (e.g. Needs CI/CD)"]
}

Resume:
${resumeText}

Job Description / Role:
${jdText}
`;
  return callGroq(prompt);
}

async function generateSuggestions(resumeText: string, jdText: string) {
  const prompt = `You are an expert career coach and resume writer.
Analyze the resume against the job description/role and provide actionable coaching.
For "rewrites", find weak project or experience bullet points from the resume and provide high-impact, metric-driven rewrites.

Return ONLY valid JSON.
Expected JSON schema:
{
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "rewrites": [
    {
      "original": "string (weak bullet from resume)",
      "rewritten": "string (high-impact rewrite)"
    }
  ],
  "interview_questions": ["string"],
  "learning_roadmap": [
    {
      "week": number,
      "title": "string",
      "tasks": ["string"]
    }
  ]
}

Resume:
${resumeText}

Job Description / Role:
${jdText}
`;
  return callGroq(prompt);
}

export async function analyzeResume(resumeText: string, role: string, jobDescription?: string) {
  const jdText = jobDescription?.trim() ? jobDescription : `Role Title: ${role}`;
  
  try {
    const [skillsResult, atsResult, coachingResult] = await Promise.all([
      extractAndMatchSkills(resumeText, jdText),
      evaluateATS(resumeText, jdText),
      generateSuggestions(resumeText, jdText)
    ]);

    // Aggregate the results into a single object for the frontend
    return {
      target_role: role,
      ats_score: atsResult.overall_score,
      breakdown: atsResult.breakdown,
      top_candidate_score: atsResult.top_candidate_score,
      top_candidate_gaps: atsResult.top_candidate_gaps,
      
      resume_skills: skillsResult.resume_skills,
      jd_skills: skillsResult.jd_skills,
      matched_skills: skillsResult.matched_skills,
      missing_skills: skillsResult.missing_skills,
      skills_by_category: skillsResult.skills_by_category,
      
      summary: coachingResult.summary,
      strengths: coachingResult.strengths,
      weaknesses: coachingResult.weaknesses,
      rewrites: coachingResult.rewrites,
      interview_questions: coachingResult.interview_questions,
      learning_roadmap: coachingResult.learning_roadmap
    };
  } catch (error) {
    console.error("Pipeline error:", error);
    throw new Error("Failed to process the resume pipeline.");
  }
}
