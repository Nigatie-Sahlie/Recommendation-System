/**
 * AASTU Course Recommendation System - Main JavaScript File
 *
 * This file initializes the application and coordinates between different modules
 */

// DOM Elements
const sections = document.querySelectorAll(".content-section");
const navLinks = document.querySelectorAll(".nav-link");
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const navList = document.querySelector(".nav-list");
const tabButtons = document.querySelectorAll(".tab-button");
const deptQuizButton = document.querySelector(".start-dept-quiz");
const streamSelect = document.getElementById("stream-select");
const startStreamQuizButton = document.querySelector(".start-stream-quiz");
const deptQuizContainer = document.getElementById("dept-quiz-container");
const streamQuizContainer = document.getElementById("stream-quiz-container");
const deptResultsContainer = document.getElementById(
  "dept-recommendation-results"
);
const streamResultsContainer = document.getElementById(
  "stream-recommendation-results"
);
const profileForm = document.getElementById("profile-form");
const clearProfileButton = document.getElementById("clear-profile");
const feedbackForm = document.getElementById("feedback-form");
const newFeedbackButton = document.getElementById("new-feedback");
const thankYouMessage = document.querySelector(".thank-you-message");
const accordionItems = document.querySelectorAll(".accordion-item");

// App State
const state = {
  currentSection: "home",
  userProfile: null,
  currentQuiz: null,
  quizAnswers: [],
  currentQuestionIndex: 0,
  searchTerm: "",
  searchDepartment: "",
  searchLevel: "",
};

// Initialize the application
function init() {
  // Set up event listeners
  setupEventListeners();

  // Initialize accordion functionality
  initAccordion();

  // Load user profile from localStorage if available
  loadUserProfile();

  // Animate stats
  animateStats();
}

// Set up event listeners
function setupEventListeners() {
  // Mobile menu toggle
  mobileMenuButton.addEventListener("click", toggleMobileMenu);

  // Navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const sectionId = link.getAttribute("href").substring(1);
      showSection(sectionId);
    });
  });

  // College tabs
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");
      showTab(tabId);
    });
  });

  // Department quiz button
  if (deptQuizButton) {
    deptQuizButton.addEventListener("click", startDeptQuiz);
  }

  // Stream selection
  if (streamSelect) {
    streamSelect.addEventListener("change", () => {
      startStreamQuizButton.disabled = !streamSelect.value;
    });
  }

  // Stream quiz button
  if (startStreamQuizButton) {
    startStreamQuizButton.addEventListener("click", () => {
      startStreamQuiz(streamSelect.value);
    });
  }

  // Profile form submission
  if (profileForm) {
    profileForm.addEventListener("submit", handleProfileSubmit);
  }

  // Clear profile button
  if (clearProfileButton) {
    clearProfileButton.addEventListener("click", handleClearProfile);
  }

  // Feedback form submission
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", handleFeedbackSubmit);
  }

  // New feedback button
  if (newFeedbackButton) {
    newFeedbackButton.addEventListener("click", resetFeedbackForm);
  }
}

// Initialize accordion functionality
function initAccordion() {
  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      item.classList.toggle("active");
      const content = item.querySelector(".accordion-content");
      if (item.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }

      // Rotate chevron icon
      const icon = header.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
      }
    });
  });
}

// Toggle mobile menu
function toggleMobileMenu() {
  navList.classList.toggle("active");
  mobileMenuButton.innerHTML = navList.classList.contains("active")
    ? '<i class="fas fa-times"></i>'
    : '<i class="fas fa-bars"></i>';
}

// Show a specific section
function showSection(sectionId) {
  // Hide all sections
  sections.forEach((section) => {
    section.classList.remove("active-section");
  });

  // Show the selected section
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.add("active-section");
    state.currentSection = sectionId;
  }

  // Update active nav link
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.classList.add("active");
    }
  });

  // Close mobile menu if open
  if (navList.classList.contains("active")) {
    toggleMobileMenu();
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

// Show a specific tab
function showTab(tabId) {
  // Update active tab button
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`.tab-button[data-tab="${tabId}"]`)
    .classList.add("active");

  // Update active tab content
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(tabId).classList.add("active");
}

