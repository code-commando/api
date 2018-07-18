import supertest from 'supertest';

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

  expect(response.body.count).toBe(dayNum - 1);
  const quizzes = response.body.results;
  expect(quizzes.length).toBe(dayNum - 1);
  checkQuizzes(quizzes);
}

function checkQuizzes(quizzes) {

  
  for (let quiz of quizzes) {
    expect(quiz.length).toBe(3); // at the moment
    for (let quizItem of quiz) {
      expect(quizItem.question).toBeDefined();
      expect(quizItem.correctAnswer).toBeDefined();
      if (quizItem.answers) {
        expect(quizItem.answers.includes(quizItem.correctAnswer));
      }
    }
  }

  // Need tests for below too
  // we want 5 items when quiz count > 1
  // otherwise 3
  // at least 1 should be from the most recent day E.g. asking on Friday gets at least one from Thursday


}