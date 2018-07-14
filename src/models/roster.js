'use strict';

import mongoose from 'mongoose';


const StudentSchema = mongoose.Schema({
  id: {type: Number},
  name: {type: String, required: true},
  sortable_name: {type: String},
  short_name: {type: String},
});


export default mongoose.model('classroster', StudentSchema);




