const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  uid:{
    type: mongoose.ObjectId,
    unique: true,
    required: true
  },
  fname:{
      type: String,
      required: true
  },
  sid:{
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model('Online', userSchema);