// Start department quiz
function startDeptQuiz() {
  state.currentQuiz = "department";
  state.quizAnswers = [];
  state.currentQuestionIndex = 0;

  // Show quiz container
  deptQuizContainer.classList.remove("hidden");
  deptResultsContainer.classList.add("hidden");

  // Map main.js container elements to quiz.js expectations with Back button
  deptQuizContainer.innerHTML = `
    <div id="quiz-container">
      <h2 id="question"></h2>
      <div id="options"></div>
      <button id="back-btn" onclick="goBack()">Back</button>
      <button id="next-btn" onclick="nextQuestion()">Next</button>
      <div id="result" style="display: none;"></div>
    </div>
  `;

  // Start the quiz using quiz.js functionality
  startQuiz("department");
  updateNavigationButtons();
}

// Start stream quiz
function startStreamQuiz(stream) {
  state.currentQuiz = "stream";
  state.currentStream = stream;
  state.quizAnswers = [];
  state.currentQuestionIndex = 0;

  // Show quiz container
  streamQuizContainer.classList.remove("hidden");
  streamResultsContainer.classList.add("hidden");

  // Map main.js container elements to quiz.js expectations with Back button
  streamQuizContainer.innerHTML = `
    <div id="quiz-container">
      <h2 id="question"></h2>
      <div id="options"></div>
      <button id="back-btn" onclick="goBack()">Back</button>
      <button id="next-btn" onclick="nextQuestion()">Next</button>
      <div id="result" style="display: none;"></div>
    </div>
  `;

  // Set the selected department in quiz.js and start the stream quiz
  window.selectedDepartment = stream;
  startStreamQuiz();
  updateNavigationButtons();
}

// Function to handle going back to the previous question
function goBack() {
  if (state.currentQuestionIndex > 0) {
    state.currentQuestionIndex--;
    loadQuizQuestion();
    updateNavigationButtons();
  }
}

// Load quiz question (updated to handle back navigation)
function loadQuizQuestion() {
  let questions, quizContainer;

  if (state.currentQuiz === "department") {
    questions = window.deptQuizQuestions; // Access from quiz.js
    quizContainer = deptQuizContainer;
  } else {
    questions = window.streamQuizData[state.currentStream].questions;
    quizContainer = streamQuizContainer;
  }

  // Check if quiz is complete
  if (state.currentQuestionIndex >= questions.length) {
    window.showResult(); // Use quiz.js's showResult
    return;
  }

  const question = questions[state.currentQuestionIndex];

  // Update progress
  const progress = (state.currentQuestionIndex / questions.length) * 100;
  quizContainer.querySelector(
    ".quiz-progress-bar"
  ).style.width = `${progress}%`;

  // Update question number
  quizContainer.querySelector(
    ".quiz-question-number"
  ).textContent = `Question ${state.currentQuestionIndex + 1} of ${
    questions.length
  }`;

  // Update question text
  quizContainer.querySelector(".quiz-question").textContent = question.text;

  // Update options
  const optionsContainer = quizContainer.querySelector(".quiz-options");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.className = "quiz-option";
    optionElement.textContent = option.text;
    optionElement.setAttribute("data-value", index);

    // Check if this option was previously selected
    const previousAnswer = state.quizAnswers[state.currentQuestionIndex];
    if (previousAnswer && previousAnswer.optionIndex === index) {
      optionElement.classList.add("selected");
    }

    optionElement.addEventListener("click", () => {
      // Remove selected class from all options
      optionsContainer.querySelectorAll(".quiz-option").forEach((opt) => {
        opt.classList.remove("selected");
      });

      // Add selected class to clicked option
      optionElement.classList.add("selected");

      // Save the answer
      const answer = {
        questionId: question.id,
        optionIndex: parseInt(optionElement.getAttribute("data-value")),
      };
      state.quizAnswers[state.currentQuestionIndex] = answer;

      // Enable next button
      quizContainer.querySelector("#next-btn").disabled = false;
    });

    optionsContainer.appendChild(optionElement);
  });

  // Update navigation buttons
  updateNavigationButtons();
}

