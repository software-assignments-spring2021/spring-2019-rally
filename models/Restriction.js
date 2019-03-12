const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const RestrictionSchema = new Schema({ 
    time: {
        type: bool,
        required: true
    },
    location: {
        type: bool,
        required: true
    },
    date: {
        type: bool,
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

module.exports = Restriction = mongoose.model('restriction', RestrictionSchema);
