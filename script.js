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
        question: "What is Kyria's favorite video game?",
        answers: [
            {text: "Trails in the Sky the 3rd", correct: true},
            {text: "Fire Emblem: Genealogy of the Holy War", correct: false},
            {text: "Persona 3 Portable", correct: false},
            {text: "Xenoblade Chronicles 3", correct: false},
        ]
    },
    {
        question: "What instrument does Kyria play?",
        answers: [
            {text: "Viola", correct: true},
            {text: "Violin", correct: false},
            {text: "Cello", correct: false},
            {text: "Trumpet", correct: false},
        ]
    },
    {
        question: "What is Kyria's favorite color?",
        answers: [
            {text: "Royal Blue", correct: true},
            {text: "Sky Blue", correct: false},
            {text: "Pink", correct: false},
            {text: "Navy Blue", correct: false},
        ]
    },
]


// Variables

const hex = [0, 1, 2, 3, 4, 5 , 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
const app = document.getElementById("app");
const main = document.getElementById("main")
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const startQuizBtn = document.querySelector("#btn");
let questions = null;
let currentQuestionIndex = 0;
let score = 0;

// Select quiz

function getSelectedIndex() {
    const quizSelection = document.getElementById("quiz-select");
    const selectedIndex = quizSelection.selectedIndex;
    return selectedIndex;
};

function getQuestions(selectedIndex) {
    if (selectedIndex == 1) {
        let questions = questions1.map(question => {
            let quizQuestions = {
                question: question.question,
                answers: question.answers
            };
            return quizQuestions;
        });
        return questions;
    } else if (selectedIndex == 2) {
        let questions = questions2.map(question => {
            let quizQuestions = {
                question: question.question,
                answers: question.answers
            };
            return quizQuestions;
        });
        return questions;
    }
}

// Start quiz

function startQuiz(selectedIndex) {
    main.style.display = "none";
    app.style.display = "block";
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
    questionElement.innerHTML = questionNumber + "." + currentQuestion.question;

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
};

// Return to home screen

function returnHome() {
    app.style.display = "none";
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