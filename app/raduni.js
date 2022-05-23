const express = require('express');
const router = express.Router();
const Raduno = require('../models/raduno'); // get our mongoose model
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//----------------------------------------------------------------------------

router.post('', async (req, res) => {
		var token = req.cookies.token;
		const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

		let user = await User.findOne({
			name: payload.username
		}).exec();

		var raduno = new Raduno({
	        	title: req.body.title, //il titolo sarà univoco tra i raduni
            club: req.body.club,
            description: req.body.description,
						email: user.email
        });

        //cerca il raduno basandosi sul titolo (che è univoco)
		let findRaduno = await Raduno.findOne({
				title: req.body.title
			}).exec();

		if(findRaduno || raduno.title == "") {
			res.json({ success: false, message: 'Error.' });
		}
		else {
			raduno = await raduno.save();

	    res.json({ success: true, message: 'Event successfully created' });
		}
});

//----------------------------------------------------------------------------

router.get('', async (req, res) => {
    let tuttiRaduni = await Raduno.find({});

    tuttiRaduni = tuttiRaduni.map( (raduno) => {
        return {
            title: raduno.title,
            club: raduno.club,
            description: raduno.description,
						email: raduno.email
        };
    });
    res.status(200).json(tuttiRaduni);
});

//----------------------------------------------------------------------------

module.exports = router;
