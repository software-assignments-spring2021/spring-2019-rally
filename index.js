const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const DB_URI = 'mongodb://rallyDevs:agileftw@testingcluster-shard-00-00-78gbf.mongodb.net:27017,testingcluster-shard-00-01-78gbf.mongodb.net:27017,testingcluster-shard-00-02-78gbf.mongodb.net:27017/test?ssl=true&replicaSet=testingCluster-shard-0&authSource=admin&retryWrites=true';

function connect() {
 return new Promise((resolve, reject) => {

   if (process.env.NODE_ENV === 'test') {
     const Mockgoose = require('mockgoose').Mockgoose;
     const mockgoose = new Mockgoose(mongoose);

     mockgoose.prepareStorage()
       .then(() => {
         mongoose.connect(DB_URI,
           { useNewUrlParser: true, useCreateIndex: true })
           .then((res, err) => {
             if (err) return reject(err);
             resolve();
           })
       })
   }
 });
}

function close() {
 return mongoose.disconnect();
}

module.exports = { connect, close };