const express = require('express');
const router = express.Router();
const Raduno = require('../models/raduno'); // get our mongoose model

//----------------------------------------------------------------------------

router.post('', async (req, res) => {
		var raduno = new Raduno({
	        title: req.body.title, //il titolo sarà univoco tra i raduni
            club: req.body.club,
            description: req.body.description
        });

        //cerca il raduno basandosi sul titolo (che è univoco)
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
});

//----------------------------------------------------------------------------

router.get('', async (req, res) => {
    let tuttiRaduni = await Raduno.find({});

    tuttiRaduni = tuttiRaduni.map( (raduno) => {
        return {
            title: raduno.title,
            club: raduno.club,
            description: raduno.description
        };
    });
    res.status(200).json(tuttiRaduni);
});

//----------------------------------------------------------------------------

module.exports = router;
