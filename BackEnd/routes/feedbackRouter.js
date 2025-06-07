const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback");

// Create feedback
router.post("/", (req, res, next) => {
  const { email, feedback_type, message } = req.body;

  // Enhanced validation
  if (!email || !feedback_type || !message) {
    return res.status(400).json({
      error: "fields (email, feedback_type, message) are required",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  Feedback.create({ email, feedback_type, message }, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Email already exists" });
      }
      return next(new Error("Error creating feedback"));
    }
    res.status(201).json({ message: "Feedback created", id: result.insertId });
  });
});

// Get all feedback
router.get("/", (req, res, next) => {
  Feedback.findAll((err, results) => {
    if (err) {
      console.error("Database error:", err);
      return next(new Error("Error fetching feedback"));
    }
    res.json(results);
  });
});

// Get feedback by ID
router.get("/:id", (req, res, next) => {
  Feedback.findById(req.params.id, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return next(new Error("Error fetching feedback"));
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json(results[0]);
  });
});

// Update feedback
router.put("/:id", (req, res, next) => {
  const { email, feedback_type, message } = req.body;

  // Enhanced validation
  if (!email || !feedback_type || !message) {
    return res.status(400).json({
      error: "fields (email, feedback_type, message) are required",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  Feedback.update(
    req.params.id,
    { email, feedback_type, message },
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return next(new Error("Error updating feedback"));
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Feedback not found" });
      }
      res.json({ message: "Feedback updated" });
    }
  );
});

// Delete feedback
router.delete("/:id", (req, res, next) => {
  Feedback.delete(req.params.id, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return next(new Error("Error deleting feedback"));
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json({ message: "Feedback deleted" });
  });
});

module.exports = router;
