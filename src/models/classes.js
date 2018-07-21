'use strict';

import mongoose from 'mongoose';

const classesSchema = mongoose.Schema({
  classCode: {type: String, required: true},
  canvasClassId: {type: String},
  githubRepo: {type: String, required: true},
  apiLink: {type: String},
});

classesSchema.pre('save', function(next) {
  let repo = this.githubRepo;
  this.apiLink = 'https://api.github.com/repos/' + repo.split('.com/')[1] + '/contents/';
  next();
});

classesSchema.pre('save', function(next) {
  let repo = this.githubRepo;
  this.apiLink = 'https://api.github.com/repos/' + repo.split('.com/')[1] + '/contents/';
  next();
});

export default mongoose.model('classes', classesSchema);
