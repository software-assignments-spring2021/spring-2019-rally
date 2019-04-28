const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {google} = require('googleapis');
const jwt = require('jsonwebtoken');
//const keys = process.env;//const keys = require('../../config/keys');
const passport = require('passport');

//Load rally model
const Rally = require('../../models/Rally');
//Load user model
const User = require('../../models/User');

// @route    GET api/rally
// @desc     Return user rallies
// @access   Private
router.post('/get', passport.authenticate('jwt', { session: false }), (req, res) => {


  const errors = {};
  //console.log("user: ", req.body.id);
	Rally.find({ members: req.body.id})

		.then(rally => {
			if(rally.owners===[]) {

        console.log('There is no rally for this user');
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
router.post('/information', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

  console.log("body in GET info",req.body);
	Rally.findOne({ _id: req.body})
		.then(rally => {
			if(rally.owners===[]) {
				errors.norally = 'No rally was found';
				return res.status(404).json(errors);
			}
			res.json(rally);
		})
		.catch(err => res.status(404).json(err));
});

// @route    GET api/rally/rallyID/:rallyID
// @desc     Return a rally event page
// @access   Private
router.get('/rallyID/:rallyID', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

    if(req.params.rallyID === "rally" || req.params.rallyID === "create-rally" || req.params.rallyID === "deleteAccount"){

        return res.json();
    }

    //console.log("request params: ", req.params.rallyID);
	Rally.findOne({ _id: req.params.rallyID})
		.then(rally => {
			if(rally.owners===[]) {
				errors.norally = 'This Rally cannot be found';
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
//    const {errors, isValid} = validateRallyInput(req.body);

//    if(!isValid){
//        return res.status(400).json(errors);
//    }
      //gets the token
      const usertoken = req.headers.authorization;
      const token = usertoken.split(' ');
      const decoded = jwt.verify(token[1], 'secret');

      //checks if the id from the jwt and the owner of the rally id matches
      // if(decoded.id!==req.body.owners ) {
      //     errors.nologin = 'Please log in.';
      //     return res.status(404).json(errors);
      // }

      //sets the rally fields to be created
      const rallyFields = {};
      rallyFields.owners = [];
      rallyFields.ownerNames = [];
      rallyFields.voting = {};
      rallyFields.voting.locations = new Map();
      if(req.body.locations) rallyFields.voting.locations.set(req.body.locations, 0);
      // rallyFields.owners.push(req.body.owners);
      rallyFields.owners.push(req.user.id);
      rallyFields.ownerNames.push(req.user.name);

      if(req.body.name) rallyFields.name = req.body.name;
      rallyFields.members = [];
      rallyFields.memberNames = [];

      //TODO: put array of members from form into this array
      rallyFields.members.push(req.user.id);
      rallyFields.memberNames.push(req.user.name);

      rallyFields.restrictions = {};
      //if(req.body.displayRestrictions) rallyFields.displayRestrictions = req.body.displayRestrictions;
      if(req.body.duration) rallyFields.duration = req.body.duration;
      if(req.body.earliestTime) rallyFields.restrictions.earliestTime = req.body.earliestTime;
      if(req.body.latestTime) rallyFields.restrictions.latestTime = req.body.latestTime;

      if(req.body.startDate) rallyFields.restrictions.startDate = req.body.startDate;
      if(req.body.endDate) rallyFields.restrictions.endDate = req.body.endDate;


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
	// if(decoded.id!==req.body.user ) {
	// 	errors.nologin = 'Please log in.';
	// 	return res.status(400).json(errors);
	// }

	//find a rally to change based on id
	  Rally.findOne({ _id: req.body._id }).then(rally => {
	  	if (rally) {
	  		//set rally fields to be changed
				const rallyFields = {};
	  		if(req.body.name) rallyFields.name = req.body.name;
	  		rallyFields.members = rally.members.slice();
	  		if(!rally.members.includes(req.body.members) && !rally.members.includes(req.body.owners) && req.body.members!==undefined) {
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
	  		errors.rallyexists = 'A rally with this id does not exist';
	  		return res.status(400).json(errors);
	  }

  	})
});


// router.get('/google', (req, res) => {
// 	const oauth2Client = new google.auth.OAuth2(
// 	  process.env.clientId,
// 	  process.env.clientSecret,
// 	  'http://localhost:5000/api/rally/google/redirect'
// 	);
//
//   const authorizeUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/calendar.readonly'],
// 	});
//
// 	google.options({auth: oauth2Client});
//
// 	res.send(authorizeUrl);
// });
//
//
//
// // callback route for google to redirect to
// // hand control to passport to use code to grab profile info
// router.get('/google/redirect', (req, res) => {
// 	//console.log('you reached the redirect URI');
// 	//console.log(req.query.code);
//
// 	//Parameters for creating oAuthClient
//   const clientSecret = process.env.clientSecret;
// 	const clientId = process.env.clientId;
//   const redirectUris =['http://localhost:5000/api/rally/google/redirect'];
//
// 	//Create oAutClient
// 	const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUris[0]);
//
// 	//Authenticate
// 	google.options({auth: oauth2Client});
//
// 	//Get an access token using the code google sent us.
// 	oauth2Client.getToken(req.query.code, function (err, tokens) {
// 		// Now tokens contains an access_token and an optional refresh_token. Save them.
// 		if (!err) {
// 			oauth2Client.setCredentials(tokens);
// 			const authorizeUrl = oauth2Client.generateAuthUrl({
// 				access_type: 'offline',
// 				scope: ['https://www.googleapis.com/auth/calendar.readonly']
// 			});
//
// 			//Outh client set up, now implement basic google calendar call.
// 			const calendar = google.calendar({version: 'v3', oauth2Client});
//
// 			calendar.events.list({
// 				calendarId: 'primary',
// 				timeMin: (new Date()).toISOString(),
// 				maxResults: 10,
// 				singleEvents: true,
// 				orderBy: 'startTime',
// 			}, (err, res) => {
// 				if (err) return console.log('The API returned an error: ' + err);
// 				const events = res.data.items;
// 				if (events.length) {
// 					//console.log('Upcoming 10 events:');
// 					events.map((event, i) => {
// 						const start = event.start.dateTime || event.start.date;
// 						console.log(`${start} - ${event.summary}`);
// 					});
// 					} else {
// 					console.log('No upcoming events found.');
// 				}
// 			});
// 		} else {
// 			console.log(err);
// 		}
// 	});
//
// 	res.send('<div><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script><style>h1 {text-align:center;}p {text-align:center;}</style><div><center><h1>Thank you!</h1> <p>You may now close this page and return to Rally</p></a></center></div></div>');
// });

//------------------------

router.get('/google', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	//gets the token
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'secret');
	//console.log('you reached the redirect URI');
	//console.log(req.query.code);
	const oauth2Client = new google.auth.OAuth2(
	  process.env.clientId,
	  process.env.clientSecret,
	  'http://localhost:5000/api/rally/google/redirect'
	);

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
	});

	google.options({auth: oauth2Client});

	res.send(authorizeUrl);
});



// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	//gets the token
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'secret');
	//console.log('you reached the redirect URI');
	//console.log(req.query.code);

	//Parameters for creating oAuthClient
  const clientSecret = process.env.clientSecret;
	const clientId = process.env.clientId;
  const redirectUris =['http://localhost:5000/api/rally/google/redirect'];

	//Create oAutClient
	const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUris[0]);

	//Authenticate
	google.options({auth: oauth2Client});

	//Get an access token using the code google sent us.
	oauth2Client.getToken(req.query.code, function (err, tokens) {
		// Now tokens contains an access_token and an optional refresh_token. Save them.
		if (!err) {
			oauth2Client.setCredentials(tokens);
			const authorizeUrl = oauth2Client.generateAuthUrl({
				access_type: 'offline',
				scope: ['https://www.googleapis.com/auth/calendar.readonly']
			});

			//Outh client set up, now implement basic google calendar call.
			const calendar = google.calendar({version: 'v3', oauth2Client});

			calendar.events.list({
				calendarId: 'primary',
				timeMin: (new Date()).toISOString(),
				maxResults: 10,
				singleEvents: true,
				orderBy: 'startTime',
			}, (err, res) => {
				if (err) return console.log('The API returned an error: ' + err);
				const events = res.data.items;
				if (events.length) {
					User.findById(req.body._id)
					  .then(
							events.map((event, i) => {
								const start = event.start.dateTime || event.start.date;
								const end = event.end.dateTime || event.end.date;

								User.update(
									{id: req.body._id},
									{ $push: {
										   calendar: {
												 startTIme: start,
												 endTime: end
											 }
										}
									});
								console.log(`${start} - ${end}`);
							})
						)
				}
				else {
					console.log('No upcoming events found.');
				}
			});
		} else {
			console.log(err);
		}
	});

	res.send('<div><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script><style>h1 {text-align:center;}p {text-align:center;}</style><div><center><h1>Thank you!</h1> <p>You may now close this page and return to Rally</p></a></center></div></div>');
});

