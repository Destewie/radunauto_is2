const express = require('express');
const router = express.Router();
const Raduno = require('../models/raduno'); // get our mongoose model
const User = require('../models/user');
const Club = require('../models/club');
const jwt = require('jsonwebtoken');

//----------------------------------------------------------------------------

router.post('', async (req, res) => {
  	//il token mi serve per prendere la mail dell'utente che sta facendo la richiesta
		var token = req.cookies.token;
		const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

    //prendo l'utente con username uguale a quello presente nel token
		let user = await User.findOne({
			name: payload.username
		}).exec();

		let club = await Club.findOne({
			name: req.body.club
		}).exec();

		var raduno = new Raduno({
            title: req.body.title, //il titolo sarà univoco tra i raduni
            club: req.body.club,
            description: req.body.description,
			//aggiugni iscritti
        });

    //cerca il raduno basandosi sul titolo (che è univoco)
		let findRaduno = await Raduno.findOne({
				title: req.body.title
			}).exec();

		if(findRaduno || raduno.title == "" || !club || club.owner != payload.username) {
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
			//aggiungi iscritti
        };
    });
    res.status(200).json(tuttiRaduni);
});

//----------------------------------------------------------------------------

module.exports = router;
