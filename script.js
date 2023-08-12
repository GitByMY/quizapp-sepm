// Variables

const hex = [0, 1, 2, 3, 4, 5 , 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
const app = document.getElementById('app');
const main = document.getElementById('main');
const quizSelection = document.getElementById('quiz-select');
const startQuizBtn = document.querySelector('#start-btn');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const progressBar = document.querySelector('.progress-bar');
const progressText = document.getElementById('progress-text');
let quizHeader = document.getElementById('quiz-header');
let questions = null;
let currentQuestionIndex = 0;
let completedQuestions = 0;
let progressPercent = 0;
let score = 0;


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

// Get quiz

async function getAPI(url) {
    return await fetch(url).then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error("Error");
    }, rejected => console.log(rejected)
    ).then(jsonResponse => {
        var formattedQuiz = formatData(jsonResponse);
        return formattedQuiz;
    });
}

function formatData(jsonResponse) {
    let formattedQuiz = [];
    let quiz = jsonResponse.results;
    for (questionObj of quiz) {
        formattedQuiz.push({
            question: questionObj.question,
            answers: [
                {text: questionObj.correct_answer, correct: true},
                {text: questionObj.incorrect_answers[0], correct: false},
                {text: questionObj.incorrect_answers[1], correct: false},
                {text: questionObj.incorrect_answers[2], correct: false}
            ]
        });
    }
    return formattedQuiz;
}

function getSelectedIndex() {
    if (quizSelection.selectedIndex == quizSelection.disabled) {
        startQuizBtn = startQuizBtn.disabled
    } else {
        return quizSelection.selectedIndex
    }
};

async function getQuiz(selectedIndex) {
    let url = '';
    if (selectedIndex === 1) {
        url = 'https://opentdb.com/api.php?amount=5&category=18&type=multiple';
    } else {
        url = 'https://opentdb.com/api.php?amount=5&category=23&type=multiple';
    }
    const resolved = await getAPI(url);
    quiz = resolved;
    return quiz;
}

// Start quiz

async function startQuiz(selectedIndex) {
    quizHeader.innerHTML = quizSelection[selectedIndex].text;
    questions = await getQuiz(selectedIndex);
    currentQuestionIndex = 0;
    completedQuestions = 0;
    progressText.innerText = `${completedQuestions}/${questions.length}`;
    progressPercent = 0;
    progressBar.style.width = `${progressPercent}%`;
    score = 0;
    nextButton.innerHTML = 'Next';
    main.style.display = 'none';
    changeBackground();
    app.style.display = 'block';
    randomizeAnswers(questions);
    showQuestion(questions);
}

function randomizeAnswers(questions) {
    for (question of questions) {
        let randIndx1 = Math.floor(Math.random()*question.answers.length);
        let randIndx2 = Math.floor(Math.random()*question.answers.length);
        while (randIndx2 === randIndx1) {
            randIndx2 = Math.floor(Math.random()*question.answers.length);
        }
        let randIndx3 = Math.floor(Math.random()*question.answers.length);
        while (randIndx3 === randIndx1 || randIndx3 === randIndx2) {
            randIndx3 = Math.floor(Math.random()*question.answers.length);
        }
        let randIndx4 =Math.floor(Math.random()*question.answers.length);
        while (randIndx4 === randIndx1 || randIndx4 === randIndx2 || randIndx4 === randIndx3) {
            randIndx4 = Math.floor(Math.random()*question.answers.length);
        }
        [question.answers[randIndx1], question.answers[randIndx2]] = [question.answers[randIndx2], question.answers[randIndx1]];
        [question.answers[randIndx3], question.answers[randIndx4]] = [question.answers[randIndx4], question.answers[randIndx3]];
    }
}

function showQuestion(questions) {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNumber = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNumber + '. ' + currentQuestion.question;
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add('btn');
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = 'none';
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
    } else {
        selectedBtn.classList.add('incorrect');
    }
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
        button.disabled = true;
    });
    nextButton.style.display = 'block';
}

function showScore(questions) {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = 'block';
}

function handleNextButton(questions) {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(questions);
    } else {
        showScore(questions);
    }
}

// Return to home screen

function returnHome() {
    app.style.display = 'none';
    changeBackground();
    main.style.display = 'block';
    const quizSelection = document.getElementById('quiz-select');
    quizSelection.selectedIndex = quizSelection.disabled;
}

/*
If offline while app is open, changes background color and theme color to white and displays text "Offline".
When online again, displays message saying to reopen the app.
*/

window.addEventListener('offline', function() {
    this.document.body.style.backgroundColor = '#fff';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#fff');
    this.document.body.innerText = "Offline"
});

window.addEventListener('online', function() {
    this.document.body.style.backgroundColor = '#fff';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#fff');
    this.document.body.innerText = "Online. Please reopen the app."
});

changeBackground();

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length) {
        completedQuestions++;
        if (completedQuestions <= questions.length) {
            progressText.innerText = `${completedQuestions}/${questions.length}`;
        }
        progressPercent += 20;
        progressBar.style.width = `${progressPercent}%`;
        handleNextButton(questions);
    } else {
        startQuiz(selectedIndex=getSelectedIndex());
    }
});