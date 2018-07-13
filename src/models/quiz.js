'use strict';
// ----------------------ME---------------------------
// Desired Route: /api/v1/quiz/##
// Actual route: /api/v1/:model/:id


// router.get('/api/v1/:model', (req,res,next) => {
//   req.model.find({})
//     .then( data => sendJSON(res,data) )
//     .catch( next );
// });
// module.exports = {
//   browser: ''
// };

// router.get('/api/v1/:model/:id', (req,res,next) => {
//   req.model.findOne({_id:req.params.id})
//     .then( data => sendJSON(res,data) )
//     .catch( next );
// });
// ----------------------END ME---------------------------
// const import fs from 'fs';
// var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
// import three other files containing other objects until we are done, to avoid merge conflicts

import quizRandom from './quizRandom.js';

export default class Quiz {
  findOne(day){
    fetch();
    process();
    quizRandom();
    // fetch, process, magic
    // method to fetch that returns array of objects
    // method to process that data that returns an array
    // method to sort, randomize, return
  }

  fetch(){
    let obj = [
      {
        "question": "What year is it?",
        "answers": [
          2019,
          2018,
          2017,
          2016
        ]
      },
      {
        "question": "Who is Billy Jean?",
        "answers": [
          "Not my lover",
          "Just a girl",
          "A beauty queen",
          "All of the above"
        ]
      },
    ],
    // returns an array of arrays containing objects 01: [[{questions/answers}, [{questions/answers}], etc..]
  }

  process(){
    // do some function that flattens the JSON object into an array
    let allQuizzes = ['apple', 'banana', 'mango', 'strawberry', 'kiwi', 'peach', 'red vines', 'blackberry', 'cherry', 'lime'];
  }
  fetchForReal(){
    // has same reutrn and signature as above function until fetch is finished 
  }

  quizRandom(){
    // has method that A & J are working on 

    
  }


}
