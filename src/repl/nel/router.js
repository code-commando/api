import express from 'express';
const router = express.Router();
import nel from 'nel';
import superagent from 'superagent';
// import fs from 'fs';

/*
Declare nel package solution object and stdOut and stdErr arrays
*/
let solution = {};
let onStdoutArray = [];
let onStderrArray = [];

router.get('/api/v1/code', (req, res) => {
/*
Send a superagent request to get the demo file(s) 
for that day (that has been previously aquired by the electron login),
and then display them to the DOM to be later dealt with for the UI team.
*/
  return superagent.get('https://api.github.com/repos/code-commando/sample-class/contents/')
    .then(arr => {
      //console.log(arr.body[0].url);
      // console.log(arr.body[0].url);
      let day1 = arr.body[0].url;
      return superagent.get(day1)
        .then(data => {
          let filtered = data.body.filter((e) => e.name.split('.')[1] === 'js');
          console.log('filtered --> ', filtered);
          let file = filtered.map((e) =>{
            return e.download_url;
          });
          console.log('file -->', file);
          res.send(file);
          res.end();
        });
    });

});



/**
 * POST or PUT request from front end to execute the given code and save data on github class repo
 */
router.post('/api/v1/code', (req, res) => {
  let code = req.body.code;
  let fileName = req.body.fileName || 
  new Date().toString().replace(/\s+/g, '').slice(3,18)+Math.random().toString(36).substr(2, 10)+'.js';
  //get day information from original electron request after login and append day to github post request
  let day = req.body.day;
  if ( ! fileName ) { 
    return('No fileName Specified'); 
  }
  /**
   * Following code is written if the code file is heavy and needs to be copied to local folder first and then stream to github. Can be used in future or scrap if no future scope is seen
   * 
   *let file = `${__dirname}/../tmp/${fileName}.js`;
    let text = code;
    fs.writeFile( file, text, (err) => {
      if(err) { return(err); }
      console.log('file Saved to temp!');
    });
   */
  /***************/
  /*
   * base 64 encoding of code recieved from front end
   */
  let encodedBuffer = new Buffer(code);
  let base64Encoded = encodedBuffer.toString('base64');

  /*
  change following sha and repo in future depending on github repo
  */
  let shaRepo = '89194f6b0b79584a48e0e3bcd5ee01dafabd128c';
  let repo = 'sample-class';
  let githubObject = {
    'message': 'commit message',
    'committer': {
      'name': 'MR',
      'email': 'madhu.rebbana@gmail.com',
    },
    'content': base64Encoded,
    'sha':shaRepo,
  };
  /**
   * Make a PUT request to github now. 'Github API considers POST and PUT both as PUT request.
   * 'POST' a new file to github requires just the SHA of Repo that you will be posting to
   * 'PUT' request to update existing file, request body should have SHA specific to the file that you are trying to update
   */ 
  superagent.put(`https://api.github.com/repos/code-commando/${repo}/contents/${day}/${fileName}`)
    .set('Authorization', `Basic bXJlYmI6YW1tdTIzMDg=`)
    .send(githubObject)
    .then(response=>console.log(response.text))
    .catch(err=>console.log('error',err));
  /*
    NEL package work starts here. Compile & execute the code and return response to client
  */
  let session = new nel.Session();
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
      onStderrArray.push(output);
      solution['console.error'] = onStderrArray;
    },
    afterRun: () => {
      res.send(solution);
    },
  });
});


export default router;