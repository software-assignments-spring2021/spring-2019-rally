const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create a schema
const RallySchema = new Schema({ 
    name: {
        type: String,
        required: true
    },
    owners: {
        type: [Schema.Types.ObjectId],
        ref: 'users',
        required: true
    },
    members: {
        type: [Schema.Types.ObjectId],
        ref: 'users'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateExpires: {
        name: String
    },

})

module.exports = Rally = mongoose.model('rally', RallySchema);
