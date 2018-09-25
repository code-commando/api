'use strict';
import express from 'express';
import fs from 'fs';
const authRouter = express.Router();
import querystring from 'querystring';

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
    .then(results => {
      let token = results.jwt;
      let gtoken = results.gjwt;
      const query = querystring.stringify({
        token,
        gtoken,
      });
      res.redirect('http://localhost:3005/oauth/?' + query);
  
    })
    .catch(next);

});

export default authRouter;
