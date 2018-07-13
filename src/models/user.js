'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true },
  jwt: { type: String, required: true },
});

userSchema.pre('save', function (next) {
  bcrypt.hash(this.jwt, 10)
    .then(hashed => {
      this.jwt = hashed;
      next();
    })
    .catch(err => { throw err; });
});

userSchema.statics.createFromOAuth = function (gitHubUser) {
  if (!gitHubUser || !gitHubUser.user) {
    return Promise.reject('VALIDATION ERROR: missing username/email or password');
  }

  return this.findOne({ user: gitHubUser.user })
    .then(found => {
      if (!found) { throw new Error('User Not Found'); }
      console.log('Welcome Back!', found.username);
      return found;
    })
    .catch((error) => {
      console.log(error);
      let user = gitHubUser.user;
      let jwt = gitHubUser.jwt;
      return this.create({
        user: user,
        jwt: jwt,
      });
    });
};

userSchema.methods.passwordCheck = function (jwt) {
  return bcrypt.compare(jwt, this.jwt)
    .then(response => {
      return response ? this : null;
    });
};

userSchema.methods.generateToken = function() {
  return jwt.sign({id:this._id}, process.env.APP_SECRET || 'ASKDjl1k2312lkjlakjLKSDJ9lk12j3oal2');
};

userSchema.statics.authorize = function(token) {
  let user = jwt.verify(token, process.env.APP_SECRET || 'ASKDjl1k2312lkjlakjLKSDJ9lk12j3oal2');
  return this.findOne({_id: user.id})
    .then(user => {
      return user; 
    })
    .catch(err => { throw err; } );
};

export default mongoose.model('User', userSchema);