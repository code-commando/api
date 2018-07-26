import supertest from 'supertest';

import Quiz from '../src/models/quiz.js';

const {
  server,
} = require('../src/app.js');

const mockRequest = supertest(server);
const API_STUB = '/api/v1';


describe('quiz module', () => {

  /*
    For visual reference https://github.com/code-commando/sample-class/blob/master/01-node-ecosystem/quiz.json
    */

  it('should get day 2 content', () => {
    const dayNum = 2;
    return mockRequest
      .get(`${API_STUB}/quiz/${dayNum}`)
      .then(response => {
        checkResponse(response, dayNum);
      });
  });

  it('should get day 3 content', () => {

    const dayNum = 3;

    return mockRequest
      .get(`${API_STUB}/quiz/${dayNum}`)
      .then(response => {
        checkResponse(response, dayNum);
      });
  });
});

function checkResponse(response, dayNum) {

  let expectedCount = 5;

  if (dayNum < 3) {
    expectedCount = 3;
  }
  expect(response.body.count).toBe(expectedCount);

  const quiz = response.body.results;

  expect(quiz.length).toBe(expectedCount);

  for (let quizItem of quiz) {
    expect(quizItem.question).toBeDefined();
    expect(quizItem.correctAnswer).toBeDefined();
    if (quizItem.answers) {
      expect(quizItem.answers.includes(quizItem.correctAnswer));
    }
  }
  
  // TODO: Need tests for 
  // at least 1 should be from the most recent day E.g. asking on Friday gets at least one from Thursday
  // but cannot do that with just only the data in response

}


describe('quiz randomizer', () => {

  it('returns undefined from an array with no questions', () => {
    let randomQuestion = [];
    let randomQuiz = Quiz.randomQuiz(randomQuestion);
    expect(randomQuiz).toBe(undefined);
  });

  it('returns all questions from array if less than 5 question', () => {
    let randomQuestion = ['Who do you love?', 'Are you for sure?', 'Do tacos taste like cats'];
    let randomQuiz = Quiz.randomQuiz(randomQuestion);
    expect(randomQuiz.length).toBe(3);
  });

  it('returns different sets of random questions from an array with > 5 questions', () => {
    let randomQuestion = ['Who do you love?', 'Are you for sure?', 'Do tacos taste like cats', 'Is Autumn going to make it through the night?', 'Is Ariel going to love her new Roomba?', 'Is Tama going to win the CMAs'];
    let randomQuiz1 = Quiz.randomQuiz(randomQuestion);
    let randomQuiz2 = Quiz.randomQuiz(randomQuestion);
    expect(randomQuiz1).not.toEqual(randomQuiz2);
  });

});
