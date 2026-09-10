const fs = require("fs");
const Resume = require("../models/Resume");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume file",
      });
    }

    const resume = await Resume.create({
      user: req.user._id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      isActive: false,
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("Upload Resume Error:", error);

    res.status(500).json({
      message: "Unable to upload resume",
    });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get Resumes Error:", error);

    res.status(500).json({
      message: "Unable to fetch resumes",
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await resume.deleteOne();

    res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);

    res.status(500).json({
      message: "Unable to delete resume",
    });
  }
};

const setActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await Resume.updateMany(
      {
        user: req.user._id,
      },
      {
        $set: {
          isActive: false,
        },
      }
    );

    resume.isActive = true;

    const updatedResume = await resume.save();

    res.status(200).json({
      message: "Active resume updated successfully",
      resume: updatedResume,
    });
  } catch (error) {
    console.error("Set Active Resume Error:", error);

    res.status(500).json({
      message: "Unable to set active resume",
    });
  }
};

module.exports = {
  uploadResume,
  getResumes,
  deleteResume,
  setActiveResume,
};