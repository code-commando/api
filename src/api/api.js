'use strict';

import express from 'express';
const router = express.Router();

import modelFinder from '../middleware/modelHelper';
router.param('model', modelFinder);

import randomStudent from '../middleware/random';
import randomPairs from '../middleware/pairs';


router.get('/api/v1/:model', (req,res,next) => {
  if(req.params.model === 'roster') {
    req.model.find({})
      .then(data => {
        let studentName = data.map(student => student.name);
        let code = data.map(student => student.classCode);
        let count = studentName.length;
        return {
          count,
          results: studentName,
          classCode: code,
        };
      })
      .then( data => sendJSON(res,data) )
      .catch( next );
  }
  req.model.find({})
    .then( data => sendJSON(res,data) )
    .catch( next );
});


router.get('/api/v1/:model/random', (req, res) => {
  req.model.find({})
    .then(students => {
      let studentNames = students.map(student => student.name);
      let code = students.map(student => student.classCode);
      res.send(randomStudent(studentNames, code));
    });
});

router.get('/api/v1/:model/pairs', (req, res) => {
  req.model.find({})
    .then(students => {
      let studentNames = students.map(student => student.name);
      let code = students.map(student => student.classCode);
      res.send(randomPairs(studentNames, code));
    });
});


// router.get('/api/v1/roster/:classCode', (req, res, next) => {
//   req.model.find({classCode: req.params.classCode})
//     .then( data => sendJSON(res,data) )
//     .catch( next );
// });


router.get('/api/v1/:model/:id', (req,res,next) => {
  req.model.findOne({_id:req.params.id})
    .then( data => sendJSON(res,data) )
    .catch( next );
});

router.post('/api/v1/:model', (req,res,next) => {
  let record = new req.model(req.body);
  record.save()
    .then( data => sendJSON(res,data) )
    .catch( next );
});

let sendJSON = (res,data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
};

router.delete('/api/v1/:model/:id', (req, res, next) => {
  req.model.findById(req.params.id)
    .then(data => {
      if (data === null) {
        next('404');
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

router.put('/api/v1/:model/:id', (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    next('400');
  } else {
    req.model.findByIdAndUpdate(req.params.id, req.body, {new: true})
      .then((data) => {
        sendJSON(res, data);
      })
      .catch(next);

  }
});
export default router;