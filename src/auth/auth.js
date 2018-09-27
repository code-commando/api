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


// authRouter.get('/oauth', (req, res, next) => {

//   console.log('headers', req.headers);

//   oauth.authorize(req)
//     .then(results => {
//       let token = results.jwt;
//       let gtoken = results.gjwt;
//       res.cookie('token', token);
//       res.cookie('githubtoken', gtoken);
//       res.redirect(process.env.CLIENT_URL + `/oauth?token=${token}&githubtoken=${gtoken}`);

//     })
//     .catch(next);

// });

authRouter.get('/oauth', (req, res, next) => {

  oauth.authorize(req)
    .then(results => {

      let userAgent = req.headers['user-agent'];
      let platform = userAgent;
      platform = platform.includes('Android') || platform.includes('iPhone') ? 'mobile' : 'Web';
      if (platform === 'mobile') {
        res.redirect(`exp://172.16.0.212:19000/--/Login?gitHubToken=${results.gjwt}&authToken=${results.jwt}`);
        res.end();
      } else {

        let token = results.jwt;
        let gtoken = results.gjwt;
        res.cookie('token', token);
        res.cookie('githubtoken', gtoken);
        res.redirect(process.env.CLIENT_URL + `/oauth?token=${token}&githubtoken=${gtoken}`);

      }
    })
    .catch(next);

});

export default authRouter;