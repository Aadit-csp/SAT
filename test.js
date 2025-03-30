// --- COMPLETE QUESTION DATA (EXAMPLE) ---
// IMPORTANT: You MUST replace these with your ACTUAL questions for each module.
// Structure: { moduleKey: [ { passage: ..., prompt: ..., options: [...], correctAnswerIndex: ... }, ... ] }

const allQuestions = {
    // Reading Set 1
    easyReading1: [
        { passage: "Reading Passage 1 for Easy Reading 1. Biodiversity loss due to invasive species is ______. Simple steps help.", prompt: "Which choice completes the text?", options: ["preventable", "undeniable", "common", "concerning"], correctAnswerIndex: 0 },
        { passage: "Reading Passage 2 for Easy Reading 1.", prompt: "What is the main idea?", options: ["A", "B", "C", "D"], correctAnswerIndex: 1 },
        // ... Add all 27 questions for Easy Reading 1
    ],
    hardReading1: [
        { passage: "Challenging Passage 1 for Hard Reading 1.", prompt: "Analyze the author's tone.", options: ["Option 1", "Option 2", "Option 3", "Option 4"], correctAnswerIndex: 2 },
        // ... Add all 27 questions for Hard Reading 1
    ],
    // Math Set 1
    easyMath1: [
        { passage: "", prompt: "Solve for x: 2x + 3 = 7", options: ["1", "2", "3", "4"], correctAnswerIndex: 1 }, // Math often has no 'passage'
        { passage: "A chart showing student scores.", prompt: "What is the average score?", options: ["75", "80", "85", "90"], correctAnswerIndex: 2 },
        // ... Add all 22 questions for Easy Math 1
    ],
    hardMath1: [
        { passage: "Diagram of a complex geometric shape.", prompt: "Calculate the shaded area.", options: ["10π", "12π", "15π", "20π"], correctAnswerIndex: 0 },
        // ... Add all 22 questions for Hard Math 1
    ],
    // Add entries for easyReading2, hardReading2, easyMath2, hardMath2, etc.
    // Make sure EACH reading module has 27 questions and EACH math module has 22.
};

// --- MODULE CONFIGURATION ---
const moduleConfig = {
    // Default (can be overridden)
    default: { time: 30 * 60, questionCount: 25, title: "Practice Module" },
    // Reading Modules
    easyReading1: { time: 32 * 60, questionCount: 27, title: "Practice Module 1: Reading" },
    hardReading1: { time: 32 * 60, questionCount: 27, title: "Practice Module 1: Reading (Hard)" },
    easyReading2: { time: 32 * 60, questionCount: 27, title: "Practice Module 2: Reading" },
    hardReading2: { time: 32 * 60, questionCount: 27, title: "Practice Module 2: Reading (Hard)" },
    easyReading3: { time: 32 * 60, questionCount: 27, title: "Practice Module 3: Reading" },
    hardReading3: { time: 32 * 60, questionCount: 27, title: "Practice Module 3: Reading (Hard)" },
    // Math Modules
    easyMath1: { time: 35 * 60, questionCount: 22, title: "Practice Module 1: Math" },
    hardMath1: { time: 35 * 60, questionCount: 22, title: "Practice Module 1: Math (Hard)" },
    easyMath2: { time: 35 * 60, questionCount: 22, title: "Practice Module 2: Math" },
    hardMath2: { time: 35 * 60, questionCount: 22, title: "Practice Module 2: Math (Hard)" },
    easyMath3: { time: 35 * 60, questionCount: 22, title: "Practice Module 3: Math" },
    hardMath3: { time: 35 * 60, questionCount: 22, title: "Practice Module 3: Math (Hard)" },
};


// --- STATE ---
let currentModuleKey = null;
let currentQuestions = [];
let currentConfig = {};
let currentQuestionIndex = 0;
let userAnswers = []; // Will be sized based on module
let userMarks = []; // To store marked questions (true/false)
let timeLeft = 0;
let timerInterval = null;
let isModalOpen = false;

// --- ELEMENTS ---
const passageTextElement = document.getElementById('passage-text');
const questionPromptElement = document.getElementById('question-prompt');
const answerOptionsListElement = document.getElementById('answer-options-list');
const questionNumberDisplayElement = document.getElementById('question-number-display');
const moduleTitleElement = document.getElementById('section-module');
const timerElement = document.getElementById('timer');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const overviewButton = document.getElementById('question-overview-button');
const overviewModal = document.getElementById('question-overview-modal');
const modalGrid = document.getElementById('modal-question-grid');
const closeModalButton = document.getElementById('close-modal-button');
const modalBackdrop = document.getElementById('modal-backdrop');
const markReviewCheckbox = document.getElementById('mark-review-checkbox'); // The checkbox input
const markReviewLabel = document.querySelector('.mark-review'); // The label container