//------------------------




// voting post/get
// @route    POST api/rally/addLocations
// @desc     Update user rally by adding locations
// @access   Private
// this route is available through UI button on loaded rally page
router.post('/addLocations', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	//gets the token
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'secret');

	//checks if the id from the jwt and the owner of the rally id matches
	// if(decoded.id!==req.body.user ) {
	// 	errors.nologin = 'Please log in.';
	// 	return res.status(400).json(errors);
	// }

	//find a rally to change based on id
	  Rally.findOne({ _id: req.body._id }).then(rally => {
	  	if (rally) {
				//set rally fields to be changed
				//console.log(rally.voting.locations)
				const rallyFields = {};
				rallyFields.voting={};
				rallyFields.voting.locations= new Map();
				let it=rally.voting.locations.entries();
				let result = it.next();
				//this while populates the locations map with the current locations
				while (!result.done) {
					console.log(result.value); // 1 3 5 7 9
					rallyFields.voting.locations.set(result.value[0],0);
					result = it.next();

				 }

				//adds new locations
		  	if(!rally.voting.locations.has(req.body.locations) && req.body.locations!==null) {
				//	rallyFields.voting.locations = rally.voting.locations.slice();
		  		rallyFields.voting.locations.set(req.body.locations,0);
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
	  		errors.rallyexists = 'A rally with this id does not exist';
	  		return res.status(400).json(errors);
	  }
  	})

});

