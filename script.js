// --- DATA ---
// Replace this with your actual questions and answers
// For the "easy upload", you would fetch this data from a server/file
const questions = [
    {
        passage: "Researchers and conservationists stress that biodiversity loss due to invasive species is ______. For example, people can take simple steps such as washing their footwear after travel to avoid introducing potentially invasive organisms into new environments.",
        prompt: "Which choice completes the text with the most logical and precise word or phrase?",
        options: [
            "preventable", // Correct Answer (Index 0)
            "undeniable",
            "common",
            "concerning"
        ],
        correctAnswerIndex: 0 // Example: A is correct
    },
    {
        passage: "The second question's passage text goes here. It might be longer or shorter.",
        prompt: "What is the primary purpose of the second sentence?",
        options: [
            "To provide an example",
            "To contradict the first sentence",
            "To introduce a new topic",
            "To summarize the passage"
        ],
        correctAnswerIndex: 0 // Example: A is correct
    },
    {
        passage: "This is the third and final question example.",
        prompt: "Choose the best option:",
        options: [
            "Option A",
            "Option B",
            "Option C",
            "Option D"
        ],
        correctAnswerIndex: 2 // Example: C is correct
    }
    // Add more question objects here
];

// --- STATE ---
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null); // To store user selections

// --- ELEMENTS ---
const passageTextElement = document.getElementById('passage-text');
const questionPromptElement = document.getElementById('question-prompt');
const answerOptionsListElement = document.getElementById('answer-options-list');
const questionNumberDisplayElement = document.getElementById('question-number-display');
const questionCounterButton = document.getElementById('question-counter-button');
const nextButton = document.getElementById('next-button');
const timerElement = document.getElementById('timer'); // Timer display
// Add elements for other controls if you implement their functionality

// --- FUNCTIONS ---

function loadQuestion(index) {
    if (index < 0 || index >= questions.length) {
        console.error("Invalid question index");
        return;
    }

    const question = questions[index];

    // Update Passage and Prompt
    passageTextElement.innerHTML = question.passage.replace('______', '<span class="blank">______</span>'); // Highlight blank visually
    questionPromptElement.textContent = question.prompt;

    // Update Question Number Displays
    questionNumberDisplayElement.textContent = index + 1;
    questionCounterButton.innerHTML = `Question ${index + 1} of ${questions.length} <i class="fas fa-chevron-up"></i>`;

    // Clear previous options
    answerOptionsListElement.innerHTML = '';

    // Create and append new options
    const optionLetters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, i) => {
        const li = document.createElement('li');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answerOption'; // Group radios
        input.id = `option${i}`;
        input.value = i; // Store the index as the value

        // Check if this option was previously selected by the user
        if (userAnswers[currentQuestionIndex] === i) {
            input.checked = true;
        }

        // Add event listener to store selection
        input.addEventListener('change', () => {
            userAnswers[currentQuestionIndex] = parseInt(input.value);
            console.log(`Question ${currentQuestionIndex + 1} Answered: ${optionLetters[userAnswers[currentQuestionIndex]]}`);
        });


        const label = document.createElement('label');
        label.htmlFor = `option${i}`;

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

    // Update Next Button Text/State
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.textContent = 'Finish'; // Or 'Review'
    } else {
        nextButton.textContent = 'Next';
    }
}

function handleNextClick() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
    } else {
        // End of test logic - e.g., show results, go to review screen
        alert('Test Finished! (Implement results screen here)');
        // You could calculate score here using userAnswers and questions[i].correctAnswerIndex
    }
}

// --- TIMER (Basic Example) ---
let timeLeft = 31 * 60 + 19; // 31 minutes 19 seconds from image
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds; // Add leading zero

    timerElement.textContent = `${minutes}:${seconds}`;

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timerInterval);
        alert("Time's up!");
        // Add logic for when time runs out
    }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion(currentQuestionIndex); // Load the first question

    // Start Timer
    const timerInterval = setInterval(updateTimer, 1000); // Update every second

    // Add Event Listeners
    nextButton.addEventListener('click', handleNextClick);

    // Add listeners for other buttons if needed (Mark for Review, Hide, etc.)
    const markReviewCheckbox = document.getElementById('mark-review-checkbox');
    if(markReviewCheckbox) {
        markReviewCheckbox.addEventListener('change', () => {
             console.log(`Question ${currentQuestionIndex + 1} Marked for review: ${markReviewCheckbox.checked}`);
             // Add visual indication or store state if needed
        });
    }
});