// Update navigation buttons' state
function updateNavigationButtons() {
  let quizContainer;
  if (state.currentQuiz === "department") {
    quizContainer = deptQuizContainer;
  } else {
    quizContainer = streamQuizContainer;
  }

  const backButton = quizContainer.querySelector("#back-btn");
  const nextButton = quizContainer.querySelector("#next-btn");

  if (state.currentQuestionIndex === 0) {
    //when back button disabled
    backButton.disabled = true;
  } else {
    backButton.disabled = false;
  }

  const questions = //how far next button work?
    state.currentQuiz === "department"
      ? window.deptQuizQuestions
      : window.streamQuizData[state.currentStream].questions;
  if (state.currentQuestionIndex >= questions.length - 1) {
    nextButton.textContent = "Finish";
  } else {
    nextButton.textContent = "Next";
  }

  // Disable next button if no option is selected
  const selectedOption = quizContainer.querySelector(".quiz-option.selected");
  nextButton.disabled = !selectedOption;

  // Add event listener for next button
  nextButton.onclick = () => {
    if (state.currentQuestionIndex < questions.length - 1) {
      state.currentQuestionIndex++;
      loadQuizQuestion();
    } else {
      window.showResult();
    }
  };
}

// Override showResult from quiz.js to integrate with main.js containers
const originalShowResult = window.showResult;
window.showResult = function () {
  originalShowResult();

  // Get the result element populated by quiz.js
  const resultContent = document.getElementById("result").innerHTML;

  // Update the appropriate results container based on quiz type
  if (state.currentQuiz === "department") {
    // Extract the raw scores to normalize percentages
    const scores = window.currentScores || [];
    const topDepartments = scores.slice(0, 3);
    const totalScore = topDepartments.reduce(
      (sum, dept) => sum + dept.score,
      0
    );

    // Calculate raw percentages
    let rawPercentages = topDepartments.map((dept) => (dept.score / 24) * 100);

    // Normalize percentages to sum to 100%
    const sumRawPercentages = rawPercentages.reduce((sum, p) => sum + p, 0);
    let normalizedPercentages;
    if (sumRawPercentages === 0) {
      normalizedPercentages = topDepartments.map(
        () => 100 / topDepartments.length
      );
    } else {
      normalizedPercentages = rawPercentages.map(
        (p) => (p / sumRawPercentages) * 100
      );
    }

    // Round percentages and adjust to ensure sum is exactly 100%
    normalizedPercentages = normalizedPercentages.map((p) => Math.round(p));
    const sumRounded = normalizedPercentages.reduce((sum, p) => sum + p, 0);
    if (sumRounded !== 100 && topDepartments.length > 0) {
      const adjustment = 100 - sumRounded;
      normalizedPercentages[normalizedPercentages.length - 1] += adjustment;
    }

    // Update the result content with normalized percentages
    let updatedContent = resultContent;
    normalizedPercentages.forEach((percentage, index) => {
      const regex = new RegExp(
        `(\\d+\\.?\\d*)% Match</div><p class="result-description">${topDepartments[index].description}`,
        "g"
      );
      updatedContent = updatedContent.replace(
        regex,
        `${percentage}% Match</div><p class="result-description">${topDepartments[index].description}`
      );
    });

    deptResultsContainer.innerHTML = updatedContent;
    deptResultsContainer.classList.remove("hidden");
    deptQuizContainer.classList.add("hidden");

    const retakeButton = deptResultsContainer.querySelector(".retake-quiz");
    const exploreButton = deptResultsContainer.querySelector(".explore-dept");
    if (retakeButton) retakeButton.addEventListener("click", startDeptQuiz);
    if (exploreButton)
      exploreButton.addEventListener("click", () => showSection("colleges"));
  } else if (state.currentQuiz === "stream") {
    // Extract the raw scores for streams
    const streams = window.currentStreams || [];
    const maxPossibleScore = window.maxPossibleScore || 18;

    // Calculate raw percentages
    let rawPercentages = streams.map(
      (stream) => (stream.score / maxPossibleScore) * 100
    );

    // Check if the top stream should be 100%
    let normalizedPercentages;
    if (rawPercentages.length > 0 && Math.round(rawPercentages[0]) === 100) {
      normalizedPercentages = streams.map((_, index) =>
        index === 0 ? 100 : 0
      );
    } else {
      const sumRawPercentages = rawPercentages.reduce((sum, p) => sum + p, 0);
      if (sumRawPercentages === 0) {
        normalizedPercentages = streams.map(() => 100 / streams.length);
      } else {
        normalizedPercentages = rawPercentages.map(
          (p) => (p / sumRawPercentages) * 100
        );
      }

      // Round percentages and adjust to ensure sum is exactly 100%
      normalizedPercentages = normalizedPercentages.map((p) => Math.round(p));
      const sumRounded = normalizedPercentages.reduce((sum, p) => sum + p, 0);
      if (sumRounded !== 100 && streams.length > 0) {
        const adjustment = 100 - sumRounded;
        normalizedPercentages[normalizedPercentages.length - 1] += adjustment;
      }
    }

    // Update the result content with normalized percentages
    let updatedContent = resultContent;
    normalizedPercentages.forEach((percentage, index) => {
      if (index === 0) {
        const regex = new RegExp(
          `(\\d+\\.?\\d*)% Match</div><p class="result-description">${streams[index].description}`,
          "g"
        );
        updatedContent = updatedContent.replace(
          regex,
          `${percentage}% Match</div><p class="result-description">${streams[index].description}`
        );
      } else {
        const regex = new RegExp(
          `\\((\\d+\\.?\\d*)%\\)</h5><p>${streams[index].description}`,
          "g"
        );
        updatedContent = updatedContent.replace(
          regex,
          `(${percentage}%)</h5><p>${streams[index].description}`
        );
      }
    });

    streamResultsContainer.innerHTML = updatedContent;
    streamResultsContainer.classList.remove("hidden");
    streamQuizContainer.classList.add("hidden");

    const retakeButton = streamResultsContainer.querySelector(".retake-quiz");
    const exploreButton =
      streamResultsContainer.querySelector(".explore-streams");
    if (retakeButton)
      retakeButton.addEventListener("click", () =>
        startStreamQuiz(state.currentStream)
      );
    if (exploreButton)
      exploreButton.addEventListener("click", () =>
        showSection("recommendations")
      );
  }
};

