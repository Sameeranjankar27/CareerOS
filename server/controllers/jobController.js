const Job = require("../models/Job");
const Notification = require("../models/Notification");

// ==========================================
// CREATE JOB
// ==========================================
const createJob = async (req, res) => {
  try {
    const {
      company,
      role,
      jobDescription,
      location,
      status,
      applicationDate,
      notes,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        message: "Company and role are required",
      });
    }

    const job = await Job.create({
      user: req.user._id,
      company,
      role,
      jobDescription,
      location,
      status,
      applicationDate,
      notes,
    });

    await Notification.create({
  user: req.user._id,
  title: "Application Added",
  message: `Your application for ${job.role} at ${job.company} has been added.`,
  type: "application",
  relatedJob: job._id,
});

    res.status(201).json({
      message: "Job application added successfully",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// GET ALL JOBS
// ==========================================
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE JOB
// ==========================================
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const jobs = await Job.find({
      user: req.user._id,
    });

    const job = jobs.find(
      (item) => item._id.toString() === jobId
    );

    if (!job) {
      return res.status(404).json({
        message: "Job application not found",
      });
    }

    const {
      company,
      role,
      jobDescription,
      location,
      status,
      applicationDate,
      notes,
    } = req.body;

    if (company !== undefined) {
      job.company = company;
    }

    if (role !== undefined) {
      job.role = role;
    }

    if (jobDescription !== undefined) {
      job.jobDescription = jobDescription;
    }

    if (location !== undefined) {
      job.location = location;
    }

    if (status !== undefined) {
      job.status = status;
    }

    if (applicationDate !== undefined) {
      job.applicationDate = applicationDate;
    }

    if (notes !== undefined) {
      job.notes = notes;
    }

    const updatedJob = await job.save();

    res.status(200).json({
      message: "Job application updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// DELETE JOB
// ==========================================
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    const jobs = await Job.find({
      user: req.user._id,
    });

    const job = jobs.find(
      (item) => item._id.toString() === jobId
    );

    if (!job) {
      return res.status(404).json({
        message: "Job application not found",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      message: "Job application deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
};