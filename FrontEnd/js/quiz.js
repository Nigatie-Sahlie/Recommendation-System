document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("quiz-selection").style.display = "block";
});

let quizType = "";
let currentQuestion = 1;
let scores = {};
let questionCount = 0;
const maxQuestions = 14;
let selectedOption = null;
let totalPossibleScore = 0;
let selectedDepartment = "";

function startQuiz(type) {
  quizType = type;
  if (quizType === "department") {
    scores = {
      ece: 0,   //chenge there is here
      electromechanical: 0,
      software: 0,
      architecture: 0,
      mechanical: 0,
      civil: 0,
      chemical: 0,
      environmental: 0,
      mining: 0,
      industrialChemistry: 0,
      biotechnology: 0,
      foodScience: 0,
      geology: 0,
    };
    document.getElementById("quiz-selection").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    displayQuestion();
  } else if (quizType === "stream") {
    scores = {
      computerEngineering: 0,
      industrialControl: 0,
      communication: 0,
      powerEngineering: 0,
      hydraulicsEngineering: 0,
      constructionEngineering: 0,
      automatedEngineering: 0,
      design: 0,
      manufacturing: 0,
    };
    document.getElementById("quiz-selection").style.display = "none";
    document.getElementById("department-selection").style.display = "block";
  }
}

function startStreamQuiz() {
  const dropdown = document.getElementById("department-dropdown");
  selectedDepartment = dropdown.value;
  if (!selectedDepartment) {
    alert("Please select a department!");
    return;
  }
  document.getElementById("department-selection").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  currentQuestion = 3; // Start directly at stream selection
  scores = {
    computerEngineering: 0,
    industrialControl: 0,
    communication: 0,
    powerEngineering: 0,
    hydraulicsEngineering: 0,
    constructionEngineering: 0,
    automatedEngineering: 0,
    design: 0,
    manufacturing: 0,
  };
  questionCount = 0;
  totalPossibleScore = 0;
  displayQuestion();
}

