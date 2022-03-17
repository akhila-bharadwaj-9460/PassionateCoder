"use strict";
const buttonAgain = document.querySelector(".again");
const buttonCheck = document.querySelector(".check");
const outputNumber = document.querySelector(".number");
const guess = document.querySelector(".guess");
const message = document.querySelector(".message");
const score = document.querySelector(".score");
const highScore = document.querySelector(".highscore");

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let scoreValue = 20;
let highScoreValue = 0;

// outputNumber.textContent = secretNumber;

const setScoreValue = function () {
  if (scoreValue >= 1) {
    score.textContent = --scoreValue;
  } else {
    message.textContent = "You lost !!!";
  }
};

buttonCheck.addEventListener("click", function (e) {
  const guessNumber = Number(guess.value);
  if (!guessNumber) {
    message.textContent = "Please guess a number!!";
    // guess number equal to secret number
  } else if (guessNumber === secretNumber) {
    message.textContent = "Congratulations! Correct guess.";
    outputNumber.textContent = secretNumber;
    if (scoreValue > highScoreValue) {
      highScoreValue = scoreValue;
      highScore.textContent = highScoreValue;
    }
    outputNumber.style.width = "25rem";
    document.body.style.backgroundColor = "#60b347";

    // guess number greater than secret number
  } else if (guessNumber > secretNumber) {
    message.textContent = "Too High!";
    setScoreValue();

    // guess number lesser than secret number
  } else if (guessNumber < secretNumber) {
    message.textContent = "Too low!";
    setScoreValue();
  }
});

buttonAgain.addEventListener("click", function (e) {
  scoreValue = 20;
  score.textContent = scoreValue;
  message.textContent = "Start guessing...";
  outputNumber.textContent = "?";
  document.body.style.backgroundColor = "#333";
  outputNumber.style.width = "15rem";
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  guess.value = "";
});
