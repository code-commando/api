import express from 'express';
const router = express.Router();
import nel from 'nel';
let session = new nel.Session();
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

let sendJSON = (res,data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
};
router.post('/api/v1/code', (req, res) => {
  let code = JSON.stringify(req.body.code);
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