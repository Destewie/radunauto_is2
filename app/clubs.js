const express = require('express');
const router = express.Router();
const Club = require('../models/club'); // get our mongoose model
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const SALT_WORK_FACTOR = 10;


router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let clubs = await Club.find({});

    clubs = clubs.map( (club) => {
        return {
            name: club.name,
            owner: club.owner
        };
    });
    res.status(200).json(clubs);
});


router.post('', async (req, res) => {
    var token = req.cookies.token;
    const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

		var club = new Club({
	        name: req.body.name,
	        owner: payload.username
	    });

		let findClub = await Club.findOne({
				name: req.body.name
			}).exec();

		if(findClub || club.name == "") {
			res.json({ success: false, message: 'This club already exists o non ha un nome' });
		}
		else {
			club = await club.save();

	    res.json({ success: true, message: 'Club successfully created' });
		}
});

module.exports = router;
