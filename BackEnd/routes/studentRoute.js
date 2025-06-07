const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// Create a student
router.post("/", (req, res, next) => {
  const { Full_Name, ID_Number, Email, CGPA, Bach_Year, Department } = req.body;

  // Enhanced validation
  if (!Full_Name || !Email) {
    return res
      .status(400)
      .json({
        error:
          "fields (Full_Name, Email) are required",
      });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
    return res.status(400).json({ error: "Invalid Email format" });
  }

  Student.create(
    { Full_Name, ID_Number, Email, CGPA, Bach_Year, Department },
    (err, result) => {
      if (err) {
        console.error("Database error:", err); // Log detailed error
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return next(new Error("Error creating student"));
      }
      res.status(201).json({ message: "Student created", id: result.insertId });
    }
  );
});

// Get all students
router.get("/", (req, res, next) => {
  Student.findAll((err, results) => {
    if (err) {
      console.error("Database error:", err);
      return next(new Error("Error fetching students"));
    }
    res.json(results);
  });
});

// Get a student by ID
router.get("/:id", (req, res, next) => {
  Student.findById(req.params.id, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return next(new Error("Error fetching student"));
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(results[0]);
  });
});

// Update a student
router.put("/:id", (req, res, next) => {
  const { Full_Name, ID_Number, Email, CGPA, Bach_Year, Department } = req.body;

  // Enhanced validation
  if (!Full_Name || !Email ) {
    return res
      .status(400)
      .json({
        error:
          "fields (Full_Name, Email) are required",
      });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
    return res.status(400).json({ error: "Invalid Email format" });
  }

  Student.update(
    req.params.id,
    { Full_Name, ID_Number, Email, CGPA, Bach_Year, Department },
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return next(new Error("Error updating student"));
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "Student updated" });
    }
  );
});

// Delete a student
router.delete("/:id", (req, res, next) => {
  Student.delete(req.params.id, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return next(new Error("Error deleting student"));
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted" });
  });
});

module.exports = router;
