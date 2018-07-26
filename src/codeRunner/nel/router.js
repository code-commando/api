import express from 'express';
const router = express.Router();
import nel from 'nel';
import superagent from 'superagent';
import compileRun from 'compile-run';
// require('../../../nock/code.js');
import fs from 'fs-extra';
import auth from '../../auth/middleware.js';
import Classes from '../../models/classes.js';

/*
Declare nel package solution object and stdOut and stdErr arrays
*/
let solution = {};
let onStdoutArray = [];
let onStderrArray = [];
var fileName;
var shaNewFile;
/*
  change following repo in future depending on github repo
 */
let fileExtension;
let dirPath = `${__dirname}/../../../code`;
router.get('/api/v1/code/:id', auth, (req, res) => {
  if(req.query.language === 'javascript'){
    fileExtension = 'js';
  }
  else if(req.query.language === 'python'){
    fileExtension = 'py';
  }
  else if(req.query.language === 'java'){
    fileExtension = 'java';
  }
  if (req.query.classCode) {
    Classes.find({
      classCode: req.query.classCode,
    })
      .then(results => {
        let dayId = req.params.id;
        return superagent.get(`${results[0].apiLink}`)
          .set({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${req.cookies.jwt}`,
          })
          .then(arr => {
            let day = arr.body[dayId - 1].url;
            return superagent.get(day)
              .set({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.cookies.jwt}`,
              })
              .then(data => {
                let filtered = data.body.filter((e) =>
                  e.name.split('.')[1] === fileExtension);
                let file = filtered.map((e) => {
                  return {
                    link: e.download_url,
                    file: e.name,
                    sha: e.sha,
                  };
                });
                res.send(file);
                res.end();
              });
          });
      });
  }
});
/**
 * 
 * POST or PUT request from front end to execute the given code and save data on github class repo
 */
