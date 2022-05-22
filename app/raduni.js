const express = require('express');
const router = express.Router();
const Raduno = require('../models/raduno'); // get our mongoose model

router.post('', async (req, res) => {
		var raduno = new Raduno({
	        title: req.body.title,
	    });

		let findRaduno = await Raduno.findOne({
				title: req.body.title
			}).exec();

		if(findRaduno) {
			res.json({ success: false, message: 'This event already exists.' });
		}
		else {
			raduno = await raduno.save();

	    res.json({ success: true, message: 'Event successfully created' });
		}

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    //res.location("/api/v1/user/" + userId).status(201).send();
});

module.exports = router;
