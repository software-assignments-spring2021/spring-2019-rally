const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const RallySchema = new Schema({ 
    name: {
        type: String,
        required: true
    },
    owners: [{
        type: String
    }],
    members: [{
        type: String
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateExpires: {
        name: String
    },

})

module.exports = Rally = mongoose.model('rally', RallySchema);
