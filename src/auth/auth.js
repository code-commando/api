'use strict';
import superagent from 'superagent';
import express from 'express';
import fs from 'fs';
const authRouter = express.Router();

import oauth from './lib/oauth.js';

authRouter.get('/', (req, res) => {
  fs.readFile(__dirname + '/../../public/index.html', (err, data) => {
    if (err) throw err;
    res.status(200);
    res.write(data);
    res.end();
  });
});


authRouter.get('/oauth', (req, res, next) => {

  oauth.authorize(req)
    .then(token => {

      return superagent.post('http://localhost:3005/oauth')
        .send({ jwt: token })
        .then(() => {
          res.send(`SUCCESS: Please close this window`);
        });
    })
    .catch(next);

});

export default authRouter;
