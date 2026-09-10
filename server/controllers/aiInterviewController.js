const Resume = require("../models/Resume");

const extractResumeText = require(
  "../utils/resumeTextExtractor"
);

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ==========================================
// MOCK INTERVIEW PREP
// ==========================================

const mockInterviewPrep = (
  resumeText,
  jobDescription
) => {
  return {
    role: "Frontend Developer",

    overview:
      "Based on the job description and your active resume, you should focus on React.js, JavaScript, frontend architecture, REST APIs, Node.js and practical problem-solving.",

    technicalQuestions: [
      {
        question:
          "What is the difference between useState and useEffect in React?",
        difficulty: "Easy",
        topic: "React.js",
      },
      {
        question:
          "How would you optimize the performance of a React application?",
        difficulty: "Medium",
        topic: "React Performance",
      },
      {
        question:
          "Explain how you would integrate a REST API into a React application.",
        difficulty: "Medium",
        topic: "REST APIs",
      },
      {
        question:
          "What is the difference between props and state in React?",
        difficulty: "Easy",
        topic: "React.js",
      },
      {
        question:
          "How does Node.js handle asynchronous operations?",
        difficulty: "Medium",
        topic: "Node.js",
      },
      {
        question:
          "How would you design a MongoDB schema for a job application tracker?",
        difficulty: "Hard",
        topic: "MongoDB",
      },
      {
        question:
          "What are the key differences between var, let and const in JavaScript?",
        difficulty: "Easy",
        topic: "JavaScript",
      },
      {
        question:
          "How would you secure a REST API using JWT authentication?",
        difficulty: "Medium",
        topic: "Authentication",
      },
    ],

    behavioralQuestions: [
      {
        question:
          "Tell me about yourself and your experience as a developer.",
      },
      {
        question:
          "Tell me about a challenging technical problem you solved.",
      },
      {
        question:
          "Describe a situation where you had to work with changing requirements.",
      },
      {
        question:
          "How do you handle a production issue or critical bug?",
      },
      {
        question:
          "Why are you interested in this Frontend Developer role?",
      },
    ],

    preparationTopics: [
      "React.js fundamentals",
      "React hooks",
      "JavaScript ES6+",
      "REST API integration",
      "Node.js and Express.js",
      "MongoDB",
      "JWT authentication",
      "Responsive web development",
      "Frontend performance optimization",
      "Git and version control",
    ],

    tips: [
      "Be ready to explain the projects mentioned on your resume.",
      "Prepare practical examples instead of only theoretical definitions.",
      "Revise React hooks and JavaScript fundamentals carefully.",
      "Be prepared to explain how your frontend communicates with backend APIs.",
      "Use the STAR method when answering behavioral questions.",
    ],
  };
};


// ==========================================
// GENERATE INTERVIEW PREP
// ==========================================

const generateInterviewPrep = async (
  req,
  res
) => {
  try {
    const { jobDescription } = req.body;

    // Validate job description
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    // Find active resume
    const resume = await Resume.findOne({
      user: req.user._id,
      isActive: true,
    });

    if (!resume) {
      return res.status(404).json({
        message:
          "No active resume found. Please set a resume as active first.",
      });
    }

    // Extract resume text
    const resumeText = await extractResumeText(
      resume.filePath,
      resume.fileType
    );

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        message:
          "Unable to extract text from the selected resume.",
      });
    }

    // ==========================================
    // MOCK MODE
    // ==========================================

    if (process.env.MOCK_AI === "true") {
      console.log(
        "Using MOCK AI interview preparation"
      );

      const preparation = mockInterviewPrep(
        resumeText,
        jobDescription
      );

      return res.status(200).json({
        message:
          "Interview preparation generated successfully",
        resume: {
          id: resume._id,
          name: resume.originalName,
        },
        preparation,
      });
    }

    // ==========================================
    // REAL OPENAI MODE
    // ==========================================

    const prompt = `
You are an expert technical interviewer and career coach.

Create an interview preparation plan based on the candidate's resume and the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON with exactly this structure:

{
  "role": "job role",
  "overview": "short preparation overview",

  "technicalQuestions": [
    {
      "question": "question",
      "difficulty": "Easy | Medium | Hard",
      "topic": "topic"
    }
  ],

  "behavioralQuestions": [
    {
      "question": "question"
    }
  ],

  "preparationTopics": [
    "topic1",
    "topic2"
  ],

  "tips": [
    "tip1",
    "tip2"
  ]
}

Rules:
- Generate 8 technical questions.
- Generate 5 behavioral questions.
- Generate 8-12 preparation topics.
- Generate 5 practical interview tips.
- Questions should be relevant to the job description.
- Use the resume to personalize the preparation.
- Do not invent experience that is not present in the resume.
- Keep questions concise.
- Difficulty must be exactly Easy, Medium or Hard.
- Return ONLY valid JSON.
`;

    const response =
      await openai.responses.create({
        model: "gpt-5.6-luna",
        input: prompt,
      });

    const output = response.output_text;

    let preparation;

    try {
      preparation = JSON.parse(output);
    } catch (error) {
      console.error(
        "Interview Prep JSON Parse Error:",
        output
      );

      throw new Error(
        "AI returned an invalid interview preparation format"
      );
    }

    res.status(200).json({
      message:
        "Interview preparation generated successfully",

      resume: {
        id: resume._id,
        name: resume.originalName,
      },

      preparation,
    });

  } catch (error) {
    console.error(
      "Interview Preparation Error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to generate interview preparation. Please try again.",
    });
  }
};

module.exports = {
  generateInterviewPrep,
};