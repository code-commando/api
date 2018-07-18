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
    return Quiz.fetch(day).then(quizzes => {
      console.log({quizzes});
      Quiz.process(quizzes);
    });
  }
  
 
  // quizRandom();
  // fetch, process, magic
  // method to fetch that returns array of objects
  // method to process that data that returns an array
  // method to sort, randomize, return
  

  static fetch(day) {
    // 1. Get a list of folders from repo. 2. Get the file contents from each quiz.json for each class before today 
    return superagent.get('https://api.github.com/repos/code-commando/sample-class/contents/')
      .then(data => {
        let dayArr = JSON.parse(data.text);
        let urlArr = dayArr.reduce((list, classDay) => {
          let classNum = parseInt(classDay.name.split('-')[0]);
          if (classNum < day) list.push(classDay.html_url);
          return list;
        }, []);
        let requests = [];
        for (let i = (urlArr.length - 1); i >= 0; i--) {
          let newUrl = urlArr[i].replace('github', 'raw.githubusercontent').replace('/blob', '').replace('/tree', '') + '/quiz.json';
          // console.log(newUrl);
          requests.push(superagent.get(newUrl));
        }

        return Promise.all(requests).then(responses => {
          let quizzes = [];
          quizzes.push(responses.map(response => JSON.parse(response.text)));
          console.log('quizzes inside map', quizzes);
          return quizzes;          
        })
          .catch(err => {
            console.log(err);
          });
      });
  }

  static process(quizArr) {
    let newQuizArr = [];
    console.log('this is what we start with', quizArr);
    quizArr.forEach((singleQuiz) => {
      singleQuiz.forEach((question) => {
        newQuizArr.push(question);
      });
      console.log(newQuizArr);
    });
  }
}


// quizRandom(){
//   // has method that A & J are working on 

// }


