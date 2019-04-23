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
    duration: {
        type: Number,
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
    restrictions: {
        earliestTime: {
            type: Date
        },
        latestTime: {
            type: Date
        },
        location: {
          type: String
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
    },

    voting: {
       locations: {
           type: Map,
           of: Number
       },
    }

})

module.exports = Rally = mongoose.model('rally', RallySchema);
