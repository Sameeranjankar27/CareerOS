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

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// Serve uploaded resume files
app.use("/uploads", express.static("uploads"));

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/ai", aiAnalysisRoutes);
app.use("/api/ai-interview", aiInterviewRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/test", (req, res) => {
  res.json({
    message: "Test route working",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "CareerOS API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});