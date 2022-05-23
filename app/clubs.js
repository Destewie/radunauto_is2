const express = require('express');
const router = express.Router();
const Club = require('../models/club'); // get our mongoose model

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
		var club = new Club({
	        name: req.body.name,
	        owner: req.body.owner
	    });

		let findClub = await Club.findOne({
				name: req.body.name
			}).exec();

		if(findClub) {
			res.json({ success: false, message: 'This club already exists.' });
		}
		else {
			club = await club.save();

	    res.json({ success: true, message: 'Club successfully created' });
		}

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    //res.location("/api/v1/user/" + userId).status(201).send();
});

module.exports = router;
