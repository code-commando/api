'use strict';

import express from 'express';
import Quiz from '../models/quiz.js';

const router = express.Router();

router.get('/api/v1/quiz/:id', (req, res, next) => {
  Quiz.findOne(req.params.id)
    .then( data => res.send(data) )
    .catch( next );
});

export default router;