router.post('/api/v1/code',auth, (req, res) => {
  let code = req.body.code;

  if(req.body.language === 'javascript'){
    fileExtension = '.js';
  }
  else if(req.body.language === 'python'){
    fileExtension = '.py';
  }
  else if(req.body.language === 'java'){
    fileExtension = '.java';
  }

  fileName = req.body.fileName || 
  new Date().toString().replace(/\s+/g, '').slice(3,18)+Math.random().toString(36).substr(2, 10)+`${fileExtension}`;
  
  //get day name information from original electron request after login and append day to github post request
  let day = req.body.day;
 
  /*
   * base 64 encoding of code recieved from front end
   */
  let encodedBuffer = new Buffer(code);
  let base64Encoded = encodedBuffer.toString('base64');

  /**
   * Build github file object
   * Change committer details
   */
  let githubObject = {
    'message': 'updated from code commando code runner',
    'committer': {
      'name': 'MR',
      'email': 'madhu.rebbana@gmail.com',
    },
    'content': base64Encoded,
  };
  if(req.body.sha){
    githubObject.sha = req.body.sha;
  }
  /*
    NEL package work starts here. Compile & execute the code and return response to client
  */
  if(req.body.language === 'javascript'){
    var session = new nel.Session();
    session.execute(code, {
      onSuccess: (output) => {
        solution.return = output.mime['text/plain'];
      },
      onError: (output) => {
        solution.error = output.error;
      },
      onStdout: (output) => {
        onStdoutArray.push(output);
        solution.log = onStdoutArray;
      },
      onStderr: (output) => {
        onStderrArray.push(output);
        solution['console.error'] = onStderrArray;
      },
      afterRun: () => {
        /**
   * Make a PUT request to github now. 'Github API considers POST and PUT both as PUT request.
   * 'POST' a new file doesn't need SHA
   * 'PUT' request is to update existing file and request body should have SHA specific to the file that you are trying to update
   */ 
        if (req.query.classCode && req.body.event === 'save') {
          Classes.find({
            classCode: req.query.classCode,
          }).then(results=>{
            superagent.put(`${results[0].apiLink}${day}/${fileName}`)
              .set({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${req.cookies.jwt}`,
              })
              .send(githubObject)
              .then(response=>{
                shaNewFile = response.body.content.sha;
                fileName = response.body.content.name;
                onStdoutArray = [];
                let outputResult = {};
                if(solution.error){
                  outputResult.error = solution.error;
                  solution.error = null;
                  outputResult.shaNewFile = shaNewFile;
                  outputResult.fileName = fileName;
                  res.send(outputResult);
                }
                else if(solution.log&& solution.return){
                  outputResult.log=solution.log ;
                  outputResult.return = solution.return;
                  solution.log = null;
                  let resultArray = outputResult.log;
                  let finalResult = resultArray.join('') +'\n' + outputResult.return;
                  let resultObject ={};
                  resultObject.output = finalResult;
                  resultObject.shaNewFile = shaNewFile;
                  resultObject.fileName = fileName;
                  res.send(resultObject);
                }
                else if(!solution.log&& solution.return){
                  outputResult.log = null;
                  outputResult.return = solution.return;
                  outputResult.shaNewFile = shaNewFile;
                  outputResult.fileName = fileName;
                  res.send(outputResult);
                }
              })
              .catch(err=>console.log('error',err));
          });
        }
        else if(req.body.event === 'run'){
          onStdoutArray = [];
          let outputResult = {};
          if(solution.error){
            outputResult.error = solution.error;
            solution.error = null;
            res.send(outputResult);
          }
          else if(solution.log&& solution.return){
            outputResult.log=solution.log ;
            outputResult.return = solution.return;
            solution.log = null;
            let resultArray = outputResult.log;
            let finalResult = resultArray.join('') +'\n' + outputResult.return;
            let resultObject ={};
            resultObject.output = finalResult;
            res.send(resultObject);
          }
          else if(!solution.log&& solution.return){
            outputResult.log = null;
            outputResult.return = solution.return;
            res.send(outputResult);
          }
        }
      },
    });
  }
  else if(req.body.language === 'python'){
    let input = null;
    var outputResult = {};
    compileRun.runPython(code, input, function (stdout, stderr, err) {
      if (req.query.classCode && req.body.event === 'save') {
        Classes.find({
          classCode: req.query.classCode,
        }).then(results=>{
          superagent.put(`${results[0].apiLink}${day}/${fileName}`)
            .set({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${req.cookies.jwt}`,
            })
            .send(githubObject)
            .then(response=>{
              shaNewFile = response.body.content.sha;
              fileName = response.body.content.name;
              outputResult.shaNewFile = shaNewFile;
              outputResult.fileName = fileName;
            });
        });
      }
      if(!stderr){
        fs.remove(dirPath,err=>{
          if (err) return console.error(err);
          console.log('Successfully removed the code dir');
        });
        outputResult.return = stdout;
        res.send(outputResult);
      }
      else{
        console.log(err);
        fs.remove(dirPath,err=>{
          if (err) return console.error(err);
          console.log('Successfully removed the code dir');
        });
        outputResult.error = stderr;
        res.send(outputResult);
      }
    });
  }
  else if(req.body.language === 'java'){
    let input = null;
    compileRun.runJava(code, input, function (stdout, stderr, err) {
      if (req.query.classCode && req.body.event === 'save') {
        Classes.find({
          classCode: req.query.classCode,
        }).then(results=>{
          superagent.put(`${results[0].apiLink}${day}/${fileName}`)
            .set({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${req.cookies.jwt}`,
            })
            .send(githubObject)
            .then(response=>{
              shaNewFile = response.body.content.sha;
              fileName = response.body.content.name;
              outputResult.shaNewFile = shaNewFile;
              outputResult.fileName = fileName;
            });
        });
      }
      if(!stderr){
        fs.remove(dirPath,err=>{
          if (err) return console.error(err);
          console.log('Successfully removed the code dir');
        });
        outputResult.return = stdout;
        res.send(outputResult);
      }
      else{
        console.log(err);
        fs.remove(dirPath,err=>{
          if (err) return console.error(err);
          console.log('Successfully removed the code dir');
        });
        outputResult.error = stderr;
        res.send(outputResult);
      }
    });
  }
});


export default router;