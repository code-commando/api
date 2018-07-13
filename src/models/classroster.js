'use strict';

import mongoose from 'mongoose';


const StudentSchema = mongoose.Schema({
  id: {type: Number, required: true},
  name: {type: String, required: true},
  sortable_name: {type: String, required: true},
  short_name: {type: String, required: true},
});


export default mongoose.model('classroster', StudentSchema);


