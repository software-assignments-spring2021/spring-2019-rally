const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    rallies: {
        type: [String],
        required: false
    }
})

module.exports = User = mongoose.model('users', UserSchema);
