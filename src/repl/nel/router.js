import express from 'express';
const router = express.Router();
import nel from 'nel';
import superagent from 'superagent';
import fs from 'fs';

let solution = {};
let onStdoutArray = [];

router.post('/api/v1/code', (req, res) => {
  let code = req.body.code;
  let fileName = req.body.fileName;
  let day = req.body.day;
  //const upload = multer({dest: `${__dirname}/../tmp`});
  if ( ! fileName ) { 
    return('No fileName Specified'); 
  }
  let file = `${__dirname}/../tmp/${fileName}.js`;
  console.log(file);
  let text = code;
  fs.writeFile( file, text, (err) => {
    if(err) { return(err); }
    console.log('file Saved to temp!');
  });
  let encodedBuffer = new Buffer(code);
  let base64Encoded = encodedBuffer.toString('base64');
  let githubObject = {
    'message': 'mid-term',
    'committer': {
      'name': 'MR',
      'email': 'madhu.rebbana@gmail.com',
    },
    'content': base64Encoded,
    'sha':'89194f6b0b79584a48e0e3bcd5ee01dafabd128c',
  };
  superagent.put(`https://api.github.com/repos/code-commando/sample-class/contents/01-node-ecosystem/${fileName}.js`)
    .set('Authorization', `Basic bXJlYmI6YW1tdTIzMDg=`)
    .send(githubObject)
    .then(response=>console.log(response))
    .catch(err=>console.log('error',err));
  let session = new nel.Session();
  console.log('the code -->', req.body.code);
  
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