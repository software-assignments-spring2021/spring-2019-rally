const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
//const keys = process.env;//const keys = require('../../config/keys');
const passport = require('passport');

//Load rally model
const Rally = require('../../models/Rally');
//Load user model
const User = require('../../models/User');

// @route    GET api/rally
// @desc     Return user rallies
// @access   Private
router.get('/get', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

	Rally.find({ members: req.body.user})
		.then(rally => {
			if(rally.owners===[]) {
				errors.norally = 'There is no rally for this user';
				return res.status(404).json(errors);
			}
			res.json(rally);
		})
		.catch(err => res.status(404).json(err));
});

// @route    GET api/rally/information
// @desc     Return rally information
// @access   Private
router.get('/information', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

	Rally.findOne({ _id: req.body._id})
		.then(rally => {
			if(rally.owners===[]) {
				errors.norally = 'No rally was found';
				return res.status(404).json(errors);
			}
			res.json(rally);
		})
		.catch(err => res.status(404).json(err));
});

// @route    POST api/rally/create
// @desc     Create user rally
// @access   Private
// route through which Rally Creation UI form connects to DB
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {

    //console.log("inside post")
	const {errors, isValid} = validateRallyInput(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }
	  //gets the token
	  const usertoken = req.headers.authorization;
	  const token = usertoken.split(' ');
	  const decoded = jwt.verify(token[1], 'secret');

	  //checks if the id from the jwt and the owner of the rally id matches
	  // if(decoded.id!==req.body.owners ) {
	  // 	errors.nologin = 'Please log in.';
	  // 	return res.status(404).json(errors);
	  // }

	  //sets the rally fields to be created
	  const rallyFields = {};
	  rallyFields.owners = [];
	  rallyFields.owners.push(req.body.owners);
      rallyFields.owners.push(req.user.id);
	  if(req.body.name) rallyFields.name = req.body.name;
	  rallyFields.members = [];
	  rallyFields.members.push(req.body.owners);
    rallyFields.restrictions = {};
    //if(req.body.displayRestrictions) rallyFields.displayRestrictions = req.body.displayRestrictions;
    if(req.body.duration) rallyFields.duration = req.body.duration;
    if(req.body.earliestTime) rallyFields.restrictions.earliestTime = req.body.earliestTime;
    if(req.body.latestTime) rallyFields.restrictions.latestTime = req.body.latestTime;
    if(req.body.location) rallyFields.restrictions.location = req.body.location;
    if(req.body.timeOfWeek) rallyFields.restrictions.timeOfWeek = req.body.timeOfWeek;
    if(req.body.locationSuggRadius) rallyFields.restrictions.locationSuggRadius = req.body.locationSuggRadius;

      //create a new rally
	  new Rally(rallyFields).save().then(rally => res.json(rally));
});

// @route    POST api/rally/update
// @desc     Update user rally
// @access   Private
// this route is available through UI button on loaded rally page
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	//gets the token
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'secret');

	//checks if the id from the jwt and the owner of the rally id matches
	if(decoded.id!==req.body.user ) {
		errors.nologin = 'Please log in.';
		return res.status(400).json(errors);
	}

	//find a rally to change based on id
	  Rally.findOne({ _id: req.body._id }).then(rally => {
	  	if (rally) {
	  		//set rally fields to be changed
	  		const rallyFields = {};
	  		if(req.body.name) rallyFields.name = req.body.name;
	  		rallyFields.members = rally.members.slice();
	  		if(!rally.members.includes(req.body.members) && req.body.members !== undefined) {
		  		rallyFields.members.push(req.body.members);
		  	}
		  	if(!rally.owners.includes(req.body.owners) && req.body.owners !== undefined) {
		  		rallyFields.owners = rally.owners.slice();
		  		rallyFields.owners.push(req.body.owners);
		  		rallyFields.members.push(req.body.owners);
		  	}

			//find rally and update it
	  		Rally.findOneAndUpdate(
			{ _id: rally._id },
			{ $set: rallyFields },
			{ new: true }
			).then(rally => res.json(rally));
	  		rally => res.json(rally);

	  	} else {
	  		//throw an error that a rally with name does not exist
	  		errors.rallyexists = 'A rally with this name does not exist';
	  		return res.status(400).json(errors);
	  }
  	})
});

// @route    POST api/rally/update
// @desc     Update user rally
// @access   Private
// Requires Authorization, _id (rallyId), userId, newMember (Member to be invite and added in database) 
// this route is available through UI button on loaded rally page
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

	//gets the token
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'secret');

	//checks if the id from the jwt and the owner of the rally id matches
	if(decoded.id!==req.body.user ) {
		errors.nologin = 'Please log in.';
		return res.status(400).json(errors);
	}
	
	else {
		//Message to be sent
		const output = `
			<p>You have a new contact request</p>
			<h3>Contact Details</h3>
	
			<h3>Message</h3>
			<p>"Hey, you have been invited for a rally. Clink <a href="localhost:3000">here</a> to join it!!! "</p>
		`;

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
					user: process.env.rallyEmail, // generated ethereal user
					pass: process.env.rallyPassword  // generated ethereal password
			}
		});

		// setup email data with unicode symbols
		let mailOptions = {
				from: 'rally.agile.info@gmail.com', // sender address
				to: req.body.newMember, // list of receivers
				subject: 'New Rally By Your Friends!!', // Subject line
				text: 'Hello world?', // plain text body
				html: output // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
						return console.log(error);
				}
				console.log('Message sent: %s', info.messageId);   
				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		});

		//find rally and add the newMember in database.
		Rally.findByIdAndUpdate(
			{ _id: rally._id },
			{ $push: {members: req.body.newMember} },
			{ new: true }
			).then(rally => res.json(rally));
	}
});



module.exports = router;
