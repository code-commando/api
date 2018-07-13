// import express from 'express';
// const router = express.Router();
// import nel from 'nel';
// //const monaco = require('monaco-editor');
// // const app = express();
// // app.listen(3000);
// // app.use(router);
// // router.get('api/v1/editor',(req,res)=>{
// // //   monaco.editor.create(document.getElementById('container'), {
// // //     value: 'function hello() {\n\talert(\'Hello world!\');\n}',
// // //     language: 'javascript',
// // //   });
// //   console.log('We are here');
// //   res.send('hello');
// // });


// router.post('/api/v1/code', (req, res) => {
//   let session = new nel.Session();

//   const solution = {};

//   let onStdoutArray = [];
//   let onStderrArray = [];

//   let code = req.body.code;

//   solution.input = code;

//   session.execute(code, {
//     onSuccess: (output) => {
//       solution.return = output.mime['text/plain'];
//     },
//     onError: (output) => {
//       solution.error = output.error;
//     },
//     onStdout: (output) => {
//       onStdoutArray.push(output);
//       solution['console.log'] = onStdoutArray;
//     },
//     onStderr: (output) => {
//       onStderrArray.push(output);
//       solution['console.error'] = onStderrArray;
//     },
//     afterRun: () => {
//       res.send(solution);
//     },
//   });
// });

// export default router;