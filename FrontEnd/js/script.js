document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("profile-form");
  const clearBtn = document.getElementById("clear-profile");
  const messageDiv = document.getElementById("form-message");


  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageDiv.textContent = "";

    const formData = new FormData(form);
    const data = {
      Full_Name: formData.get("full-name"),
      ID_Number: formData.get("ID_Number"),
      Email: formData.get("email"),
      CGPA: parseFloat(formData.get("current-cgpa")),
      Bach_Year: formData.get("year-level"),
      Department: formData.get("current-dept") || "",
    };

    // Show edit form
    function showEditForm(id, email, feedback_type, message) {
      const editForm = document.getElementById(`edit-form-${id}`);
      editForm.classList.add("active");
    }

    // Hide edit form
    function hideEditForm(id) {
      const editForm = document.getElementById(`edit-form-${id}`);
      editForm.classList.remove("active");
      document.getElementById(`edit-error-${id}`).textContent = "";
    }

    // Client-side validation
    if (!data.Full_Name || !data.Email) {
      messageDiv.textContent = "Full Name and Email are required.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
      messageDiv.textContent = "Invalid Email format.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = "Profile saved successfully!";
        messageDiv.classList.add("success");
        form.reset();
      } else {
        messageDiv.textContent = result.error || "Error saving profile.";
      }
    } catch (error) {
      messageDiv.textContent = "Network error. Please try again.";
    }
  });

  // Clear form
  clearBtn.addEventListener("click", () => {
    form.reset();
    messageDiv.textContent = "";
    messageDiv.classList.remove("success");
  });
});


//for feedback

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  const clearBtn = document.getElementById("clear-feedback");
  const messageDiv = document.getElementById("form-message");

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageDiv.textContent = "";

    const formData = new FormData(form);
    const data = {
      email: formData.get("feedback-email"),
      feedback_type: formData.get("feedback-type"),
      message: formData.get("feedback-message"),
    };

    // Client-side validation
    if (!data.email || !data.feedback_type || !data.message) {
      messageDiv.textContent =
        "Email, Feedback Type, and Message are required.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      messageDiv.textContent = "Invalid Email format.";
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = "Feedback submitted successfully!";
        messageDiv.classList.add("success");
        form.reset();
      } else {
        messageDiv.textContent = result.error || "Error submitting feedback.";
      }
    } catch (error) {
      messageDiv.textContent = "Network error. Please try again.";
    }
  });

  // Clear form
  clearBtn.addEventListener("click", () => {
    form.reset();
    messageDiv.textContent = "";
    messageDiv.classList.remove("success");
  });
});


