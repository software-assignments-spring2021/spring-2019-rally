const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const RallySchema = new Schema({
    time: {
        type: bool,
        required: true
    },
    location: {
        type: bool
        required: true
    },
    date: {
        type: bool
        required: true
    },
    timeDef: {
        startTime: String,
        endTime: String
    },
    locationDef: {
        name: String
    },
    dateDef: {
        start: String,
        end: String
    },
})

module.exports = Rally = mongoose.model('rally', RallySchema);
