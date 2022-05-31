const express = require('express');
const router = express.Router();
const Club = require('../models/club'); // get our mongoose model
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const SALT_WORK_FACTOR = 10;

//-------------------------------------------------------------------------------------------

router.post('/remove_subscriber', async (req, res) => {
	var nomeUtente = req.body.nomeUtente;

	//devo pigliarmi il club da cui voglio togliere un subscruber
	let clubFound = await Club.findOne({
			name: req.body.nomeClub
		}).exec();
	
	if(!clubFound) {
		res.json({success: false, message: 'Club non trovato'});
	}
	else if(clubFound.subscribers.indexOf(nomeUtente) == -1) {
		res.json({success: false, message: 'Non puoi rimuovere dal club un utente non iscritto'});
	}
	else if(clubFound.owner == nomeUtente) { 
		res.json({success: false, message: 'Non puoi rimuovere il proprietario del club'});
	}
	else {
		//devo togliere l'utente dal club
		let index = clubFound.subscribers.indexOf(nomeUtente);
		if(index > -1) {
			clubFound.subscribers.splice(index, 1);
		}
		
		//devo aggiornare il club
		clubFound.save(function(err) {
			if(err) {
				res.json({success: false, message: 'Errore nell\'aggiornamento del club'});
			}
			else {
				res.json({success: true, message: 'Utente rimosso dal club'});
			}
		});
	}
});

//-------------------------------------------------------------------------------------------

router.post('/add_subscriber', async(req, res) => {
	
	console.log("Entro in /add_subscriber di clubs");

	//devo pigliarmi il club da cui voglio aggiungere un subscruber
	let clubFound = await Club.findOne({
			name: req.body.name
		}).exec();
	
	if(!clubFound) {
		res.json({success: false, message: 'Club non trovato'});
	} 
	else {
		//prendo e verifico il token
		var token = req.cookies.token;
		const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

		//mi prendo l'array del club trovato nel db
		var iscritti = clubFound.subscribers;

		//controllo che l'utente non sia già iscritto
		if(iscritti.includes(payload.username)) {
			res.json({success: false, message: "Spiazze, ma l'utente che volevi aggiungere è già tra gli iscritti del club"});
		}
		else {
			//se non dovesse essere già iscritto
			//aggiorno l'array con lo username del nuovo iscritto
			iscritti.push(payload.username);
			
			iscritti.forEach(element => {
				console.log(element);
			});

			const filter = { name: req.body.name };
			const update = { subscribers: iscritti};

			const oldClub = await Club.updateOne(filter, update);

			res.json({success: true, message: 'Club modificato', club: oldClub});
		}
	}
});

//-------------------------------------------------------------------------------------------

router.post('', async (req, res) => {
    var token = req.cookies.token;
    const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

		var club = new Club({
	        name: req.body.name,
	        owner: payload.username,
			subscribers: [payload.username]
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

//-------------------------------------------------------------------------------------------

router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
	console.log(req.query.proprietario);
	
	if(req.query.proprietario != null) {
		console.log("il proprietario non è null nella richiesta");
		getMieiClub(req, res);
	}
	else {
		console.log("get di base");
		getDiBase(res);
	}
});

async function getDiBase(res) {
    let clubs = await Club.find({});

    clubs = clubs.map( (club) => {
        return {
            name: club.name,
            owner: club.owner,
			subscribers : club.subscribers
        };
    });
    res.status(200).json(clubs);
}

async function getMieiClub(req, res) {
	let clubs = await Club.find({owner: req.query.proprietario});

    clubs = clubs.map( (club) => {
        return {
            name: club.name,
            owner: club.owner,
			subscribers : club.subscribers
        };
    });
    res.status(200).json(clubs);
}

//-------------------------------------------------------------------------------------------
