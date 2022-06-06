const express = require('express');
const router = express.Router();
const Club = require('../models/club'); // get our mongoose model
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const SALT_WORK_FACTOR = 10;

//-------------------------------------------------------------------------------------------

router.post('/remove_ban', async(req, res) => {

	var nomeUtenteSbannato = req.body.nomeUtente;

	//devo pigliarmi il club da cui voglio rimuovere il ban sull'utente
	let clubFound = await Club.findOne({ name: req.body.nomeClub }).exec();

	var payload;
	var usernameChiamante;

	//prendo e verifico il token
	try {
		var token = req.cookies.token;
		payload = jwt.verify(token, process.env.SUPER_SECRET, { ignoreExpiration: true });

		//prendo lo username dell'utente che sta facendo la chiamata
		usernameChiamante = payload.username;
	} catch (err) {
		res.status(401).json({ success: false, message: 'Invalid token' });
		return;
	}

	//sfilza di messaggi d'errore vari
	if(!clubFound) {
		//se il club in questione non esiste
		res.json({ success: false, message: 'Club non trovato' });
	}
	else if (clubFound.bans.indexOf(nomeUtenteSbannato) == -1) {
		//se l'utente non è stato bannato 
		res.json({ success: false, message: 'Non puoi togliere il ban ad un utente non bannato' });
	}
	else if (usernameChiamante != clubFound.owner) {
		//se l'utente che fa la chiamata alle api non è il proprietario del club da cui vuole sbannare un utente
		res.json({ success: false, message: 'Non puoi sbannare qualcuno da un club non tuo'});
	}
	else {
		//se tutto è ok
		clubFound.bans.splice(clubFound.bans.indexOf(nomeUtenteSbannato), 1);
		clubFound.save();
		res.json({ success: true, message: 'Utente sbannato' });
	}

});

//-------------------------------------------------------------------------------------------

router.post('/remove_subscriber', async (req, res) => {
	var nomeUtente = req.body.nomeUtente;

	//devo pigliarmi il club da cui voglio togliere un subscruber
	let clubFound = await Club.findOne({
		name: req.body.nomeClub
	}).exec();

	if (!clubFound) {
		//se il club in questione non esiste
		res.json({ success: false, message: 'Club non trovato' });
	}
	else if (clubFound.subscribers.indexOf(nomeUtente) == -1) {
		//se l'utente non è iscritto al club
		res.json({ success: false, message: 'Non puoi rimuovere dal club un utente non iscritto' });
	}
	else if (clubFound.owner == nomeUtente) {
		//se l'utente è il proprietario del club
		res.json({ success: false, message: 'Non puoi rimuovere il proprietario del club' });
	}
	else {
		//devo togliere l'utente dal club e aggiornare la lista dei banditi
		
		let index = clubFound.subscribers.indexOf(nomeUtente);
		if (index > -1) {
			clubFound.subscribers.splice(index, 1); //dalla posizione index, rimuovo 1 elemento
			clubFound.bans.push(nomeUtente);
		}
		else {
			res.json({ success: false, message: 'Stavo provando ad eliminare l\'utente dal club ma non lo trovo' });
		}

		//aggiorno il club
		clubFound.save(function (err) {
			if (err) {
				res.json({ success: false, message: 'Errore nell\'aggiornamento del club' });
			}
			else {
				res.json({ success: true, message: 'Utente rimosso definitivamente dal club' });
			}
		});

	}
});

//-------------------------------------------------------------------------------------------

