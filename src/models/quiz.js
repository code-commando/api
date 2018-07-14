'use strict';
// const import fs from 'fs';
// var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
// import three other files containing other objects until we are done, to avoid merge conflicts

// import quizRandom from './quizRandom.js';
import superagent from 'superagent';

// export default class Quiz{
// static findOne(){
//   console.log('here were some data');
// }
//   static find(){
//     return Promise.resolve('a string');
//   }
// }

export default class Quiz {
  static findOne(day) {
    return Quiz.fetch(day);
    // process();
    // quizRandom();
    // fetch, process, magic
    // method to fetch that returns array of objects
    // method to process that data that returns an array
    // method to sort, randomize, return
  }

  static fetch(day) {
    // 1. Get a list of folders from repo. 2. Get the file contents from each quiz.json for each class before today 
    return superagent.get('https://api.github.com/repos/code-commando/sample-class/contents/')
      .then(arr => {
        let dayArr = JSON.parse(arr.text);
        let urlArr = dayArr.reduce((list, classDay) => {
          let classNum = parseInt(classDay.name.split('-')[0].replace(/^0/, ''));
          if (classNum < day) list.push(classDay.url);
          return list;
        }, []);
        let requests = [];
        for (let i = (urlArr.length - 1); i >= 0; i--) {
          console.log(urlArr[i] + '/quiz.json');
          requests.push(superagent.get(urlArr[i] + '/quiz.json'));
        }
        //return this
        Promise.all(requests).then(data => {
          data.forEach(result => {
            // ^^ for loop not forEach
            //create an array of ALL quizzes
            // we may want result.body or result.text maybe JSON parse?
            
            console.log(result);
          });
        });
      });
  }
}
// returns an array of arrays containing objects 01: [[{questions/answers}, [{questions/answers}], etc..]


//   process(){

// }


// fetchForReal(){
//   // has same reutrn and signature as above function until fetch is finished 
// }

// quizRandom(){
//   // has method that A & J are working on 


// }


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