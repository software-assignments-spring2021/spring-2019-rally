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
    members: {
      type: [String]
    },
    
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
            type: Date
        },
        latestTime: {
            type: Date
        },
        locationSuggRadius: {
            type: Number
        },
        timeOfWeek: {
            type: String
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        }
    }

})

module.exports = Rally = mongoose.model('rally', RallySchema);
