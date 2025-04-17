let timerInterval;
const totalAllowedTime = 10 * 60; // 10 minutes in seconds

function startTimer() {
    const timerElement = document.getElementById('timer');

    let endTime = localStorage.getItem("quizEndTime");

    if (!endTime) {
        // Set the end time only once
        endTime = Date.now() + totalAllowedTime * 1000;
        localStorage.setItem("quizEndTime", endTime);
    } else {
        endTime = parseInt(endTime);
    }

    timerInterval = setInterval(() => {
        const now = Date.now();
        let remainingTime = Math.floor((endTime - now) / 1000);

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "Time Left: 00:00";
            alert("Time's up!");
            document.getElementById("quiz-frame").style.display = "none";
            return;
        }

        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;
        timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }, 1000);
}

function lockQuiz() {
    localStorage.setItem('quizLocked', 'true');
    document.getElementById("quiz-frame").style.display = "none";
    document.getElementById("lock-screen").style.display = "block";

    document.getElementById("passkey-input").value = "";
    document.getElementById("error-msg").textContent = "";
}

function unlockQuiz() {
    localStorage.setItem('quizLocked', 'false');
    document.getElementById("quiz-frame").style.display = "block";
    document.getElementById("lock-screen").style.display = "none";
}

function checkPasskey() {
    const input = document.getElementById("passkey-input").value;
    const errorMsg = document.getElementById("error-msg");

    if (input === "quiz123") {
        unlockQuiz();
        errorMsg.textContent = "";
    } else {
        errorMsg.textContent = "Incorrect passkey.";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    startTimer();

    if (localStorage.getItem('quizLocked') === 'true') {
        lockQuiz();
    }

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            lockQuiz(); // Lock immediately on tab switch
        }
    });
});
