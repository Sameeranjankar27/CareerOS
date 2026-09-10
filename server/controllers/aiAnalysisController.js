const Resume = require("../models/Resume");

const extractResumeText = require(
  "../utils/resumeTextExtractor"
);

const analyzeResume = require(
  "../utils/aiService"
);

const analyzeResumeAgainstJob = async (
  req,
  res
) => {
  try {
    const { jobDescription } = req.body;

    // 1. Check job description
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    // 2. Find user's active resume
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

    // 3. Extract resume text
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

    // 4. Analyze resume against job description
    const analysis = await analyzeResume(
      resumeText,
      jobDescription
    );

    // 5. Send result
    res.status(200).json({
      message: "Resume analysis completed successfully",
      resume: {
        id: resume._id,
        name: resume.originalName,
      },
      analysis,
    });
  } catch (error) {
    console.error(
      "Resume Analysis Error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to analyze resume. Please try again.",
    });
  }
};

module.exports = {
  analyzeResumeAgainstJob,
};