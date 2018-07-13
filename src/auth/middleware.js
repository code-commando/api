'use strict';

import member from '../models/user.js';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';

// function authorize(token) {
//   let parsedToken = jwt.verify(token, process.env.APP_SECRET || 'changeit');
//   let query = { _id: parsedToken.id };
//   return this.findOne(query)
//     .then(user => { return user; })
//     .catch(error => error);
// }

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
    // let auth = {};
    let authHeader = req.headers.authorization;

    if(!authHeader) {
      return next(401);
    }

    // if(authHeader.match(/basic/i)) {

    //   let base64Header = authHeader.replace(/Basic\s+/i, '');
    //   let base64Buffer = Buffer.from(base64Header,'base64');
    //   let bufferString = base64Buffer.toString();
    //   let [username,password] = bufferString.split(':');
    //   auth = {username,password};

    //   authenticate(auth);
    // }

    else if(authHeader.match(/bearer/i)) {
      let token = authHeader.replace(/bearer\s+/i, '');
      authorize(token);
    }
  }
  catch(e) {
    next(e);
  }
};