// Handle profile form submission
function handleProfileSubmit(e) {
  e.preventDefault();

  const formData = new FormData(profileForm);
  const profile = {
    basicInfo: {
      fullName: formData.get("full-name"),
      studentId: formData.get("student-id"),
      email: formData.get("email"),
    },
    academicInfo: {
      currentCgpa: formData.get("current-cgpa"),
      yearLevel: formData.get("year-level"),
      currentDept: formData.get("current-dept"),
    },
    interests: [],
    skills: {},
    careerPreferences: {
      careerGoals: formData.get("career-goals"),
      preferredIndustry: formData.get("preferred-industry"),
    },
    lastUpdated: new Date().toISOString(),
  };

  document
    .querySelectorAll('input[name="interests"]:checked')
    .forEach((checkbox) => {
      profile.interests.push(checkbox.value);
    });

  document
    .querySelectorAll('.skills-rating input[type="hidden"]')
    .forEach((input) => {
      const skillName = input.id.replace("skill-", "");
      profile.skills[skillName] = parseInt(input.value) || 0;
    });

  saveProfile(profile);
  showToast("Profile saved successfully!");
}

// Save profile to localStorage
function saveProfile(profile) {
  state.userProfile = profile;
  localStorage.setItem("aastuUserProfile", JSON.stringify(profile));
}

