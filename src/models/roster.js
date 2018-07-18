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


StudentSchema.pre('save', function(next) {
  this.sortable_name = this.name.split(' ').reverse().join(', ');
  let firstName = [];
  firstName.push(this.name.split(' '));
  this.short_name = firstName[0][0];
  next()
    .catch(error => {throw error;});
});


export default mongoose.model('classrosters', StudentSchema);

