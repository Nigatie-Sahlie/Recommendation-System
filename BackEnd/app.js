require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const studentRoutes = require("./routes/studentRoute");
const feedbackRoutes = require("./routes/feedbackRouter"); 
const errorHandler = require("./utils/errorHandler");
const db = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(morgan("dev")); // Log requests for debugging
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/feedback", feedbackRoutes); // New feedback routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "FrontEnd", "index.html"));
});

// Error Handling
app.use(errorHandler);

// Start Server
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  server.close(() => {
    db.end((err) => {
      if (err) console.error("Error closing database connection:", err);
      console.log("Database connection closed.");
      process.exit(0);
    });
  });
});
