'use strict';

import express from 'express';
import fs from 'fs';
const authRouter = express.Router();

import oauth from './lib/oauth.js';


authRouter.get('/', (req,res, next) => {
  fs.readFile(__dirname + '/../../public/index.html', (err, data) => {
    if(err) throw err;
    res.status(200);
    res.write(data);
    res.end();
  });
});


authRouter.get('/oauth', (req, res, next) => {

  oauth.authorize(req)
    .then( user => {
      res.send(user);
    })
    .catch(next);

});

export default authRouter;
