const express = require('express');
const router = express.Router();
const Raduno = require('../models/raduno'); // get our mongoose model
const User = require('../models/user');
const Club = require('../models/club');
const jwt = require('jsonwebtoken');

//----------------------------------------------------------------------------

router.post('/add_subscriber', async(req, res) => {
	//devo pigliarmi il raduno a cui voglio aggiungere un subscruber
	let findRaduno = await Raduno.findOne({
			title: req.body.title
		}).exec();
	
	if(!findRaduno) {
		res.json({success: false, message: 'Raduno non trovato'});
	} 
	else {
		//prendo e verifico il token
		var token = req.cookies.token;
		const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

		//mi prendo l'array del raduno trovato nel db
		var iscritti = findRaduno.subscribers;

		//controllo che l'utente non sia già iscritto
		if(iscritti.includes(payload.username)) {
			res.json({success: false, message: "Spiazze, ma l'utente che volevi aggiungere è già tra gli iscritti al raduno"});
		}
		else {
			//se non dovesse essere già iscritto
			//aggiorno l'array con lo username del nuovo iscritto
			iscritti.push(payload.username);
			
			iscritti.forEach(element => {
				console.log(element);
			});

			const filter = { title: req.body.title };
			const update = { subscribers: iscritti};

			const oldRaduno = await Raduno.updateOne(filter, update);

			res.json({success: true, message: 'Raduno modificato', raduno: oldRaduno});
		}
	}
});

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
			res.json({ success: false, message: 'Informazioni per la creazione del raduno errate' });
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