// @route    POST api/addVotes
// @desc     Update user rally by adding votes to a locatione
// @access   Private
// this route is available through UI button on loaded rally page
router.post('/addVotes', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	//gets the token
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'secret');

	//checks if the id from the jwt and the owner of the rally id matches
	// if(decoded.id!==req.body.user ) {
	// 	errors.nologin = 'Please log in.';
	// 	return res.status(400).json(errors);
	// }

	//find a rally to change based on id
	  Rally.findOne({ _id: req.body._id }).then(rally => {
	  	if (rally) {
				//set rally fields to be changed
				//console.log(rally.voting.locations)
				const rallyFields = {};
				rallyFields.voting={};
				rallyFields.voting.locations= new Map();
				let it=rally.voting.locations.entries();
				let result = it.next();
				//this while populates the locations map with the current locations
				while (!result.done) {
					console.log(result.value); // 1 3 5 7 9
					rallyFields.voting.locations.set(result.value[0],0);
					result = it.next();

				 }

				//adds new locations
		  	if(!rally.voting.locations.has(req.body.locations) && req.body.locations!==null) {
				//	rallyFields.voting.locations = rally.voting.locations.slice();
		  		rallyFields.voting.locations.set(req.body.locations,0);
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
	  		errors.rallyexists = 'A rally with this id does not exist';
	  		return res.status(400).json(errors);
	  }
  	})

});


// @route    GET api/rally
// @desc     Return locations associated with voting in a Rally
// @access   Private
router.get('/getLocations', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

	Rally.findOne({ _id: req.body._id }).then(rally => {
		if (rally) {
			console.log(Array.from(rally.voting.locations.entries()))
			res.json(Array.from(rally.voting.locations.entries()));
		}

	})
	.catch(err => res.status(404).json(err));


});



module.exports = router;
