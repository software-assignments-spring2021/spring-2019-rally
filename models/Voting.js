const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const Voting = new Schema({ 
    rallyIds: [
        String
    ],
    dateObjects: [ 
        {
            dates: String,
            startTime: String,
            endTime: String,
            votes: any //not sure if this is right?
        }
    ],
    location: [
        {
            location: String,
            votes: int //not sure if this is right?
        }
    ]
})

module.exports = Voting = mongoose.model('voting', VotingSchema);
