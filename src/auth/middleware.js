'use strict';

import member from '../models/user.js';

export default (req, res, next) => {
  let authorize = (token) => {
    member.authorize(token)
      .then(user => {
        if (!user) {
          next(401);
        }
        else {
          next();
        }
      })
      .catch(next);
  };


  try {

  if(req.cookies) {
    console.log(req.cookies.jwt);
    return authorize(req.cookies.jwt);
  }
    let authHeader = req.headers.authorization;

    if(!authHeader) {
      return next(401);
    }

    else if(authHeader.match(/bearer/i)) {
      let token = authHeader.replace(/bearer\s+/i, '');
      console.log(token);

      authorize(token);
    }
  }
  catch(e) {
    next(e);
  }
};