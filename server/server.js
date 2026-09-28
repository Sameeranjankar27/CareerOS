const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const notificationRoutes = require("./routes/notificationRoutes");

// Load environment variables FIRST
dotenv.config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const aiAnalysisRoutes = require("./routes/aiAnalysisRoutes");
const aiInterviewRoutes = require("./routes/aiInterviewRoutes");

connectDB();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Serve uploaded resume files
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiAnalysisRoutes);
app.use("/api/ai-interview", aiInterviewRoutes);
app.use("/api/notifications", notificationRoutes);

// Test route
app.get("/test", (req, res) => {
  res.json({
    message: "Test route working",
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "CareerOS API is running 🚀",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});