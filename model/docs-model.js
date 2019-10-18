const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name:{
      type: String,
      unique: true,
      required: true
  },
  content:{
    type: String,
    default: 'Doc Created'
  },
  created_on:{
    type: Date, 
    default: new Date()
  },
  created_by :{
    type: mongoose.ObjectId,
    required: true
  }
});
module.exports = mongoose.model('Docs', userSchema);