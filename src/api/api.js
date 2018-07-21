'use strict';

import express from 'express';
const router = express.Router();


import modelFinder from '../middleware/modelHelper';

router.param('model', modelFinder);

import randomStudent from '../middleware/random';
import randomPairs from '../middleware/pairs';
import auth from '../auth/middleware.js';
import User from '../models/user.js';
import Classes from '../models/classes.js';

router.get('/api/v1/:model', auth, (req,res,next) => {
  if(req.params.model === 'roster') {
    if(req.query.classCode){
      req.model.find({classCode: req.query.classCode})
        .then(students => {
          let studentName = students.map(student => student.name);
          let code = students.map(student => student.classCode);
          let count = studentName.length;
          return {
            count,
            results: studentName,
            classCode: code[0],
          };
        })
        .then(data => sendJSON(res, data))
        .catch(next);
    } else {
      req.model.find({})
        .then(students => {
          let studentName = students.map(student => student.name);
          let code = students.map(student => student.classCode);
          let count = studentName.length;
          return {
            count,
            results: studentName,
            classCode: code[0],
          };
        })
        .then(data => sendJSON(res, data))
        .catch(next);
    }
  } else if (req.params.model === 'user') {
    console.log(req.user);
    req.model.findById(req.user)
      .populate('courses')
      .then(user => {
        console.log(user);
        return user;
      })
      .then(data => sendJSON(res, data));
  } else {
    req.model.find({})
      .then(data => {
        sendJSON(res, data);
      })
      .catch(next);
  }
});

router.get('/api/v1/:model/random', auth, (req, res) => {
  if(req.query.classCode) {
    req.model.find({classCode: req.query.classCode})
      .then(students => {
        let unpicked = students.filter(student => !student.picked);
        if(unpicked.length === 0) {
          req.model.updateMany({picked: true}, {picked: false})
            .then(() => {
              req.model.find({})
                .then(students => {
                  let randomS = randomStudent(students, req.model);
              
                  res.send(randomS);
                });
            });
        }
        else{
          let randomS = randomStudent(unpicked, req.model);

          res.send(randomS);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  else {
    res.send('MUST USE CLASS CODE');
  }
});


router.get('/api/v1/:model/pairs', auth, (req, res) => {
  if(req.query.classCode) {
    req.model.find({classCode: req.query.classCode})
      .then(students => {
        let studentNames = students.map(student => student.name);
        let code = students.map(student => student.classCode);
        res.send(randomPairs(studentNames, code[0]));
      })
      .catch(err => {
        console.log(err);
      });
  }
  else {
    res.send('MUST USE CLASS CODE');
  }
});


router.get('/api/v1/:model/:id', auth, (req, res, next) => {
  if (req.params.model === 'readme') {
    if (req.query.classCode) {
      console.log(req.query.classCode);
      Classes.find({ classCode: req.query.classCode })
        .then(results => {
          req.model.findOne({ _id: req.params.id }, req.cookies.jwt, results[0].apiLink)
            .then(data => res.send(data))
            .catch(next);
        });
    } else {
      next();
    }
  } else {
    req.model.findOne({ _id: req.params.id })
      .then(data => sendJSON(res, data))
      .catch(next);
  }
});

router.post('/api/v1/:model', auth, (req, res, next) => {
  console.log(req.user);
  if (req.params.model === 'classes') {
    let record = new req.model(req.body);
    record.save()
      .then(data => {
        return User.findById(req.user)
          .then(user => {
            console.log('this is the user', user);
            user.courses.push(data._id);
            user.save();
            return sendJSON(res, data);
          });
      })
      .catch(next);
  } else {
    let record = new req.model(req.body);
    record.save()
      .then(data => sendJSON(res, data))
      .catch(next);
  }
});

let sendJSON = (res, data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(data));
  res.end();
};

router.delete('/api/v1/:model/:id', auth, (req, res, next) => {
  req.model.findById(req.params.id)
    .then(data => {
      if (data === null) {
        next();
      } else {
        req.model.findByIdAndDelete(req.params.id)
          .then(() => {
            let data = `${req.params.id} has been removed`;
            sendJSON(res, data);
          })
          .catch(next);
      }
    })
    .catch(next);
});

router.put('/api/v1/:model/:id', auth, (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    next('400');
  } else {
    req.model.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((data) => {
        sendJSON(res, data);
      })
      .catch(next);
  }
});


export default router;