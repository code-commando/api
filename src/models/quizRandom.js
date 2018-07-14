'use strict';

let allQuizzes = ['apple', 'banana', 'mango', 'strawberry', 'kiwi', 'peach', 'red vines', 'blackberry', 'cherry', 'lime'];

let randomIndex = 0;

function randomQuiz () {
  let questions = [];
  let selected = [];
  let maxIndex = allQuizzes.length;
  for (let i = 0; i < 5; i++) {
    randomIndex = Math.floor((Math.random() * maxIndex));
    if (selected.includes(randomIndex)) {
      i--;
    }
    else {
      selected.push(randomIndex);
    }
  }
  for (let i = 0; i < selected.length; i++) {
    questions.push(allQuizzes[selected[i]]);
  }
  console.log(questions);    
}

randomQuiz();
