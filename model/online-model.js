const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  uid:{
    type: mongoose.ObjectId,
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
  },
  roomid:{
    type: mongoose.ObjectId,
    default: null
  }
});

module.exports = mongoose.model('Online', userSchema);