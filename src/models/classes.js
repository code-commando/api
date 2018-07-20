'use strict';

import mongoose from 'mongoose';

const classesSchema = mongoose.Schema({
  classCode: {type: String, required: true},
  canvasClassId: {type: String},
  githubRepo: {type: String, required: true},
  apiLink: {type: String},
});

export default mongoose.model('classes', classesSchema);