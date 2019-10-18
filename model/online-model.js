const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
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