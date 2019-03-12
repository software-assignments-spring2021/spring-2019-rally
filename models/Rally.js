const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const Rally = new Schema({ 
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

})

module.exports = Rally = mongoose.model('rally', RallySchema);
