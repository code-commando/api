'use strict';

let allQuizzes = ['apple', 'banana', 'mango', 'strawberry', 'kiwi', 'peach', 'red vines', 'blackberry', 'cherry', 'lime'];

let randomIndex = 0;
let questions = [];

function randomQuiz () {
  let maxIndex = allQuizzes.length;
  for (let i = 0; i < 5; i++) {
    randomIndex = Math.floor((Math.random() * maxIndex));
    questions.push(allQuizzes[randomIndex]);
    console.log(questions);    
  }
}
