'use strict';

import mongoose from 'mongoose';
// import userSchema from './user.js';

const classesSchema = mongoose.Schema({
  classCode: {type: String, required: true},
  canvasClassId: {type: String},
  githubRepo: {type: String, required: true},
  apiLink: {type: String},
<<<<<<< HEAD
=======
});

classesSchema.pre('save', function(next) {
  let repo = this.githubRepo;
  this.apiLink = 'https://api.github.com/repos/' + repo.split('.com/')[1] + '/contents/';
  next();
>>>>>>> 01daa098ba58af1d9840801aee3698d15aba11c5
});

classesSchema.pre('save', function(next) {
  let repo = this.githubRepo;
  this.apiLink = 'https://api.github.com/repos/' + repo.split('.com/')[1] + '/contents/';
  next();
});

export default mongoose.model('classes', classesSchema);
