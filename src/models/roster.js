'use strict';

import mongoose from 'mongoose';


const StudentSchema = mongoose.Schema({
  id: {type: Number},
  name: {type: String, required: true},
  sortable_name: {type: String},
  short_name: {type: String},
  classCode: {type: String, required: true},
});


// StudentSchema.pre('save', function(next) {
//   StudentSchema.sortable_name = StudentSchema.name.split(' ').reverse().join(' ')
//     .then(next)
//     .catch(error => {throw error;});
// });


export default mongoose.model('classroster', StudentSchema);



