'use strict';

import mongoose,{Schema} from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  full_name: {type: String, required: true},
  profiles:{type:Schema.Types.ObjectId, ref: 'profiles'},
});



export default mongoose.model('', userSchema);
