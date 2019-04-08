const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const keys = process.env;//const keys = require('../../config/keys');
const passport = require('passport');

//Load input validation
// const validateCreationInput = require('../../validation/creation');

//Load rally model
const Rally = require('../../models/Rally');
//Load user model
const User = require('../../models/User');

// @route    GET api/rally/test
// @desc     Test rally route
// @access   Public
// router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    //       newRally.save()
		// 	.then(rally => res.json(rally))
		// 	.catch(err => console.log(err));
    //     }
    // });
// })


// @route    GET api/rally/current
// @desc     Return current rally
// @access   Private
// router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
// 	res.json({
//     	name: req.rally.name,
//     	owners: req.rally.owners,
//     	members: req.rally.members,
//     	dateExpires: req.rally.dateExpires
//     });
// })

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
router.post('/create', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	  //gets the token
	  const usertoken = req.headers.authorization;
	  const token = usertoken.split(' ');
	  const decoded = jwt.verify(token[1], 'secret');

	  //checks if the id from the jwt and the owner of the rally id matches
	  if(decoded.id!==req.body.owners ) {
	  	errors.nologin = 'Please log in.';
	  	return res.status(404).json(errors);
	  }

	  //sets the rally fields to be created
	  const rallyFields = {};
	  rallyFields.owners = [];
	  rallyFields.owners.push(req.body.owners);
	  if(req.body.name) rallyFields.name = req.body.name;
	  rallyFields.members = [];
	  rallyFields.members.push(req.body.owners);

	  // Rally.findOne({ owners: rallyFields.owners }).then(rally => {
	  // 	if (rally && rally.name===rallyFields.name) {
	  // 		//throw an error that a rally with the same name already exists
	  // 		errors.rallyexists = 'A rally with the same name already exists';
	  // 		return res.status(400).json(errors);
	  // 	} else {
	  		//create a new rally
	  		new Rally(rallyFields).save().then(rally => res.json(rally));
	//   }
	// })
});

// @route    POST api/rally/update
// @desc     Update user rally
// @access   Private
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	//gets the token
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'secret');

	//checks if the id from the jwt and the owner of the rally id matches
	if(decoded.id!==req.body.owners ) {
		errors.nologin = 'Please log in.';
		return res.status(400).json(errors);
	}

	//find a rally to change based on id
	  Rally.findOne({ _id: req.body._id }).then(rally => {
	  	if (rally) {
	  		//set rally fields to be changed
	  		const rallyFields = {};
	  		if(req.body.name) rallyFields.name = req.body.name;
		  	if(!rally.owners.includes(req.body.owners)) {
		  		rallyFields.owners = rally.owners.slice();
		  		rallyFields.owners.push(req.body.owners);
		  		rallyFields.members.push(req.body.owners);
		  	}
		  	if(!rally.members.includes(req.body.members)) {
		  		rallyFields.members = rally.members.slice();
		  		rallyFields.members.push(req.body.members);
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

module.exports = router;
