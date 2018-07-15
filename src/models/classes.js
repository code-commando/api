'use strict';

import mongoose from 'mongoose';
// import userSchema from './user.js';

const classesSchema = mongoose.Schema({
  classCode: {type: String, required: true},
  canvasClassId: {type: String, required: true, unique: true},
  githubRepo: {type: String, required: true,  unique: true},
//  authorizedUSers: {type: [userSchema]}, 
});

export default mongoose.model('classes', classesSchema);