// --- FUNCTIONS ---

function initializeModule() {
    currentModuleKey = localStorage.getItem('selectedModuleKey');
    if (!currentModuleKey || !allQuestions[currentModuleKey]) {
        console.error("Invalid or missing module key:", currentModuleKey);
        // Redirect back or show an error message
        alert("Error: Could not load the selected module. Returning to selection.");
        window.location.href = 'index.html'; // Go back to homepage
        return; // Stop execution if module is invalid
    }

    currentQuestions = allQuestions[currentModuleKey];
    currentConfig = moduleConfig[currentModuleKey] || moduleConfig.default;

    // Initialize state arrays
    userAnswers = new Array(currentConfig.questionCount).fill(null);
    userMarks = new Array(currentConfig.questionCount).fill(false);


    // Set up UI elements based on config
    moduleTitleElement.textContent = currentConfig.title;
    timeLeft = currentConfig.time;
    updateTimerDisplay(); // Show initial time
    startTimer();

    // Load the first question
    loadQuestion(0); // Start at question 0

    // Generate the modal grid structure once
    generateQuestionGrid();

    // Add initial event listeners
    setupEventListeners();
}

function setupEventListeners() {
    nextButton.addEventListener('click', handleNextClick);
    prevButton.addEventListener('click', handlePrevClick);
    overviewButton.addEventListener('click', toggleQuestionOverview);
    closeModalButton.addEventListener('click', closeQuestionOverview);
    modalBackdrop.addEventListener('click', closeQuestionOverview); // Close on backdrop click
    markReviewLabel.addEventListener('click', handleMarkForReview); // Listen on the label/icon area
}

function loadQuestion(index) {
    if (index < 0 || index >= currentConfig.questionCount) {
        console.error("Invalid question index requested:", index);
        return;
    }

    currentQuestionIndex = index;
    const question = currentQuestions[index];

    // Update Passage and Prompt (Handle empty passage for Math)
    passageTextElement.textContent = question.passage || ''; // Show empty string if no passage
    passageTextElement.style.display = question.passage ? 'block' : 'none'; // Hide element if no passage
    questionPromptElement.innerHTML = question.prompt; // Use innerHTML if prompt might contain formatting

    // Update Question Number Displays
    questionNumberDisplayElement.textContent = index + 1;
    overviewButton.innerHTML = `Question ${index + 1} of ${currentConfig.questionCount} <i class="fas fa-chevron-up"></i>`;

    // Clear previous options
    answerOptionsListElement.innerHTML = '';

    // Create and append new options
    const optionLetters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, i) => {
        const li = document.createElement('li');
        const inputId = `option${i}`;

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `answerOption_${index}`; // Unique name per question
        input.id = inputId;
        input.value = i; // Store the index as the value

        // Check if this option was previously selected
        if (userAnswers[currentQuestionIndex] === i) {
            input.checked = true;
        }

        // Add event listener to store selection and update grid
        input.addEventListener('change', () => {
            userAnswers[currentQuestionIndex] = parseInt(input.value);
            updateQuestionGrid(); // Update modal appearance
            console.log(`Q${currentQuestionIndex + 1} Answered: ${optionLetters[userAnswers[currentQuestionIndex]]}`);
        });

        const label = document.createElement('label');
        label.htmlFor = inputId;

        const letterSpan = document.createElement('span');
        letterSpan.className = 'option-letter';
        letterSpan.textContent = optionLetters[i];

        const textSpan = document.createElement('span');
        textSpan.className = 'option-text';
        textSpan.textContent = option;

        label.appendChild(letterSpan);
        label.appendChild(textSpan);
        li.appendChild(input);
        li.appendChild(label);
        answerOptionsListElement.appendChild(li);
    });

    // Update Mark for Review Checkbox state
    markReviewCheckbox.checked = userMarks[currentQuestionIndex];


    // Update Navigation Buttons State
    prevButton.disabled = (currentQuestionIndex === 0);
    nextButton.textContent = (currentQuestionIndex === currentConfig.questionCount - 1) ? 'Finish' : 'Next';

    // Update the current question highlight in the modal if it's open
    updateQuestionGrid();

    // Scroll question area to top on load (optional)
    const contentArea = document.querySelector('.question-content-area');
     if (contentArea) contentArea.scrollTop = 0;
}


