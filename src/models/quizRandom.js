'use strict';

let allQuizzes = ['apple', 'banana', 'mango', 'strawberry', 'kiwi', 'peach', 'red vines', 'blackberry', 'cherry', 'lime'];


function randomQuiz () {
  let randomIndex = 0;
  let questions = [];
  let selected = [];
  let maxIndex = allQuizzes.length;
  if (allQuizzes.length == 0){
    return undefined;
  }
  else if (allQuizzes.length < 5){
    return allQuizzes;
  }
  else {
    selected.push(Math.floor((Math.random() * 2)));
    for (let i = 0; i < 4; i++) {
      randomIndex = Math.floor((Math.random() * maxIndex));
      if (selected.includes(randomIndex)) {
        i--;
      }
      else {
        selected.push(randomIndex);
      }
    }
  }
  for (let i = 0; i < selected.length; i++) {
    questions.push(allQuizzes[selected[i]]);
  }
  console.log(questions);    
}

randomQuiz();