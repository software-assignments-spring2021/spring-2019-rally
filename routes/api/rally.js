const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load input validation
const validateCreationInput = require('../../validation/creation');

//Load rally model
const Rally = require('../../models/Rally');

// @route    GET api/rally/test
// @desc     Test rally route
// @access   Public
router.get('/test', (req, res) => res.json({msg: "Rally  works"}));

// @route    GET api/rally/create
// @desc     Create rally
// @access   Public
router.post('/register', (req, res) => {
	//Validation
    const { errors, isValid } = validateCreationInput(req.body);

    //Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    //Find by name
    Rally.findOne({ name: req.body.name })
    .then(rally => {
        if(rally) {
          errors.name = 'Rally already exists';
          return res.status(400).json({errors});
        }
        else {
          const newRally = new Rally({
            name: req.body.name,
            owners: req.body.owners.slice(0),
            members: req.body.members.slice(0),
            dateExpires: req.body.dateExpires
          });

          newRally.save()
			.then(rally => res.json(rally))
			.catch(err => console.log(err));
        }
    });
})


// @route    GET api/rally/current
// @desc     Return current rally
// @access   Private
router.get('/current', (req, res) => {
	res.json({
    	name: req.rally.name,
    	owners: req.rally.owners,
    	members: req.rally.members,
    	dateExpires: req.rally.dateExpires
    });
})

module.exports = router;