function handleNextClick() {
    if (currentQuestionIndex < currentConfig.questionCount - 1) {
        loadQuestion(currentQuestionIndex + 1);
    } else {
        // End of test logic
        clearInterval(timerInterval); // Stop timer
        alert('Module Finished! Implement results/review screen here.');
        // Optionally calculate score:
        // calculateScore();
        // Redirect or show summary
         window.location.href = 'index.html'; // Go back to home for now
    }
}

function handlePrevClick() {
    if (currentQuestionIndex > 0) {
        loadQuestion(currentQuestionIndex - 1);
    }
}

function handleMarkForReview() {
    // We toggle the state based on the *current* checkbox state BEFORE the click changes it
    // Or more reliably, just toggle the stored state and update the checkbox
     const currentMarkState = userMarks[currentQuestionIndex];
     userMarks[currentQuestionIndex] = !currentMarkState;
     markReviewCheckbox.checked = userMarks[currentQuestionIndex]; // Sync checkbox display

     console.log(`Q${currentQuestionIndex + 1} Marked: ${userMarks[currentQuestionIndex]}`);
     updateQuestionGrid(); // Update modal grid immediately
}

// --- Timer Functions ---
function startTimer() {
    clearInterval(timerInterval); // Clear any existing timer
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds; // Add leading zero

    timerElement.textContent = `${minutes}:${seconds}`;

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timerInterval);
        timerElement.textContent = "0:00";
        alert("Time's up!");
        // Add logic for time running out (e.g., force submit)
         handleNextClick(); // Simulate finish or go to review
    }
}
function updateTimerDisplay() { // For showing initial time immediately
     const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    timerElement.textContent = `${minutes}:${seconds}`;
}

// --- Question Overview Modal Functions ---
function toggleQuestionOverview() {
    if (isModalOpen) {
        closeQuestionOverview();
    } else {
        openQuestionOverview();
    }
}

function openQuestionOverview() {
    updateQuestionGrid(); // Ensure grid is up-to-date before showing
    overviewModal.style.display = 'flex'; // Use flex as we set flex-direction
    modalBackdrop.style.display = 'block';
    overviewButton.classList.add('open');
    isModalOpen = true;
}

function closeQuestionOverview() {
    overviewModal.style.display = 'none';
    modalBackdrop.style.display = 'none';
    overviewButton.classList.remove('open');
    isModalOpen = false;
}

function generateQuestionGrid() {
    modalGrid.innerHTML = ''; // Clear previous grid items
    for (let i = 0; i < currentConfig.questionCount; i++) {
        const box = document.createElement('div');
        box.className = 'modal-q-box';
        box.textContent = i + 1;
        box.dataset.questionIndex = i; // Store index for click handling

        box.addEventListener('click', () => {
            loadQuestion(i);
            closeQuestionOverview(); // Close modal after selecting a question
        });

        modalGrid.appendChild(box);
    }
}

function updateQuestionGrid() {
    const boxes = modalGrid.querySelectorAll('.modal-q-box');
    boxes.forEach((box, i) => {
        // Reset classes
        box.classList.remove('q-current', 'q-answered', 'q-unanswered');
        // Remove existing bookmark icon if present
        const existingBookmark = box.querySelector('.q-bookmark-icon');
        if (existingBookmark) {
            existingBookmark.remove();
        }


        // Apply class based on answer status
        if (userAnswers[i] !== null) {
            box.classList.add('q-answered');
        } else {
            box.classList.add('q-unanswered');
        }

        // Highlight current question
        if (i === currentQuestionIndex) {
            box.classList.add('q-current');
        }

         // Add bookmark icon if marked
        if (userMarks[i]) {
             const bookmarkIcon = document.createElement('i');
             bookmarkIcon.className = 'fas fa-bookmark q-bookmark-icon';
             box.appendChild(bookmarkIcon);
        }
    });
}


// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initializeModule();
});

// --- (Optional) Score Calculation Example ---
// function calculateScore() {
//     let correctCount = 0;
//     for (let i = 0; i < currentConfig.questionCount; i++) {
//         if (userAnswers[i] === currentQuestions[i].correctAnswerIndex) {
//             correctCount++;
//         }
//     }
//     alert(`You answered ${correctCount} out of ${currentConfig.questionCount} correctly.`);
// }
