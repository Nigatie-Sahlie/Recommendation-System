const db = require("../config/db");

const Feedback = {
  // Create new feedback
  create: (feedbackData, callback) => {
    const { email, feedback_type, message } = feedbackData;
    const query =
      "INSERT INTO feedback (email, feedback_type, message) VALUES (?, ?, ?)";
    db.query(query, [email, feedback_type, message], callback);
  },
  // Find all feedback
  findAll: (callback) => {
    const query = "SELECT * FROM feedback";
    db.query(query, callback);
  },
  // Find feedback by ID
  findById: (id, callback) => {
    const query = "SELECT * FROM feedback WHERE feedbackID = ?";
    db.query(query, [id], callback);
  },
  // Update feedback
  update: (id, feedbackData, callback) => {
    const { email, feedback_type, message } = feedbackData;
    const query =
      "UPDATE feedback SET email = ?, feedback_type = ?, message = ? WHERE feedbackID = ?";
    db.query(query, [email, feedback_type, message, id], callback);
  },
  // Delete feedback
  delete: (id, callback) => {
    const query = "DELETE FROM feedback WHERE feedbackID = ?";
    db.query(query, [id], callback);
  },
};

module.exports = Feedback;
