const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const Rally = new Schema({ 
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    members: [
        String
    ],
    dateCreated: {
        startTime: String,
        endTime: String
    },
    dateExpires: {
        name: String
    },
    dateDef: {
        start: String,
        end: String
    },
})

module.exports = Rally = mongoose.model('rally', RallySchema);
