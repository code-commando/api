'use strict';

import mongoose from 'mongoose';


const StudentSchema = mongoose.Schema({
  id: {type: Number},
  name: {type: String, required: true},
  sortable_name: {type: String},
  short_name: {type: String},
  classCode: {type: String, required: true},
  picked: {type: Boolean, default: false},
});


// StudentSchema.pre('save', function(next) {
//   let anna = this.name.split(' ').reverse().join();
//   console.log('JEIOWOEFW', anna)
//   // this.name.split(' ').reverse().join()
//     .then(reversedName => {
//       console.log(reversedName);
//       this.sortable_name = reversedName;
//       next();
//     })
//     .catch(error => {throw error;});
// });



export default mongoose.model('classrosters', StudentSchema);