router.post('/add_subscriber', async (req, res) => {

	console.log("Entro in /add_subscriber di clubs");

	//devo pigliarmi il club da cui voglio aggiungere un subscruber
	let clubFound = await Club.findOne({
		name: req.body.name
	}).exec();

	if (!clubFound) {
		//se il club in questione non esiste
		res.json({ success: false, message: 'Club non trovato' });
	}
	else {
		//prendo e verifico il token
		var token = req.cookies.token;
		const payload = jwt.verify(token, process.env.SUPER_SECRET, { ignoreExpiration: true });

		//mi prendo l'array del club trovato nel db
		var iscritti = clubFound.subscribers;

		if (iscritti.includes(payload.username)) {
			//controllo che l'utente non sia già iscritto
			res.json({ success: false, message: "Spiazze, ma l'utente che volevi aggiungere è già tra gli iscritti del club" });
		}
		else if (clubFound.bans.includes(payload.username)) {
			//controllo che l'utente non sia già bannato
			res.json({ success: false, message: "Spiazze, ma l'utente che volevi aggiungere è bannato dal club" });
		}
		else {
			//se non dovesse essere già iscritto
			//aggiorno l'array con lo username del nuovo iscritto
			iscritti.push(payload.username);

			iscritti.forEach(element => {
				console.log(element);
			});

			const filter = { name: req.body.name };
			const update = { subscribers: iscritti };

			const oldClub = await Club.updateOne(filter, update);

			res.json({ success: true, message: 'Club modificato', club: oldClub });
		}
	}
});

//-------------------------------------------------------------------------------------------


router.post('', async (req, res) => {
	var token = req.cookies.token;
	const payload = jwt.verify(token, process.env.SUPER_SECRET, { ignoreExpiration: true });

	var club = new Club({
		name: req.body.name,
		description: req.body.description,
		owner: payload.username,
		subscribers: [payload.username]
	});

	let findClub = await Club.findOne({
		name: req.body.name
	}).exec();

	if (club.name == "") {
		res.json({ success: false, message: 'Nome del club non valido' });
	}
	else if (findClub) {
		res.json({ success: false, message: 'Club già esistente' });
	}
	else {
		club = await club.save();

		res.json({ success: true, message: 'Club successfully created' });
	}
});

module.exports = router;

//-------------------------------------------------------------------------------------------

//ritorna gli iscritti ad un particolare club
router.get('/subscribers', async (req, res) => {
	if (req.query.nomeClub) {
		let clubFound = await Club.findOne({
			name: req.query.nomeClub
		}).exec();

		if (!clubFound) {
			res.json({ success: false, message: 'Club non trovato' });
		}
		else {
			res.status(200).json({ success: true, owner: clubFound.owner, nomeClub: clubFound.name, subscribers: clubFound.subscribers });
		}
	}
	else {
		res.json({ success: false, message: 'Nessun club specificato nei parametri della URL' });
	}
});

//-------------------------------------------------------------------------------------------

//ritorna gli utenti banditi da un particolare club
router.get('/banditi', async (req, res) => {

	//prendo il club da cui voglio vedere gli utenti banditi
	if (req.query.nomeClub) {

		let clubFound = await Club.findOne({
			name: req.query.nomeClub
		}).exec();

		if (!clubFound) {
			//se non trovo il club
			res.json({ success: false, message: 'Club non trovato' });
		}
		else {
			//se trovo il club
			res.status(200).json({ success: true, owner: clubFound.owner, nomeClub: clubFound.name, banditi: clubFound.bans });
		}
	}
	else {
		res.json({ success: false, message: 'Nessun club specificato nei parametri della URL' });
	}
});

//-------------------------------------------------------------------------------------------

// torna le info di un club, dato il nome nel body
router.get('/get_club', async (req, res) => {
	let club = await Club.findOne({
		name: req.query.name
	}).exec();

	if(club) {
		res.json(club);
	}
	else {
		res.json({});
	}
});

//-------------------------------------------------------------------------------------------

router.get('', async (req, res) => {

	if (req.query.proprietario != null) {
		//se ho specificato il proprietario
		getMieiClub(req, res);
	}
	else {
		//se non ho specificato il proprietario
		getDiBase(res);
	}
});

//torna tutti i club
async function getDiBase(res) {
	let clubs = await Club.find({});

	clubs = clubs.map((club) => {
		return {
			name: club.name,
			owner: club.owner,
			subscribers: club.subscribers
		};
	});
	res.status(200).json(clubs);
}

//torna solo i club di cui è proprietario l'utente che ha l'username nella URL
async function getMieiClub(req, res) {
	let clubs = await Club.find({ owner: req.query.proprietario });

	clubs = clubs.map((club) => {
		return {
			name: club.name,
			owner: club.owner,
			subscribers: club.subscribers
		};
	});
	res.status(200).json(clubs);
}

//-------------------------------------------------------------------------------------------
