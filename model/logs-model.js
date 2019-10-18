const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    did: {
        type: mongoose.ObjectId,
         required: true
    },
    uid: {
        type: mongoose.ObjectId,
         required: true
    },
    sub_content : {
        type: String, 
        required:true
    },
    edited : {
        type : Date, 
        default: Date.now
    }
});
module.exports = mongoose.model('Logs', userSchema);