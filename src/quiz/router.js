'use strict';

import express from 'express';
import Quiz from '../models/quiz.js';
import auth from '../auth/middleware.js';
const router = express.Router();

router.get('/api/v1/quiz/:id', auth, (req, res, next) => {
  Quiz.findOne(req.params.id, req.cookies.jwt)
    .then( data => res.send(data) )
    .catch( next );
});

export default router;

// console.log(req.query.classCode);
// Classes.find({ classCode: req.query.classCode })
//   .then(results => {
//     req.model.findOne({ _id: req.params.id }, req.cookies.jwt, results[0].apiLink)
//       .then(data => res.send(data))
//       .catch(next);