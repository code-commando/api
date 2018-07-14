import express from 'express';
const router = express.Router();
import nel from 'nel';

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