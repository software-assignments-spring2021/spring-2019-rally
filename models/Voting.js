const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const VotingSchema = new Schema({ 
    rallyIds: [
        String
    ],
    dateObjects: [ 
        {
            dates: String,
            startTime: String,
            endTime: String,
            votes: int
        }
    ],
    location: [
        {
            location: String,
            votes: int
        }
    ]
})

module.exports = Voting = mongoose.model('voting', VotingSchema);
