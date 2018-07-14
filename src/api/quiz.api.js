// import Swagger from 'swagger-client'

// const Swagger = require('swagger-client')

import authRouter from './auth./auth.js';

import quizRandom from './models./quiz.js';



authRouter.get('/api/v1/:model/:id', (req,res,next) => {
  req.model.findOne({_id:req.params.id})
    .then( data => sendJSON(res,data) )
    .catch( next );
});