// Load user profile from localStorage
function loadUserProfile() {
  const profile = localStorage.getItem("aastuUserProfile");
  if (profile) {
    try {
      state.userProfile = JSON.parse(profile);
      populateProfileForm();
    } catch (error) {
      console.error("Error parsing profile:", error);
    }
  }
}

// Populate profile form with saved data
function populateProfileForm() {
  if (!state.userProfile || !profileForm) return;

  if (state.userProfile.basicInfo) {
    document.getElementById("full-name").value =
      state.userProfile.basicInfo.fullName || "";
    document.getElementById("student-id").value =
      state.userProfile.basicInfo.studentId || "";
    document.getElementById("email").value =
      state.userProfile.basicInfo.email || "";
  }

  if (state.userProfile.academicInfo) {
    document.getElementById("current-cgpa").value =
      state.userProfile.academicInfo.currentCgpa || "";
    document.getElementById("year-level").value =
      state.userProfile.academicInfo.yearLevel || "";
    document.getElementById("current-dept").value =
      state.userProfile.academicInfo.currentDept || "";
  }

  if (state.userProfile.interests) {
    state.userProfile.interests.forEach((interest) => {
      const checkbox = document.querySelector(
        `input[name="interests"][value="${interest}"]`
      );
      if (checkbox) checkbox.checked = true;
    });
  }

  if (state.userProfile.skills) {
    for (const [skill, rating] of Object.entries(state.userProfile.skills)) {
      const input = document.getElementById(`skill-${skill}`);
      if (input) {
        input.value = rating;
        const stars = document.querySelectorAll(
          `#skill-${skill}-rating .rating-star`
        );
        stars.forEach((star, index) => {
          if (index < rating) star.classList.add("active");
          else star.classList.remove("active");
        });
      }
    }
  }

  if (state.userProfile.careerPreferences) {
    document.getElementById("career-goals").value =
      state.userProfile.careerPreferences.careerGoals || "";
    document.getElementById("preferred-industry").value =
      state.userProfile.careerPreferences.preferredIndustry || "";
  }
}

// Handle clear profile
function handleClearProfile() {
  if (confirm("Are you sure you want to clear your profile data?")) {
    localStorage.removeItem("aastuUserProfile");
    profileForm.reset();
    state.userProfile = null;

    document.querySelectorAll(".rating-star").forEach((star) => {
      star.classList.remove("active");
    });

    document
      .querySelectorAll('.skills-rating input[type="hidden"]')
      .forEach((input) => {
        input.value = "0";
      });

    showToast("Profile data cleared");
  }
}

// Handle feedback form submission
function handleFeedbackSubmit(e) {
  e.preventDefault();

  const formData = new FormData(feedbackForm);
  const feedback = {
    type: formData.get("feedback-type"),
    message: formData.get("feedback-message"),
    email: formData.get("feedback-email") || null,
    rating: formData.get("rating") || null,
    date: new Date().toISOString(),
  };

  saveFeedback(feedback);

  feedbackForm.classList.add("hidden");
  thankYouMessage.classList.remove("hidden");
}

// Save feedback to localStorage
function saveFeedback(feedback) {
  let feedbacks = JSON.parse(localStorage.getItem("aastuFeedbacks")) || [];
  feedbacks.push(feedback);
  localStorage.setItem("aastuFeedbacks", JSON.stringify(feedbacks));
}

// Reset feedback form
function resetFeedbackForm() {
  feedbackForm.reset();
  feedbackForm.classList.remove("hidden");
  thankYouMessage.classList.add("hidden");

  document.querySelectorAll(".star-rating input").forEach((star) => {
    star.checked = false;
  });
}

// Debounce function to limit how often a function is called
function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Animate stats counters
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");

  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"));
    const increment = target / 100;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      stat.textContent = Math.floor(current);

      if (current >= target) {
        stat.textContent = target;
        clearInterval(timer);
      }
    }, 20);
  });
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
