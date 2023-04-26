// Quiz questions

let questions1 = [
    {
        question: "How many ASCII characters are there?",
        answers: [
            {text: "140", correct: false},
            {text: "75", correct: false},
            {text: "209", correct: false},
            {text: "128", correct: true},
        ]
    },
    {
        question: "Unicode, the standard for character encoding used to represent multilingual text as binary, is the successor of what US encoding standard?",
        answers: [
            {text: "UX", correct: false},
            {text: "ASCII", correct: true},
            {text: "DNS", correct: false},
            {text: "AMD", correct: false},
        ]
    },
    {
        question: "In Big O notation, what is the time complexity of a binary search algorithm?",
        answers: [
            {text: "O(1)", correct: false},
            {text: "O(log n)", correct: true},
            {text: "O(n)", correct: false},
            {text: "O(n * log n)", correct: false},
        ]
    },
    {
        question: "What company providing hosting for software development and distributed version control familiar to computer programmers is known for its iconic Octocat (part cat, part octopus) logo?",
        answers: [
            {text: "GitHub", correct: true},
            {text: "HubSpot", correct: false},
            {text: "React", correct: false},
            {text: "Tailwind", correct: false},
        ]
    },
    {
        question: "What British woman is considered to have written the first ever piece of computer software, developing an algorithm for Charles Babbage's theoretical Analytical Engine in the 1840s?",
        answers: [
            {text: "Margaret Hamilton", correct: false},
            {text: "Grace Hopper", correct: false},
            {text: "Ada Lovelace", correct: true},
            {text: "Joan Clarke", correct: false},
        ]
    }
];

let questions2 = [
    {
        question: "When did 4th of July celebrations first use fireworks?",
        answers: [
            {text: "1777", correct: true},
            {text: "1799", correct: false},
            {text: "1873", correct: false},
            {text: "1800", correct: false},
        ]
    },
    {
        question: "How many signatures are on the declaration of independence?",
        answers: [
            {text: "50", correct: false},
            {text: "49", correct: false},
            {text: "13", correct: false},
            {text: "56", correct: true},
        ]
    },
    {
        question: "What year did \"The Star-Spangled Banner\" become the national anthem?",
        answers: [
            {text: "1900", correct: false},
            {text: "1922", correct: false},
            {text: "1931", correct: true},
            {text: "1870", correct: false},
        ]
    },
    {
        question: "How many presidents have died in office?",
        answers: [
            {text: "8", correct: true},
            {text: "10", correct: false},
            {text: "5", correct: false},
            {text: "9", correct: false},
        ]
    },
    {
        question: "After which battle did General Robert E. Lee surrender to General Ulysses S. Grant, leading to the end of the Civil War?",
        answers: [
            {text: "Battle of Gettysburg", correct: false},
            {text: "Battle of Appomattox Court House", correct: true},
            {text: "Battle of Saratoga", correct: false},
            {text: "Siege of Charleston", correct: false},
        ]
    }
]


// Variables

const hex = [0, 1, 2, 3, 4, 5 , 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
const app = document.getElementById("app");
const main = document.getElementById("main");
const quizSelection = document.getElementById("quiz-select");
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startQuizBtn = document.querySelector("#btn");
let quizHeader = document.getElementById("quiz-header");
let questions = null;
let currentQuestionIndex = 0;
let score = 0;

// Select quiz

function getSelectedIndex() {

    if (quizSelection.selectedIndex == quizSelection.disabled) {
        startQuizBtn = startQuizBtn.disabled
    } else {
        return quizSelection.selectedIndex
    }
};

function getQuestions(selectedIndex) {
    let questions = eval("questions"+selectedIndex).map(question => {
        let quizQuestions = {
            question: question.question,
            answers: question.answers
        };
        return quizQuestions;
    });
    return questions;
}

// Start quiz

function startQuiz(selectedIndex) {
    main.style.display = "none";
    app.style.display = "block";
    quizHeader.innerHTML = quizSelection[selectedIndex].text;
    questions = getQuestions(selectedIndex);
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion(questions);
    changeBackground();
}

function showQuestion(questions) {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNumber = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNumber + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore(questions) {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton(questions) {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions);
    } else {
        showScore(questions);
    }
}

// Change background color

function getRandomNumber() {
    return Math.floor(Math.random() * hex.length);
}

function changeBackground() {
    let hexColor = '#';
    for (let i = 0; i < 6; i++) {
        hexColor += hex[getRandomNumber()];
    }
    document.body.style.backgroundColor = hexColor;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', hexColor);
};

// Return to home screen

function returnHome() {
    app.style.display = "none";
    changeBackground();
    main.style.display = "block";
    const quizSelection = document.getElementById("quiz-select");
    quizSelection.selectedIndex = quizSelection.disabled;
}


changeBackground();

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton(questions);
    } else {
        startQuiz(selectedIndex=getSelectedIndex());  // resume here
    }
});