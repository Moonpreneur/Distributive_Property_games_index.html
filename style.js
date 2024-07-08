let playing = false;
let score = 0;
let timeRemaining = 60;
let timerInterval;
const askedQuestions = new Set();

document.getElementById("startreset").onclick = function () {
    if (playing === true) {
        location.reload();
    } else {
        playing = true;
        score = 0;
        timeRemaining = 60;
        askedQuestions.clear();
        clearInterval(timerInterval);
        generateQuestions();
        generateValues();
        startTimer();
        document.getElementById('score').innerText = `Score: ${score}`;
        document.getElementById("timeremaining").style.display = "block";
        document.getElementById('timeremainingvalue').innerHTML = timeRemaining;
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById("startreset").innerHTML = "Reset Game";
        document.getElementById("container").classList.remove("hidden");
        document.getElementById('start-image').classList.add('hidden');
        document.getElementById('reset').classList.remove('hidden');
    }
};

function startTimer() {
    timerInterval = setInterval(function () {
        timeRemaining--;
        document.getElementById('timeremainingvalue').innerText = timeRemaining;
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            document.getElementById("gameOver").innerHTML = "<p>Game Over!</p><p>Your score is " + score + ".</p>";
            document.getElementById("gameOver").style.display = "block";
            document.getElementById("timeremaining").style.display = "none";
            playing = false;
            document.getElementById("startreset").innerHTML = "Start Game";
            document.getElementById("container").classList.add("hidden");
        }
    }, 1000);
}

const firstNumber = [21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 25, 26, 27, 28, 29, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59];
const secondNumber = [2, 4, 3, 4, 2, 4, 3, 4, 2, 4, 3, 4, 2, 3, 4, 5, 2, 2, 3, 4, 5, 2, 2, 3, 4, 5, 2, 2, 4, 5, 2, 4, 2, 2, 4, 2];

function generateQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    let generatedCount = 0;
    while (generatedCount < 2 && askedQuestions.size < firstNumber.length) {
        const randomIndex = Math.floor(Math.random() * firstNumber.length);
        if (!askedQuestions.has(randomIndex)) {
            askedQuestions.add(randomIndex);
            const firstNum = firstNumber[randomIndex];
            const secondNum = secondNumber[randomIndex];
            const secondTerm = (firstNum % 10) * secondNum;
            const targetProd = firstNum * secondNum;

            const questionHTML = `
                <div class="question-container">
                    <div class="question-step">${firstNum} × ${secondNum} </div>
                    <div class="question-step">
                        = <span class="drop-zone" id="box1-${randomIndex}" ondrop="drop(event, ${randomIndex}, 'box1')" ondragover="allowDrop(event)">Drop</span> 
                        × ${secondNum} + 
                        <span class="drop-zone" id="box2-${randomIndex}" ondrop="drop(event, ${randomIndex}, 'box2')" ondragover="allowDrop(event)">Drop</span> 
                        × ${secondNum}
                    </div>
                    <div class="question-step">
                        = <span class="drop-zone" id="box3-${randomIndex}" ondrop="drop(event, ${randomIndex}, 'box3')" ondragover="allowDrop(event)">Drop</span> 
                        + ${secondTerm}
                    </div>
                    <div class="question-step">
                        = ${targetProd}
                    </div>
                    <button id="check-button-${randomIndex}" onclick="checkAnswer(${randomIndex})">Check Answer</button>
                    <span id="result${randomIndex}" style="display: none;"></span>
                </div>
            `;
            container.innerHTML += questionHTML;
            generatedCount++;
        }
    }
}

function generateValues() {
    const valuesContainer = document.getElementById('values');
    valuesContainer.innerHTML = '';

    const draggableElements = new Set();

    askedQuestions.forEach(index => {
        const draggableElement1 = firstNumber[index] - (firstNumber[index] % 10);
        const draggableElement2 = firstNumber[index] % 10;
        const draggableElement3 = (firstNumber[index] - (firstNumber[index] % 10)) * secondNumber[index];

        draggableElements.add(draggableElement1);
        draggableElements.add(draggableElement2);
        draggableElements.add(draggableElement3);
    });

    draggableElements.forEach(value => {
        const valueHTML = `
            <div class="draggable-element" draggable="true" ondragstart="drag(event)" id="draggable-${value}">
                ${value}
            </div>
        `;
        valuesContainer.innerHTML += valueHTML;
    });
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.innerText);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event, index, boxId) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const dropZone = event.target;
    dropZone.innerText = data;

    const firstNum = firstNumber[index];
    const secondNum = secondNumber[index];
    const correctValue = getCorrectValue(index, boxId);

    if (parseInt(data) === correctValue) {
        score++;
        dropZone.style.backgroundColor = "green";
    } else {
        score--;
        dropZone.style.backgroundColor = "red";
    }
    document.getElementById('score').innerText = `Score: ${score}`;
}

function getCorrectValue(index, boxId) {
    const firstNum = firstNumber[index];
    const secondNum = secondNumber[index];
    switch (boxId) {
        case 'box1':
            return firstNum - (firstNum % 10);
        case 'box2':
            return firstNum % 10;
        case 'box3':
            return (firstNum - (firstNum % 10)) * secondNum;
    }
}

function updateScore(isCorrect) {
    if (isCorrect) {
        score += 1;
    } else {
        score -= 1;
    }
    document.getElementById('score').innerText = `Score: ${score}`;
}

function checkAnswer(index) {
    const box1Value = parseInt(document.getElementById(`box1-${index}`).innerText);
    const box2Value = parseInt(document.getElementById(`box2-${index}`).innerText);
    const box3Value = parseInt(document.getElementById(`box3-${index}`).innerText);

    const firstNum = firstNumber[index];
    const secondNum = secondNumber[index];
    const draggableElement1 = firstNum - (firstNum % 10);
    const draggableElement2 = firstNum % 10;
    const draggableElement3 = (firstNum - (firstNum % 10)) * secondNum;

    const isCorrect = (box1Value === draggableElement1) &&
        (box2Value === draggableElement2) &&
        (box3Value === draggableElement3);

    const result = document.getElementById(`result${index}`);
    if (isCorrect) {
        result.style.display = 'block';
        result.innerText = '😊 Correct';
    } else {
        result.style.display = 'block';
        result.innerText = '😢 Incorrect';
    }
    updateScore(isCorrect);

    // Check if both questions are answered
    const allAnswered = Array.from(document.querySelectorAll('.drop-zone')).every(zone => zone.innerText !== 'Drop');
    if (allAnswered) {
        generateQuestions();
        generateValues();
    }
}

window.onload = function () {
    generateQuestions();
    generateValues();
};




