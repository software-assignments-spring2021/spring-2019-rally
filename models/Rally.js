const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const RallySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owners: {
        type: [String],
        required: true
    },
    members: [String],
    dateCreated: {
        date: String
    },
    dateExpires: {
        name: String
    },
    duration: {
        type: Number
    },
    restrictions: {
        earliestTime: {
            type: String
        },
        latestTime: {
            type: String
        },
        locationSuggRadius: {
            type: Number
        },
        timeOfWeek: {
            type: String
        }
    }

})

module.exports = Rally = mongoose.model('rally', RallySchema);
