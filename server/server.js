const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const interviewRoutes = require("./routes/interview");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to InterviewX AI Backend 🚀"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "Backend is running",
    project: "InterviewX AI"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/interview", interviewRoutes);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`InterviewX AI server running on port ${PORT}`);
  });
};

startServer();
