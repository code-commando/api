import express from 'express';
const router = express.Router();
import nel from 'nel';
import superagent from 'superagent';

// router.get('api/v1/editor',(req,res)=>{
// //   monaco.editor.create(document.getElementById('container'), {
// //     value: 'function hello() {\n\talert(\'Hello world!\');\n}',
// //     language: 'javascript',
// //   });
//   console.log('We are here');
//   res.send('hello');
// });

let solution = {};
let onStdoutArray = [];

router.get('/api/v1/code', (req, res) => {
/*
Send a superagent request to get the demo file(s) 
for that day (that has been previously aquired by the electron login),
and then display them to the DOM to be later dealt with for the UI team.
*/
  return superagent.get('https://api.github.com/repos/code-commando/sample-class/contents/')
    .then(arr => {
      console.log(arr.body[0].url);
      let day1 = arr.body[0].url;
      return superagent.get(day1)
        .then(data => {
          let filtered = data.body.filter((e) => e.name.split('.')[1] === 'js');
          console.log('filtered --> ', filtered);
          let file = filtered.map((e) =>{
            
          });
          res.send(filtered);
        });
    });

});
































































router.post('/api/v1/code', (req, res) => {
  let session = new nel.Session();
  console.log('the code -->', req.body.code);
  let code = req.body.code;
  let fileName = req.body.fileName;
  let day = req.body.day;
  solution.input = code;
  session.execute(code, {
    onSuccess: (output) => {
      solution.return = output.mime['text/plain'];
    },
    onError: (output) => {
      solution.error = output.error;
    },
    onStdout: (output) => {
      onStdoutArray.push(output);
      solution['console.log'] = onStdoutArray;
    },
    onStderr: (output) => {
      let onStderrArray = [];
      onStderrArray.push(output);
      solution['console.error'] = onStderrArray;
    },
    afterRun: () => {
      res.send(solution);
    },
  });
});


export default router;