const questions = [
  // Background questions (for department quiz only)
  {
    id: 1,
    text: "What was your main academic focus in high school?",
    options: [
      {
        text: "Science (Physics, Chemistry, Biology)",
        next: 2,
        scores: {
          biotechnology: 5,
          chemical: 5,
          industrialChemistry: 5,
          geology: 5,
          environmental: 3,
        },
      },
      {
        text: "Mathematics",
        next: 2,
        scores: {
          ece: 5,
          electromechanical: 4,
          software: 3,
          mechanical: 4,
          civil: 4,
        },
      },
      {
        text: "Technology related(e.g., ICT, technical drawing)",
        next: 2,
        scores: {
          ece: 4,
          software: 4,
          electromechanical: 5,
          architecture: 5,
        },
      },
      {
        text: "General studies (balanced curriculum)",
        next: 2,
        scores: { civil: 2, architecture: 2, environmental: 2, foodScience: 2, mechanical: 2, geology: 2, industrialChemistry: 2 },
      },
    ],
    type: "department",
  },
  {
    id: 2,
    text: "What was your specialization in preparatory school?",
    options: [
      {
        text: "Natural Sciences",
        next: 3,
        scores: {
          biotechnology: 5,
          chemical: 5,
          industrialChemistry: 5,
          geology: 5,
          foodScience: 3,
          environmental: 3,
          ece: 3,
          electromechanical:2,
          architecture: 3, 
        },
      },
      {
        text: "Social Sciences",
        next: 3,
        scores: { environmental: 5, architecture: 3, civil: 3 },
      },
      {
        text: "Technical/Vocational Studies",
        next: 3,
        scores: {
          ece: 4,
          electromechanical: 5,
          mechanical: 5,
          mining: 3,
        },
      },
      {
        text: "No specific specialization",
        next: 3,
        scores: { software: 2, civil: 2, architecture: 2, foodScience: 2, mechanical: 2, environmental: 2},
      },
    ],
    type: "department",
  },
  // Interest Based questions
  {
    id: 3,
    text: "What is your primary academic interest?",
    options: [
      {
        text: "Designing and building physical structures or systems",
        next: 4,
        scores: { engineering: 10, appliedScience: 2 },
      },
      {
        text: "Analyzing chemical or biological processes",
        next: 5,
        scores: { engineering: 3, appliedScience: 10 },
      },
      {
        text: "Developing software or computer systems",
        next: 4,
        scores: { engineering: 10, appliedScience: 1 },
      },
      {
        text: "Exploring natural phenomena like rocks or ecosystems",
        next: 5,
        scores: { engineering: 3, appliedScience: 10 },
      },
    ],
    type: "department",
  },
  {
    id: 4,
    text: "Which engineering field appeals to you most initially?",
    options: [
      {
        text: "Electronics, circuits, or computer systems",
        next: 6,
        scores: { ece: 10, electromechanical: 7, software: 6 },
      },
      {
        text: "Mechanical systems or machinery",
        next: 7,
        scores: { mechanical: 10, electromechanical: 6, ece: 2, civil: 4 },
      },
      {
        text: "Buildings, infrastructure, or urban planning",
        next: 8,
        scores: { civil: 10, architecture: 10, environmental: 5 },
      },
      {
        text: "Chemical processes or materials",
        next: 9,
        scores: { chemical: 10, mining: 5, environmental: 4, industrialChemistry: 8 },
      },
    ],
    type: "department",
  },
  {
    id: 5,
    text: "Which applied science area interests you most at first?",
    options: [
      {
        text: "Chemical reactions or industrial processes",
        next: 10,
        scores: { industrialChemistry: 10, chemical: 6 },
      },
      {
        text: "Biological systems or genetic engineering",
        next: 11,
        scores: { biotechnology: 10, foodScience: 6 },
      },
      {
        text: "Food production or nutrition",
        next: 12,
        scores: { foodScience: 10, biotechnology: 6 },
      },
      {
        text: "Earth sciences or mineral resources",
        next: 13,
        scores: { geology: 10, mining: 7 },
      },
    ],
    type: "department",
  },
  {
    id: 6,
    text: "What aspect of your chosen engineering field excites you?",
    options: [
      {
        text: "Circuit design, power systems, or computer hardware",
        next: 15,
        scores: { ece: 10, electromechanical: 7 },
      },
      {
        text: "Programming or software development",
        next: 16,
        scores: { software: 10, ece: 10, electromechanical: 4 },
      },
      {
        text: "Networking and system design",
        next: 17,
        scores: { ece: 8, software: 4 },
      },
      {
        text: "Robotics or automation",
        next: 18,
        scores: {
          electromechanical: 10,
          ece: 5,
          software: 5,
        },
      },
    ],
    type: "department",
  },
  {
    id: 7,
    text: "How do you prefer to approach mechanical systems?",
    options: [
      {
        text: "Designing engines or heavy machinery",
        next: 19,
        scores: { mechanical: 10, electromechanical: 5 },
      },
      {
        text: "Building robotics or automated systems",
        next: 20,
        scores: { electromechanical: 10, mechanical: 5, ece: 2 },
      },
      {
        text: "Focusing on structural construction",
        next: 21,
        scores: { civil: 8, mechanical: 7, environmental:2 },
      },
      {
        text: "Creating energy-efficient solutions",
        next: 22,
        scores: { environmental: 6, mechanical: 4, mining:5 },
      },
    ],
    type: "department",
  },
  {
    id: 8,
    text: "What part of infrastructure or design interests you most?",
    options: [
      {
        text: "Architectural aesthetics and design",
        next: 23,
        scores: { architecture: 10, civil: 5 },
      },
      {
        text: "Structural engineering like bridges",
        next: 24,
        scores: { civil: 10, architecture: 5 },
      },
      {
        text: "Sustainable urban planning",
        next: 25,
        scores: { environmental: 6, civil: 5, architecture:5 },
      },
      {
        text: "Geotechnical engineering",
        next: 26,
        scores: { civil: 4, mining: 5, geology: 6 },
      },
    ],
    type: "department",
  },
  {
    id: 9,
    text: "What type of chemical engineering focus do you prefer?",
    options: [
      {
        text: "Chemical production processes",
        next: 27,
        scores: { chemical: 10, industrialChemistry: 4 },
      },
      {
        text: "Environmental impact management",
        next: 28,
        scores: { environmental: 10, chemical: 4 },
      },
      {
        text: "Mining or resource extraction",
        next: 29,
        scores: { mining: 10, chemical: 4 },
      },
      {
        text: "Material synthesis",
        next: 30,
        scores: { chemical: 8, industrialChemistry: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 10,
    text: "What aspect of chemistry excites you further?",
    options: [
      {
        text: "Industrial chemical processes",
        next: 31,
        scores: { industrialChemistry: 10, chemical: 4 },
      },
      {
        text: "Material development",
        next: 32,
        scores: { industrialChemistry: 8, chemical: 4 },
      },
      {
        text: "Environmental chemistry",
        next: 33,
        scores: { environmental: 6, industrialChemistry: 4 },
      },
      {
        text: "Biochemical applications",
        next: 34,
        scores: { biotechnology: 6, industrialChemistry: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 11,
    text: "Which biotechnology area do you want to explore more?",
    options: [
      {
        text: "Genetic engineering or molecular biology",
        next: 35,
        scores: { biotechnology: 10, foodScience: 4 },
      },
      {
        text: "Food production or safety",
        next: 36,
        scores: { foodScience: 8, biotechnology: 4 },
      },
      { text: "Medical biotechnology", next: 37, scores: { biotechnology: 8 } },
      {
        text: "Environmental biotechnology",
        next: 38,
        scores: { biotechnology: 6, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 12,
    text: "What part of food science interests you most?",
    options: [
      {
        text: "Food safety or quality control",
        next: 39,
        scores: { foodScience: 10, biotechnology: 4 },
      },
      {
        text: "Nutritional science",
        next: 40,
        scores: { foodScience: 8, biotechnology: 4 },
      },
      {
        text: "Food processing technology",
        next: 41,
        scores: { foodScience: 8, chemical: 4 },
      },
      {
        text: "Sustainable food production",
        next: 42,
        scores: { foodScience: 6, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 13,
    text: "What earth science focus appeals to you?",
    options: [
      {
        text: "Mineral exploration or mining",
        next: 43,
        scores: { geology: 8, mining: 6 },
      },
      {
        text: "Environmental geology",
        next: 44,
        scores: { geology: 8, environmental: 4 },
      },
      {
        text: "Geological mapping or research",
        next: 45,
        scores: { geology: 10 },
      },
      {
        text: "Resource management",
        next: 46,
        scores: { geology: 6, mining: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 15,
    text: "How do you want to specialize in electrical engineering?",
    options: [
      {
        text: "Focus on advanced circuit design",
        next: 47,
        scores: { ece: 10 },
      },
      {
        text: "Work on software integration",
        next: 47,
        scores: { software: 8, ece: 4 },
      },
      {
        text: "Explore power system innovations",
        next: 47,
        scores: { ece: 8, electromechanical: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 16,
    text: "What software development area interests you?",
    options: [
      { text: "Mobile app development", next: 47, scores: { software: 10 } },
      {
        text: "Web development",
        next: 47,
        scores: { software: 8, ece: 4 },
      },
      {
        text: "System programming",
        next: 47,
        scores: { software: 8, electromechanical: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 17,
    text: "What networking aspect excites you?",
    options: [
      {
        text: "Wireless communication",
        next: 47,
        scores: { ece: 10 },
      },
      {
        text: "Network security",
        next: 47,
        scores: { ece: 8, software: 4 },
      },
      {
        text: "Data transmission systems",
        next: 47,
        scores: { ece: 8, electromechanical: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 18,
    text: "What robotics area interests you?",
    options: [
      {
        text: "Autonomous robots",
        next: 47,
        scores: { electromechanical: 10 },
      },
      {
        text: "Industrial automation",
        next: 47,
        scores: { electromechanical: 8, ece: 4 },
      },
      {
        text: "Robotic sensors",
        next: 47,
        scores: { electromechanical: 8, software: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 19,
    text: "What mechanical design focus do you prefer?",
    options: [
      { text: "Engine optimization", next: 47, scores: { mechanical: 10 } },
      {
        text: "Automotive engineering",
        next: 47,
        scores: { mechanical: 8, electromechanical: 4 },
      },
      {
        text: "Heavy machinery design",
        next: 47,
        scores: { mechanical: 8, civil: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 20,
    text: "What automation goal excites you?",
    options: [
      {
        text: "Smart manufacturing",
        next: 47,
        scores: { electromechanical: 10 },
      },
      {
        text: "Robotic control systems",
        next: 47,
        scores: { electromechanical: 8, mechanical: 4 },
      },
      {
        text: "Automated assembly lines",
        next: 47,
        scores: { electromechanical: 8, civil: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 21,
    text: "What construction focus interests you?",
    options: [
      { text: "Bridge engineering", next: 47, scores: { civil: 10 } },
      {
        text: "Road construction",
        next: 47,
        scores: { civil: 8, architecture: 4 },
      },
      {
        text: "Structural analysis",
        next: 47,
        scores: { civil: 8, mechanical: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 22,
    text: "What energy solution do you want to pursue?",
    options: [
      { text: "Renewable energy", next: 47, scores: { environmental: 10 } },
      {
        text: "Energy efficiency",
        next: 47,
        scores: { environmental: 8, mechanical: 4 },
      },
      {
        text: "Sustainable infrastructure",
        next: 47,
        scores: { environmental: 8, civil: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 23,
    text: "What architectural style do you prefer?",
    options: [
      { text: "Modern design", next: 47, scores: { architecture: 10 } },
      {
        text: "Historical restoration",
        next: 47,
        scores: { architecture: 8, civil: 4 },
      },
      {
        text: "Sustainable architecture",
        next: 47,
        scores: { architecture: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 24,
    text: "What civil engineering challenge excites you?",
    options: [
      { text: "Tunnel construction", next: 47, scores: { civil: 10 } },
      {
        text: "Urban planning",
        next: 47,
        scores: { civil: 8, environmental: 4 },
      },
      {
        text: "Foundation engineering",
        next: 47,
        scores: { civil: 8, mining: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 25,
    text: "What sustainable goal interests you?",
    options: [
      { text: "Green buildings", next: 47, scores: { environmental: 10 } },
      {
        text: "Waste management",
        next: 47,
        scores: { environmental: 8, chemical: 4 },
      },
      {
        text: "Water conservation",
        next: 47,
        scores: { environmental: 8, civil: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 26,
    text: "What geotechnical aspect excites you?",
    options: [
      { text: "Soil mechanics", next: 47, scores: { civil: 10 } },
      { text: "Rock stability", next: 47, scores: { civil: 8, mining: 4 } },
      {
        text: "Foundation design",
        next: 47,
        scores: { civil: 8, architecture: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 27,
    text: "What chemical process excites you?",
    options: [
      { text: "Petrochemical refining", next: 47, scores: { chemical: 10 } },
      {
        text: "Polymer synthesis",
        next: 47,
        scores: { chemical: 8, industrialChemistry: 4 },
      },
      {
        text: "Environmental catalysis",
        next: 47,
        scores: { chemical: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 28,
    text: "What environmental focus do you prefer?",
    options: [
      { text: "Pollution control", next: 47, scores: { environmental: 10 } },
      {
        text: "Renewable energy integration",
        next: 47,
        scores: { environmental: 8, chemical: 4 },
      },
      {
        text: "Ecosystem restoration",
        next: 47,
        scores: { environmental: 8, biotechnology: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 29,
    text: "What mining technique interests you?",
    options: [
      { text: "Surface mining", next: 47, scores: { mining: 10 } },
      {
        text: "Underground extraction",
        next: 47,
        scores: { mining: 8, geology: 4 },
      },
      {
        text: "Mineral processing",
        next: 47,
        scores: { mining: 8, chemical: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 30,
    text: "What material synthesis goal excites you?",
    options: [
      { text: "Advanced composites", next: 47, scores: { chemical: 10 } },
      {
        text: "Nanomaterials",
        next: 47,
        scores: { chemical: 8, industrialChemistry: 4 },
      },
      {
        text: "Biodegradable materials",
        next: 47,
        scores: { chemical: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 31,
    text: "What industrial chemistry application do you prefer?",
    options: [
      {
        text: "Chemical manufacturing",
        next: 47,
        scores: { industrialChemistry: 10 },
      },
      {
        text: "Process optimization",
        next: 47,
        scores: { industrialChemistry: 8, chemical: 4 },
      },
      {
        text: "Green chemistry",
        next: 47,
        scores: { industrialChemistry: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 32,
    text: "What material development focus excites you?",
    options: [
      {
        text: "High-strength alloys",
        next: 47,
        scores: { industrialChemistry: 10 },
      },
      {
        text: "Ceramic materials",
        next: 47,
        scores: { industrialChemistry: 8, chemical: 4 },
      },
      {
        text: "Sustainable materials",
        next: 47,
        scores: { industrialChemistry: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 33,
    text: "What environmental chemistry goal interests you?",
    options: [
      {
        text: "Air quality improvement",
        next: 47,
        scores: { environmental: 10 },
      },
      {
        text: "Water purification",
        next: 47,
        scores: { environmental: 8, chemical: 4 },
      },
      {
        text: "Soil remediation",
        next: 47,
        scores: { environmental: 8, biotechnology: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 34,
    text: "What biochemical application excites you?",
    options: [
      { text: "Enzyme technology", next: 47, scores: { biotechnology: 10 } },
      {
        text: "Biofuel production",
        next: 47,
        scores: { biotechnology: 8, environmental: 4 },
      },
      {
        text: "Pharmaceutical development",
        next: 47,
        scores: { biotechnology: 8, industrialChemistry: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 35,
    text: "What genetic engineering focus do you prefer?",
    options: [
      { text: "Gene editing", next: 47, scores: { biotechnology: 10 } },
      {
        text: "Agricultural biotech",
        next: 47,
        scores: { biotechnology: 8, foodScience: 4 },
      },
      { text: "Medical genetics", next: 47, scores: { biotechnology: 8 } },
    ],
    type: "department",
  },
  {
    id: 36,
    text: "What food production area interests you?",
    options: [
      { text: "Food preservation", next: 47, scores: { foodScience: 10 } },
      {
        text: "Nutritional enhancement",
        next: 47,
        scores: { foodScience: 8, biotechnology: 4 },
      },
      {
        text: "Food safety standards",
        next: 47,
        scores: { foodScience: 8, chemical: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 37,
    text: "What medical biotech goal excites you?",
    options: [
      { text: "Vaccine development", next: 47, scores: { biotechnology: 10 } },
      { text: "Gene therapy", next: 47, scores: { biotechnology: 8 } },
      {
        text: "Diagnostic tools",
        next: 47,
        scores: { biotechnology: 8, industrialChemistry: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 38,
    text: "What environmental biotech focus do you prefer?",
    options: [
      { text: "Bioremediation", next: 47, scores: { biotechnology: 10 } },
      {
        text: "Bioenergy",
        next: 47,
        scores: { biotechnology: 8, environmental: 4 },
      },
      {
        text: "Waste treatment",
        next: 47,
        scores: { biotechnology: 8, foodScience: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 39,
    text: "What food safety focus excites you?",
    options: [
      { text: "Contaminant detection", next: 47, scores: { foodScience: 10 } },
      {
        text: "Food packaging innovation",
        next: 47,
        scores: { foodScience: 8, chemical: 4 },
      },
      {
        text: "Regulatory compliance",
        next: 47,
        scores: { foodScience: 8, biotechnology: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 40,
    text: "What nutritional science goal interests you?",
    options: [
      { text: "Dietary supplements", next: 47, scores: { foodScience: 10 } },
      {
        text: "Nutrient fortification",
        next: 47,
        scores: { foodScience: 8, biotechnology: 4 },
      },
      {
        text: "Health impact studies",
        next: 47,
        scores: { foodScience: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 41,
    text: "What food processing technology excites you?",
    options: [
      {
        text: "Automation in processing",
        next: 47,
        scores: { foodScience: 10 },
      },
      {
        text: "Food preservation techniques",
        next: 47,
        scores: { foodScience: 8, chemical: 4 },
      },
      {
        text: "Sustainable processing",
        next: 47,
        scores: { foodScience: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 42,
    text: "What sustainable food production goal do you prefer?",
    options: [
      { text: "Organic farming", next: 47, scores: { foodScience: 10 } },
      {
        text: "Aquaculture",
        next: 47,
        scores: { foodScience: 8, biotechnology: 4 },
      },
      {
        text: "Vertical farming",
        next: 47,
        scores: { foodScience: 8, civil: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 43,
    text: "What mineral exploration technique excites you?",
    options: [
      { text: "Geophysical surveys", next: 47, scores: { geology: 10 } },
      {
        text: "Drilling technology",
        next: 47,
        scores: { geology: 8, mining: 4 },
      },
      {
        text: "Remote sensing",
        next: 47,
        scores: { geology: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 44,
    text: "What environmental geology focus do you prefer?",
    options: [
      { text: "Landslide prevention", next: 47, scores: { geology: 10 } },
      {
        text: "Volcanic hazard assessment",
        next: 47,
        scores: { geology: 8, environmental: 4 },
      },
      { text: "Seismic studies", next: 47, scores: { geology: 8, civil: 4 } },
    ],
    type: "department",
  },
  {
    id: 45,
    text: "What geological research area interests you?",
    options: [
      { text: "Plate tectonics", next: 47, scores: { geology: 10 } },
      { text: "Mineral deposits", next: 47, scores: { geology: 8, mining: 4 } },
      {
        text: "Climate history",
        next: 47,
        scores: { geology: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 46,
    text: "What resource management goal excites you?",
    options: [
      { text: "Sustainable mining", next: 47, scores: { geology: 10 } },
      {
        text: "Water resource planning",
        next: 47,
        scores: { geology: 8, civil: 4 },
      },
      {
        text: "Energy resource assessment",
        next: 47,
        scores: { geology: 8, environmental: 4 },
      },
    ],
    type: "department",
  },
  {
    id: 47,
    text: "How do you envision your future contribution?",
    options: [
      {
        text: "Pioneering new technologies",
        scores: {
          ece: 8,
          software: 6,
          electromechanical: 6,
          mechanical: 6,
          civil: 6,
          architecture: 6,
          chemical: 6,
          environmental: 6,
          mining: 6,
          industrialChemistry: 6,
          biotechnology: 6,
          foodScience: 6,
          geology: 6,
        },
      },
      {
        text: "Solving real-world problems",
        scores: {
          ece: 6,
          software: 6,
          electromechanical: 6,
          mechanical: 6,
          civil: 8,
          architecture: 6,
          chemical: 6,
          environmental: 8,
          mining: 6,
          industrialChemistry: 6,
          biotechnology: 6,
          foodScience: 6,
          geology: 6,
        },
      },
    ],
    type: "department",
  },
  // Stream recommendation questions (specific to streams)
  {
    id: 3,
    text: "What aspect of Electrical and Computer Engineering interests you most?",
    options: [
      {
        text: "Designing computer systems or software",
        next: 48,
        scores: { computerEngineering: 10 },
      },
      {
        text: "Managing industrial automation or control systems",
        next: 52,
        scores: { industrialControl: 10 },
      },
      {
        text: "Working with communication networks",
        next: 56,
        scores: { communication: 10 },
      },
      {
        text: "Focusing on power systems",
        next: 60,
        scores: { powerEngineering: 10 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 3,
    text: "What aspect of Civil Engineering interests you most?",
    options: [
      {
        text: "Designing water resource systems",
        next: 64,
        scores: { hydraulicsEngineering: 10 },
      },
      {
        text: "Building and managing construction projects",
        next: 68,
        scores: { constructionEngineering: 10 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  {
    id: 3,
    text: "What aspect of Mechanical Engineering interests you most?",
    options: [
      {
        text: "Developing automated machinery",
        next: 72,
        scores: { automatedEngineering: 10 },
      },
      { text: "Focusing on product design", next: 76, scores: { design: 10 } },
      {
        text: "Optimizing manufacturing processes",
        next: 80,
        scores: { manufacturing: 10 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  // Computer Engineering (ECE) Stream Questions
  {
    id: 48,
    text: "Which area of computer engineering do you find most exciting?",
    options: [
      {
        text: "Developing software applications",
        next: 49,
        scores: { computerEngineering: 8 },
      },
      {
        text: "Designing computer hardware",
        next: 49,
        scores: { computerEngineering: 6, industrialControl: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 49,
    text: "What kind of projects do you prefer in computer engineering?",
    options: [
      {
        text: "Building scalable systems",
        next: 50,
        scores: { computerEngineering: 8 },
      },
      {
        text: "Optimizing system performance",
        next: 50,
        scores: { computerEngineering: 6, communication: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 50,
    text: "How do you approach solving computer engineering problems?",
    options: [
      {
        text: "Using algorithmic thinking",
        next: 51,
        scores: { computerEngineering: 8 },
      },
      {
        text: "Focusing on hardware-software integration",
        next: 51,
        scores: { computerEngineering: 6, industrialControl: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 51,
    text: "What future trend in computer engineering interests you?",
    options: [
      {
        text: "Artificial Intelligence and Machine Learning",
        scores: { computerEngineering: 8 },
      },
      {
        text: "Internet of Things (IoT)",
        scores: { computerEngineering: 6, communication: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  // Industrial Control (ECE) Stream Questions
  {
    id: 52,
    text: "What aspect of industrial control systems do you enjoy?",
    options: [
      {
        text: "Designing control algorithms",
        next: 53,
        scores: { industrialControl: 8 },
      },
      {
        text: "Implementing automation solutions",
        next: 53,
        scores: { industrialControl: 6 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 53,
    text: "What type of industrial control projects interest you?",
    options: [
      {
        text: "Factory automation",
        next: 54,
        scores: { industrialControl: 8 },
      },
      {
        text: "Process control in manufacturing",
        next: 54,
        scores: { industrialControl: 6 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 54,
    text: "How do you ensure efficiency in industrial control systems?",
    options: [
      {
        text: "Optimizing control loops",
        next: 55,
        scores: { industrialControl: 8 },
      },
      {
        text: "Integrating smart sensors",
        next: 55,
        scores: { industrialControl: 6, communication: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 55,
    text: "What industrial control innovation excites you?",
    options: [
      { text: "Industry 4.0 technologies", scores: { industrialControl: 8 } },
      {
        text: "Cyber-physical systems",
        scores: { industrialControl: 6, computerEngineering: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  // Communication (ECE) Stream Questions
  {
    id: 56,
    text: "What area of communication engineering do you prefer?",
    options: [
      {
        text: "Wireless communication systems",
        next: 57,
        scores: { communication: 8 },
      },
      {
        text: "Network infrastructure development",
        next: 57,
        scores: { communication: 6, computerEngineering: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 57,
    text: "What type of communication projects do you want to work on?",
    options: [
      {
        text: "High-speed network design",
        next: 58,
        scores: { communication: 8 },
      },
      {
        text: "Secure communication protocols",
        next: 58,
        scores: { communication: 6, computerEngineering: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 58,
    text: "How do you approach challenges in communication engineering?",
    options: [
      {
        text: "Enhancing data transmission efficiency",
        next: 59,
        scores: { communication: 8 },
      },
      {
        text: "Improving network reliability",
        next: 59,
        scores: { communication: 6, industrialControl: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 59,
    text: "What future trend in communication engineering interests you?",
    options: [
      { text: "5G and beyond technologies", scores: { communication: 8 } },
      {
        text: "Internet of Things connectivity",
        scores: { communication: 6, computerEngineering: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  // Power Engineering (ECE) Stream Questions
  {
    id: 60,
    text: "What area of power engineering do you prefer?",
    options: [
      {
        text: "Power system design and optimization",
        next: 61,
        scores: { powerEngineering: 8 },
      },
      {
        text: "Renewable energy integration",
        next: 61,
        scores: { powerEngineering: 6 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 61,
    text: "What type of power engineering projects do you want to work on?",
    options: [
      {
        text: "Smart grid implementations",
        next: 62,
        scores: { powerEngineering: 8 },
      },
      {
        text: "Energy distribution systems",
        next: 62,
        scores: { powerEngineering: 6 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 62,
    text: "How do you approach challenges in power engineering?",
    options: [
      {
        text: "Focusing on energy efficiency",
        next: 63,
        scores: { powerEngineering: 8 },
      },
      {
        text: "Ensuring system stability",
        next: 63,
        scores: { powerEngineering: 6, industrialControl: 2 },
      },
    ],
    department: "ece",
    type: "stream",
  },
  {
    id: 63,
    text: "What future trend in power engineering interests you?",
    options: [
      { text: "Renewable energy systems", scores: { powerEngineering: 8 } },
      { text: "Energy storage solutions", scores: { powerEngineering: 6 } },
    ],
    department: "ece",
    type: "stream",
  },
  // Hydraulics Engineering (Civil) Stream Questions
  {
    id: 64,
    text: "What aspect of hydraulics engineering do you find most interesting?",
    options: [
      {
        text: "Water resource management",
        next: 65,
        scores: { hydraulicsEngineering: 8 },
      },
      {
        text: "Flood control systems",
        next: 65,
        scores: { hydraulicsEngineering: 6, constructionEngineering: 2 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  {
    id: 65,
    text: "What type of hydraulics projects do you prefer?",
    options: [
      {
        text: "Designing irrigation systems",
        next: 66,
        scores: { hydraulicsEngineering: 8 },
      },
      {
        text: "Developing hydropower solutions",
        next: 66,
        scores: { hydraulicsEngineering: 6 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  {
    id: 66,
    text: "How do you ensure sustainability in hydraulics engineering?",
    options: [
      {
        text: "Optimizing water usage",
        next: 67,
        scores: { hydraulicsEngineering: 8 },
      },
      {
        text: "Minimizing environmental impact",
        next: 67,
        scores: { hydraulicsEngineering: 6, constructionEngineering: 2 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  {
    id: 67,
    text: "What future trend in hydraulics engineering excites you?",
    options: [
      {
        text: "Smart water management systems",
        scores: { hydraulicsEngineering: 8 },
      },
      {
        text: "Climate-resilient infrastructure",
        scores: { hydraulicsEngineering: 6, constructionEngineering: 2 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  // Construction Engineering (Civil) Stream Questions
  {
    id: 68,
    text: "What aspect of construction engineering do you enjoy?",
    options: [
      {
        text: "Planning large-scale projects",
        next: 69,
        scores: { constructionEngineering: 8 },
      },
      {
        text: "Ensuring structural safety",
        next: 69,
        scores: { constructionEngineering: 6, hydraulicsEngineering: 2 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  {
    id: 69,
    text: "What type of construction projects interest you?",
    options: [
      {
        text: "Building skyscrapers",
        next: 70,
        scores: { constructionEngineering: 8 },
      },
      {
        text: "Infrastructure development",
        next: 70,
        scores: { constructionEngineering: 6, hydraulicsEngineering: 2 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  {
    id: 70,
    text: "How do you ensure quality in construction projects?",
    options: [
      {
        text: "Using advanced materials",
        next: 71,
        scores: { constructionEngineering: 8 },
      },
      {
        text: "Implementing rigorous testing",
        next: 71,
        scores: { constructionEngineering: 6 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  {
    id: 71,
    text: "What future trend in construction engineering excites you?",
    options: [
      {
        text: "Sustainable construction practices",
        scores: { constructionEngineering: 8 },
      },
      {
        text: "Modular construction technologies",
        scores: { constructionEngineering: 6 },
      },
    ],
    department: "civil",
    type: "stream",
  },
  // Automated Engineering (Mechanical) Stream Questions
  {
    id: 72,
    text: "What aspect of automated engineering do you find most interesting?",
    options: [
      {
        text: "Designing robotic systems",
        next: 73,
        scores: { automatedEngineering: 8 },
      },
      {
        text: "Automating industrial processes",
        next: 73,
        scores: { automatedEngineering: 6, manufacturing: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 73,
    text: "What type of automation projects do you prefer?",
    options: [
      {
        text: "Robotics for manufacturing",
        next: 74,
        scores: { automatedEngineering: 8 },
      },
      {
        text: "Autonomous vehicles",
        next: 74,
        scores: { automatedEngineering: 6, design: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 74,
    text: "How do you ensure efficiency in automated systems?",
    options: [
      {
        text: "Optimizing control algorithms",
        next: 75,
        scores: { automatedEngineering: 8 },
      },
      {
        text: "Integrating AI technologies",
        next: 75,
        scores: { automatedEngineering: 6 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 75,
    text: "What future trend in automated engineering excites you?",
    options: [
      { text: "Collaborative robotics", scores: { automatedEngineering: 8 } },
      { text: "AI-driven automation", scores: { automatedEngineering: 6 } },
    ],
    department: "mech",
    type: "stream",
  },
  // Design (Mechanical) Stream Questions
  {
    id: 76,
    text: "What aspect of mechanical design do you enjoy?",
    options: [
      { text: "Creating innovative products", next: 77, scores: { design: 8 } },
      {
        text: "Optimizing existing designs",
        next: 77,
        scores: { design: 6, manufacturing: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 77,
    text: "What type of design projects interest you?",
    options: [
      { text: "Consumer product design", next: 78, scores: { design: 8 } },
      {
        text: "Industrial machinery design",
        next: 78,
        scores: { design: 6, manufacturing: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 78,
    text: "How do you ensure quality in your designs?",
    options: [
      { text: "Using advanced CAD tools", next: 79, scores: { design: 8 } },
      {
        text: "Focusing on user ergonomics",
        next: 79,
        scores: { design: 6, automatedEngineering: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 79,
    text: "What future trend in design excites you?",
    options: [
      { text: "Sustainable design practices", scores: { design: 8 } },
      {
        text: "3D printing in design",
        scores: { design: 6, manufacturing: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  // Manufacturing (Mechanical) Stream Questions
  {
    id: 80,
    text: "What aspect of manufacturing do you find most interesting?",
    options: [
      {
        text: "Streamlining production processes",
        next: 81,
        scores: { manufacturing: 8 },
      },
      {
        text: "Ensuring product quality",
        next: 81,
        scores: { manufacturing: 6, design: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 81,
    text: "What type of manufacturing projects do you prefer?",
    options: [
      {
        text: "Automating production lines",
        next: 82,
        scores: { manufacturing: 8 },
      },
      {
        text: "Developing new manufacturing techniques",
        next: 82,
        scores: { manufacturing: 6, automatedEngineering: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 82,
    text: "How do you ensure efficiency in manufacturing?",
    options: [
      {
        text: "Implementing lean manufacturing",
        next: 83,
        scores: { manufacturing: 8 },
      },
      {
        text: "Using advanced robotics",
        next: 83,
        scores: { manufacturing: 6, automatedEngineering: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
  {
    id: 83,
    text: "What future trend in manufacturing excites you?",
    options: [
      { text: "Smart manufacturing", scores: { manufacturing: 8 } },
      {
        text: "Additive manufacturing",
        scores: { manufacturing: 6, design: 2 },
      },
    ],
    department: "mech",
    type: "stream",
  },
];

const departments = {
  engineering: [
    "ece",
    "electromechanical",
    "software",
    "architecture",
    "mechanical",
    "civil",
    "chemical",
    "environmental",
    "mining",
  ],
  appliedScience: [
    "industrialChemistry",
    "biotechnology",
    "foodScience",
    "geology",
  ],
};

// Define streams for each department
const departmentStreams = {
  ece: [
    "computerEngineering",
    "industrialControl",
    "communication",
    "powerEngineering",
  ],
  civil: ["hydraulicsEngineering", "constructionEngineering"],
  mech: ["automatedEngineering", "design", "manufacturing"],
};

function displayQuestion() {
  let question;
  if (quizType === "stream") {
    // For stream quiz, start directly at ID 3 and proceed to stream-specific questions
    question = questions.find(
      (q) =>
        q.id === currentQuestion &&
        q.department === selectedDepartment &&
        q.type === "stream"
    );
  } else {
    // Department quiz: only show department-specific or background questions
    question = questions.find(
      (q) => q.id === currentQuestion && (!q.type || q.type === "department")
    );
  }

  if (!question || questionCount >= maxQuestions) {
    showResult();
    return;
  }

  displayQuestionFor(question);
}

function displayQuestionFor(question) {
  document.getElementById("question").innerText = question.text;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  question.options.forEach((option) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = option.text;
    div.onclick = () => selectOption(option, div);
    optionsDiv.appendChild(div);
  });
  document.getElementById("next-btn").style.display = "block";
}

function selectOption(option, element) {
  selectedOption = option;
  document
    .querySelectorAll(".option")
    .forEach((opt) => opt.classList.remove("selected"));
  element.classList.add("selected");
  totalPossibleScore += Math.max(...Object.values(option.scores));
}

function nextQuestion() {
  if (!selectedOption) {
    alert("Please select an option!");
    return;
  }
  for (let stream in selectedOption.scores) {
    scores[stream] = (scores[stream] || 0) + selectedOption.scores[stream];
  }
  questionCount++;
  if (selectedOption.next && questionCount < maxQuestions) {
    currentQuestion = selectedOption.next;
    selectedOption = null;
    displayQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  // Filter scores to only include streams for the selected department
  const relevantStreams = departmentStreams[selectedDepartment] || [];
  const filteredScores = Object.entries(scores)
    .filter(([stream]) => relevantStreams.includes(stream))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const resultDiv = document.getElementById("result");
  if (quizType === "department") {
    const sortedScores = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    resultDiv.innerHTML = `
          <h2>Your Recommended Departments</h2>
          <ol>
              ${sortedScores
                .map(([dept, score]) => {
                  const percentage =
                    totalPossibleScore > 0
                      ? ((score / totalPossibleScore) * 100).toFixed(2)
                      : 0;
                  return `
                      <li>${formatDepartmentName(dept)} (${percentage}%)
                          - ${getDepartmentDescription(dept)}
                      </li>
                  `;
                })
                .join("")}
          </ol>
      `;
  } else if (quizType === "stream") {
    resultDiv.innerHTML = `
          <h2>Your Recommended Streams for ${formatDepartmentName(
            selectedDepartment
          )}</h2>
          <ol>
              ${filteredScores
                .map(([stream, score]) => {
                  const percentage =
                    totalPossibleScore > 0
                      ? ((score / totalPossibleScore) * 100).toFixed(2)
                      : 0;
                  return `
                      <li>${formatStreamName(stream)} (${percentage}%)
                          - ${getStreamDescription(stream)}
                      </li>
                  `;
                })
                .join("")}
          </ol>
      `;
  }
  resultDiv.style.display = "block";
  document.getElementById("quiz-container").style.display = "none";
}

function formatDepartmentName(dept) {
  const nameMap = {
    ece: "Electrical and Computer Engineering",
    electromechanical: "Electromechanical Engineering",
    software: "Software Engineering",
    architecture: "Architecture",
    mech: "Mechanical Engineering",
    civil: "Civil Engineering",
    chemical: "Chemical Engineering",
    environmental: "Environmental Engineering",
    mining: "Mining Engineering",
    industrialChemistry: "Industrial Chemistry",
    biotechnology: "Biotechnology",
    foodScience: "Food Science",
    geology: "Geology",
  };
  return nameMap[dept] || dept;
}

function getDepartmentDescription(dept) {
  const descriptions = {
    ece: "Focuses on electrical systems, circuits, computer hardware, and networking.",
    electromechanical:
      "Combines mechanical and electrical engineering for robotics and automation.",
    software: "Involves programming, software development, and IT solutions.",
    architecture:
      "Focuses on designing buildings and structures with aesthetics and functionality.",
    mech: "Deals with machinery, engines, and mechanical systems design.",
    civil: "Involves infrastructure, bridges, and urban planning.",
    chemical: "Focuses on chemical processes, materials, and production.",
    environmental:
      "Addresses sustainability, waste management, and environmental protection.",
    mining: "Centers on resource extraction and mineral processing.",
    industrialChemistry:
      "Involves chemical processes for industrial applications.",
    biotechnology: "Focuses on biological systems and genetic engineering.",
    foodScience: "Deals with food production, safety, and nutrition.",
    geology: "Studies earth processes, minerals, and environmental geology.",
  };
  return descriptions[dept] || "No description available.";
}

function formatStreamName(stream) {
  const nameMap = {
    computerEngineering: "Computer Engineering",
    industrialControl: "Industrial Control",
    communication: "Communication Engineering",
    powerEngineering: "Power Engineering",
    hydraulicsEngineering: "Hydraulics Engineering",
    constructionEngineering: "Construction Engineering",
    automatedEngineering: "Automated Engineering",
    design: "Design",
    manufacturing: "Manufacturing",
  };
  return nameMap[stream] || stream;
}

function getStreamDescription(stream) {
  const descriptions = {
    computerEngineering:
      "Focuses on designing and developing computer systems and software.",
    industrialControl:
      "Involves automation and control systems for industrial processes.",
    communication: "Covers communication networks and systems engineering.",
    powerEngineering:
      "Focuses on power system design, energy distribution, and renewable energy solutions.",
    hydraulicsEngineering:
      "Deals with water resource management and hydraulic systems.",
    constructionEngineering:
      "Focuses on planning and managing construction projects.",
    automatedEngineering: "Centers on robotics and automated system design.",
    design: "Involves creating innovative mechanical designs and components.",
    manufacturing:
      "Focuses on optimizing production processes and product manufacturing.",
  };
  return descriptions[stream] || "No description available.";
}
