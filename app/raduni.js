const express = require('express');
const router = express.Router();
const Raduno = require('../models/raduno'); // get our mongoose model
const User = require('../models/user');
const Club = require('../models/club');
const jwt = require('jsonwebtoken');

//----------------------------------------------------------------------------

//ISCRIVE AL RADUNO L'UTENTE CHE FA LA RICHIESTA
router.post('/add_subscriber', async (req, res) => {
	//devo pigliarmi il raduno a cui voglio aggiungere un subscruber
	let findRaduno = await Raduno.findOne({
		title: req.body.title
	}).exec();

	if (!findRaduno) {
		res.status(404).json({ success: false, message: 'Raduno non trovato' });
	}
	else {
		//prendo e verifico il token
		var token = req.cookies.token;
		const payload = jwt.verify(token, process.env.SUPER_SECRET, { ignoreExpiration: true });

		//mi prendo l'array del raduno trovato nel db
		var iscritti = findRaduno.subscribers;

		//controllo che l'utente non sia già iscritto
		if (iscritti.includes(payload.username)) {
			res.status(400).json({ success: false, message: "Spiazze, ma l'utente che volevi aggiungere è già tra gli iscritti al raduno" });
		}
		else {
			//se non dovesse essere già iscritto
			//aggiorno l'array con lo username del nuovo iscritto
			iscritti.push(payload.username);

			iscritti.forEach(element => {
				console.log(element);
			});

			const filter = { title: req.body.title };
			const update = { subscribers: iscritti };

			const oldRaduno = await Raduno.updateOne(filter, update);

			res.status(200).json({ success: true, message: 'Raduno modificato', raduno: oldRaduno });
		}
	}
});

//----------------------------------------------------------------------------

//AGGIUNGE UN RADUNO
router.post('', async (req, res) => {
	//il token mi serve per prendere la mail dell'utente che sta facendo la richiesta
	var token = req.cookies.token;
	const payload = jwt.verify(token, process.env.SUPER_SECRET, { ignoreExpiration: true });

	console.log("username: " + payload.username);

	let clubFound = await Club.findOne({
		name: req.body.club
	}).exec();

	var raduno = new Raduno({
		title: req.body.title, //il titolo sarà univoco tra i raduni
		manager: payload.username, //l'organizzatore è l'utente che ha fatto la richiesta
		club: req.body.club,
		description: req.body.description,
		datetime: req.body.datetime
		//aggiugni iscritti
	});

	//cerca il raduno basandosi sul titolo (che è univoco)
	let findRaduno = await Raduno.findOne({
		title: req.body.title
	}).exec();

	if (findRaduno || raduno.title == "" || !clubFound || clubFound.owner != payload.username) {
		res.status(400).json({ success: false, message: 'Informazioni per la creazione del raduno errate' });
	}
	else {
		raduno = await raduno.save();
		res.status(201).json({ success: true, message: 'Event successfully created' });
	}
});

//----------------------------------------------------------------------------

//ritorna gli iscritti ad un particolare raduno
router.get('/subscribers', async (req, res) => {

	//mi prendo il token e controllo che sia valido
	var token = req.cookies.token;
	if (token == null) {
		res.json({ success: false, message: 'Non sei loggato' });
		return;
	} 
	const payload = jwt.verify(token, process.env.SUPER_SECRET, { ignoreExpiration: true });

	if (req.query.titoloRaduno) {
		//mi prendo il raduno da cui devo estrarre gli iscritti
		let radunoFound = await Raduno.findOne({
			title: req.query.titoloRaduno
		}).exec();

		//mi vado a prendere il club organizzatore del raduno per vedere chi è il suo owner
		let ClubFound = await Club.findOne({
			name: radunoFound.club
		}).exec();


		if (!radunoFound) {
			//se non ha trovato il raduno
			res.status(404).json({ success: false, message: 'Raduno non trovato' });
		}
		else if (radunoFound.manager != payload.username && ClubFound.owner != payload.username) {
			//se l'utente non è il manager del raduno e non è il proprietario del club
			res.status(403).json({ success: false, message: 'Non sei autorizzato a vedere gli iscritti a questo raduno' });
		}
		else {
			res.status(200).json({ success: true, owner: radunoFound.owner, nomeClub: radunoFound.name, subscribers: radunoFound.subscribers });
		}
	}
	else {
		//se non ha specificato il titolo del raduno nella URL
		res.status(400).json({ success: false, message: 'Nessun club specificato nei parametri della URL' });
	}
});

//----------------------------------------------------------------------------

//GET DI TUTTI I RADUNI
router.get('', async (req, res) => {

	if (req.query.organizzatore != null) {
		//se ho specificato l'organizzatore
		getMieiRaduni(req, res);
	}
	else {
		//se non ho specificato l'organizzatore
		getDiBase(res);
	}
});

//torna tutti i raduni
async function getDiBase(res) {
	let tuttiRaduni = await Raduno.find({});

	tuttiRaduni = tuttiRaduni.map((raduno) => {
		return {
			title: raduno.title,
			club: raduno.club,
			manager: raduno.manager,
			description: raduno.description,
			subscribers: raduno.subscribers
		};
	});
	res.status(200).json(tuttiRaduni);
}

//Restituisce i raduni di un determinato organizzatore
async function getMieiRaduni(req, res) {
	let organizzatore = req.query.organizzatore;
	let mieiRaduni = await Raduno.find({ manager: organizzatore });

	mieiRaduni = mieiRaduni.map((raduno) => {
		return {
			title: raduno.title,
			club: raduno.club,
			description: raduno.description,
			subscribers: raduno.subscribers,
			datetime: raduno.datetime
		};
	});
	res.status(200).json(mieiRaduni);

}

//----------------------------------------------------------------------------

module.exports = router;
