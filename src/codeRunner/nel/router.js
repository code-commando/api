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
/*
  change following repo in future depending on github repo
 */
let classRepo;
let fileExtension;
let dirPath = `${__dirname}/../../../code`;
router.get('/api/v1/code/:id', auth, (req, res) => {
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

            // console.log(arr.body[dayId-1].url);
            let day = arr.body[dayId - 1].url;
            return superagent.get(day)
              .then(data => {
                let filtered = data.body.filter((e) => e.name.split('.')[1] === 'js');
                //console.log('filtered --> ', filtered);
                let file = filtered.map((e) => {
                  return (e.download_url + ', file:' + e.name + ', sha: ' + e.sha);
                });
                //console.log('file -->', file);
                res.send(file);
                res.end();
              });
          });
      });
  }
});



router.post('/api/v1/code/:id', auth, (req, res) => {
  // console.log('class repo -->', classRepo);
  let code = req.body.code;

  //Change SHA of Github REPO as needed or pass it from request
  let shaRepo = '89194f6b0b79584a48e0e3bcd5ee01dafabd128c';
  let sha = req.body.sha || shaRepo;

  if (req.body.language === 'javascript') {
    fileExtension = '.js';
  } else if (req.body.language === 'python') {
    fileExtension = '.py';
  } else if (req.body.language === 'java') {
    fileExtension = '.java';
  }

  fileName = req.body.fileName ||
      new Date().toString().replace(/\s+/g, '').slice(3, 18) + Math.random().toString(36).substr(2, 10) + `${fileExtension}`;

  //get day information from original electron request after login and append day to github post request
  let day = req.body.day;
  /**
                   * Following code is written if incase the code file is heavy and needs to be copied to local folder first and then stream to github. Can be used in future or scrap if no future scope is seen
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
    'sha': sha,
  };
    /**
     * Make a PUT request to github now. 'Github API considers POST and PUT both as PUT request.
     * 'POST' a new file to github requires just the SHA of Repo that you will be posting to
     * 'PUT' request is to update existing file and request body should have SHA specific to the file that you are trying to update
     */
  superagent.put(`https://api.github.com/repos/code-commando/${classRepo}/contents/${day}/${fileName}`)
    .set({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.cookies.jwt}`,
    })
    .send(githubObject);
  // .then(response=>console.log(response.text))
  // .catch(err=>console.log('error',err));
  /*
                    NEL package work starts here. Compile & execute the code and return response to client
                  */
  if (req.body.language === 'javascript') {
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
        // session.complete(code,5);
        onStdoutArray = [];
        let outputResult = {};
        if (solution.error) {
          outputResult.error = solution.error;
          solution.error = null;
          res.send(outputResult.error);
        } else if (solution.log && !solution.return) {
          outputResult.log = solution.log;
          solution.log = null;
          res.send(outputResult);
        } else if (solution.log && solution.return) {
          outputResult.log = solution.log;
          outputResult.return = solution.return;
          solution.log = null;
          res.send(outputResult);
        } else if (!solution.log && solution.return) {
          outputResult.return = solution.return;
          res.send(outputResult.return);
        }

      },
    });
  } else if (req.body.language === 'python') {
    let input = null;
    compileRun.runPython(code, input, function (stdout, stderr, err) {
      if (!stderr) {
        fs.remove(dirPath, err => {
          if (err) return console.error(err);
          // console.log('Successfully removed the code dir');

        });
        res.send(stdout);
      } else {
        // console.log(err);
        fs.remove(dirPath, err => {
          if (err) return console.error(err);
          // console.log('Successfully removed the code dir');
        });
        res.send(stderr);
      }
    });
  } else if (req.body.language === 'java') {
    let input = null;
    compileRun.runJava(code, input, function (stdout, stderr, err) {
      if (!stderr) {
        fs.remove(dirPath, err => {
          if (err) return console.error(err);
          // console.log('Successfully removed the code dir');
        });
        res.send(stdout);
      } else {
        fs.remove(dirPath, err => {
          if (err) return console.error(err);
          // console.log('Successfully removed the code dir');
        });
        // console.log(err);
        res.send(stderr);
      }
    });
  }
});


export default router;