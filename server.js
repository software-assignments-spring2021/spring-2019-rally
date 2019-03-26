const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const rally = require('./routes/api/rally');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

if(!(process.env.NODE_ENV === "test")) {
  //DB COnfig
  const db = process.env.mongoURI;//require('./config/keys').mongoURI;

  //Connect to DB
  mongoose
    .connect(db)
    .then(() => console.log("Mongodb connected."))
    .catch(err => console.log(err));
}

//Passport middleware
app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);

//Use routes
app.use('/api/users', users);
app.use('/api/rally', rally);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));

module.exports = app;
