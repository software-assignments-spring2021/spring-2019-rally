const mongoose = require('mongoose');
const db = process.env.mongoURI;// require('../config/keys').mongoURI;

function connect() {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') {
      const Mockgoose = require('mockgoose').Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage()
          .then(() => {
            mongoose.connect(db,
                {useNewUrlParser: true, useCreateIndex: true})
                .then((res, err) => {
                  if (err) return reject(err);
                  resolve();
                });
          });
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = {connect, close};
