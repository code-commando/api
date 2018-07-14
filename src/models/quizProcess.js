process() {
let newQuizArr = [];
quizArr.forEach((singleQuiz) => {
  singleQuiz.forEach((question) => {
    newQuizArr.push(question);
  })
});
}