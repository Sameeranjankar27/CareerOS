const OpenAI = require("openai");

const mockAnalysis = (resumeText, jobDescription) => {
  const resume = resumeText.toLowerCase();
  const job = jobDescription.toLowerCase();

  const possibleSkills = [
    "react.js",
    "javascript",
    "html",
    "css",
    "node.js",
    "mongodb",
    "rest apis",
    "git",
    "responsive web development",
    "sql",
    "power bi",
  ];

  const matchingSkills = possibleSkills.filter(
    (skill) =>
      resume.includes(skill) &&
      job.includes(skill)
  );

  const missingSkills = possibleSkills.filter(
    (skill) =>
      job.includes(skill) &&
      !resume.includes(skill)
  );

  const keywordGaps = missingSkills.slice(0, 4);

  const matchScore = Math.min(
    95,
    Math.max(
      45,
      55 + matchingSkills.length * 7 - missingSkills.length * 3
    )
  );

  return {
    matchScore,

    summary:
      "Your resume shows a solid match with the provided job description. You have relevant frontend and backend experience, but there are a few areas that could be highlighted or strengthened for a better match.",

    matchingSkills:
      matchingSkills.length > 0
        ? matchingSkills
        : [
            "JavaScript",
            "React.js",
            "Node.js",
          ],

    missingSkills:
      missingSkills.length > 0
        ? missingSkills
        : [
            "REST APIs",
            "Git",
          ],

    keywordGaps:
      keywordGaps.length > 0
        ? keywordGaps
        : [
            "responsive web development",
            "REST APIs",
          ],

    strengths: [
      "Strong React.js and JavaScript experience",
      "Experience with Node.js and backend development",
      "Good exposure to MongoDB and database-driven applications",
      "Experience working on real-world web applications",
    ],

    improvements: [
      "Highlight REST API development more clearly in the resume",
      "Add measurable achievements to project descriptions",
      "Mention responsive web development explicitly",
      "Include Git and version-control experience if applicable",
    ],

    interviewTopics: [
      "React.js fundamentals and advanced concepts",
      "JavaScript ES6+ concepts",
      "REST API design and integration",
      "Node.js and Express.js",
      "MongoDB and database design",
      "Frontend performance and responsive design",
    ],
  };
};

const analyzeResume = async (
  resumeText,
  jobDescription
) => {
  // Temporary mock mode while API credits are unavailable
  if (process.env.MOCK_AI === "true") {
    console.log("Using MOCK AI analysis");

    return mockAnalysis(
      resumeText,
      jobDescription
    );
  }

  // Create OpenAI client only when real AI is enabled
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Real OpenAI analysis
  const prompt = `
You are an expert technical recruiter and career coach.

Analyze the candidate's resume against the provided job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return the analysis as valid JSON with exactly these fields:

{
  "matchScore": number,
  "summary": "short overall assessment",
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "keywordGaps": ["keyword1", "keyword2"],
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "interviewTopics": ["topic1", "topic2"]
}

Rules:
- matchScore must be between 0 and 100.
- Only include skills supported by the resume or job description.
- Do not invent candidate experience.
- Keep each item concise.
- Return ONLY valid JSON.
`;

  const response = await openai.responses.create({
    model: "gpt-5.6-luna",
    input: prompt,
  });

  const output = response.output_text;

  try {
    return JSON.parse(output);
  } catch (error) {
    console.error(
      "AI JSON Parse Error:",
      output
    );

    throw new Error(
      "AI returned an invalid analysis format"
    );
  }
};

module.exports = analyzeResume;