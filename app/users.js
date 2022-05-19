const express = require('express');
const router = express.Router();
const User = require('../models/user'); // get our mongoose model
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10;


router.post('', async (req, res) => {
		var user = new User({
	        username: req.body.username,
	        password: req.body.password
	    });

		let findUser = await User.findOne({
				username: req.body.username
			}).exec();

		if(findUser) {
			res.json({ success: false, message: 'This username is used.' });
		}
		else {
			const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);

			var hash = await bcrypt.hash(user.password, salt);

			user.password = hash;

			user = await user.save();

	    let userId = user.id;

	    console.log('User saved successfully');
		}

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    //res.location("/api/v1/user/" + userId).status(201).send();
});

module.exports = router;
