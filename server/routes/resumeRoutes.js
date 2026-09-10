const express = require("express");

const {
  uploadResume,
  getResumes,
  deleteResume,
  setActiveResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Upload resume
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// Get all resumes
router.get(
  "/",
  protect,
  getResumes
);

// Set active resume
router.put(
  "/:id/active",
  protect,
  setActiveResume
);

// Delete resume
router.delete(
  "/:id",
  protect,
  deleteResume
);

module.exports = router;