'use strict';
// const import fs from 'fs';
// var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
// import three other files containing other objects until we are done, to avoid merge conflicts

// import quizRandom from './quizRandom.js';
import superagent from 'superagent';

const listContent = require('list-github-dir-content');
const myToken = process.env.GITHUB_TOKEN;

// export default class Quiz{
  // static findOne(){
  //   console.log('here were some data');
  // }
//   static find(){
//     return Promise.resolve('a string');
//   }
// }

export default class Quiz {
  static findOne(day){
    return Quiz.fetch();
    // process();
    // quizRandom();
    // fetch, process, magic
    // method to fetch that returns array of objects
    // method to process that data that returns an array
    // method to sort, randomize, return
  }

  static fetch(){
    // 1. Get a list of folders from repo. 2. Get the file contents from each quiz.json for each class before today 
    return superagent.get('https://github.com/Bolstad09/sample-class')
      .then(response => {
        // const filesArray = listContent.viaContentsApi('Microsoft/vscode', 'src', myToken);
        // return filesArray;
        return ['redvines'];
      })
      .catch(err => console.log(err));
    // returns an array of arrays containing objects 01: [[{questions/answers}, [{questions/answers}], etc..]
  }
}

  process(){
    let quizArr = [
      {
        'question': 'What year is it?',
        'answers': [
          2019,
          2018,
          2017,
          2016
        ]
      },
      {
        'question': 'Who is Billy Jean?',
        'answers': [
          'Not my lover',
          'Just a girl',
          'A beauty queen',
          'All of the above'
        ]
      },
      {
        "question": "What is an advantage of doing TDD?",
        "correctAnswer": "Faster development, solid code, well tested edge cases"
      }
    ]


});
    // do some function that flattens the JSON object into an array
    let allQuizzes = ['apple', 'banana', 'mango', 'strawberry', 'kiwi', 'peach', 'red vines', 'blackberry', 'cherry', 'lime'];
  }
  /*
  fetchForReal(){
    // has same reutrn and signature as above function until fetch is finished 
  }

  quizRandom(){
    // has method that A & J are working on 


  }


  // /api/v1/quiz/12 
  // Expect 5 random questions from days 1 through ##-1. 
  // Output expected:
  // {
  //   count: 5, 
  //   results: [
  //     {
  //       question: 'Some question?', 
  //       answers: [1,2,3,4],
  //       correctAnswer: '4'
  //     }, 
  //     ...
  //   ]
  // }
  // Todays goal: fetch  a /quiz.json from  each day's folder in guide repo
}
*/