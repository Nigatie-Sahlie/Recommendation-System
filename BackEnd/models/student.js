const db = require("../config/db");

const Student = {
  // Create a new student
  create: (studentData, callback) => {
    const { Full_Name, ID_Number, Email, CGPA, Bach_Year, Department } =
      studentData;
    const query =
      "INSERT INTO students (Full_Name, ID_Number, Email, CGPA, Bach_Year, Department) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [Full_Name,ID_Number, Email, CGPA, Bach_Year, Department], callback);
  },
  // Find all students
  findAll: (callback) => {
    const query = "SELECT * FROM students";
    db.query(query, callback);
  },
  // Find student by ID
  findById: (id, callback) => {
    const query = "SELECT * FROM students WHERE StudentID = ?";
    db.query(query, [id], callback);
  },
  // Update a student
  update: (id, studentData, callback) => {
    const { Full_Name, Email, CGPA, Bach_Year, Department } = studentData;
    const query =
      "UPDATE students SET Full_Name = ?, Email = ?, CGPA = ?, Bach_Year = ?, Department = ? WHERE StudentID = ?";
    db.query(
      query,
      [Full_Name, Email, CGPA, Bach_Year, Department, id],
      callback
    );
  },
  // Delete a student
  delete: (id, callback) => {
    const query = "DELETE FROM students WHERE StudentID = ?";
    db.query(query, [id], callback);
  },
};

module.exports = Student;
