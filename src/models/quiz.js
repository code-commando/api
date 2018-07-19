'use strict';

import superagent from 'superagent';

export default class Quiz {
  static findOne(day) {
    return Quiz.fetch(day).then(quizzes => {
      console.log({quizzes});
      let processed = Quiz.process(quizzes);
      const questions = Quiz.randomQuiz(processed);
      return {
        count: questions.length,
        results: questions,
      };

    });
  }
  
  static fetch(day) {
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
    quizArr.forEach((quizObj) => {
      quizObj.forEach((singleQuiz) => {
        singleQuiz.forEach((question) => {
          newQuizArr.push(question);
        });
      });
      
      
    });
    return newQuizArr;
  }

  static randomQuiz(allQuestions) {
    let randomIndex = 0;
    let questions = [];
    let selected = [];
    let maxIndex = allQuestions.length;
    if (allQuestions.length == 0) {
      return undefined;
    }
    else if (allQuestions.length < 5) {
      return allQuestions;
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
      questions.push(allQuestions[selected[i]]);
    }
    console.log(questions);
    return questions;
  }

}
