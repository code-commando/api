'use strict';

import mongoose from 'mongoose';


const StudentSchema = mongoose.Schema({
  id: {type: Number},
  name: {type: String, required: true},
  sortable_name: {type: String},
  short_name: {type: String},
});


// StudentSchema.pre('save', () => {


// });


// export default mongoose.model('classroster', StudentSchema);
const StudenModel = mongoose.model('classroster', StudentSchema);


export default {
  find: () => {
    return StudenModel.find()
      .then(studentList => {
        let results = studentList.map(stud => {
          return stud.name;
        });
        let count = results.length;
        return {count, results};
      });
  },
};



