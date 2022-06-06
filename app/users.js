const express = require('express');
const router = express.Router();
const User = require('../models/user'); // get our mongoose model
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const SALT_WORK_FACTOR = 10;

// aggiorno l'utente
router.post('/update', async (req, res) => {
	var token = req.cookies.token;
  const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});
	var time = Date.now().toString();
	const image = payload.username + time;
	res.cookie("image_timestamp", time);

	var filter = { username: payload.username };
	var update = {};

	if(req.body.display_name != "") {
		update["display_name"] = req.body.display_name;
	}

	for(key in req.body) {
		if(req.body[key] != "" && key != "img") {
			update[key] = req.body[key];
		}
	}

	if(req.body.img == "img") {
		update["img"] = payload.username + time;
	}

	let user = await User.findOneAndUpdate(filter, update, {
		new: true
	});

	if(user) {
		res.status(200).json({success: true, message: "utente aggiornato"});
	}
	else {
		res.status(500).json({success: false, message: "Errore"});
	}
});

//----------------------------------------------------------------------------

//----- ADD USER
router.post('', async (req, res) => {
	//creo un contenitore per un user basandomi su un modello per mongoose
	var user = new User({
		username: req.body.username,
		password: req.body.password,
		email: req.body.email,
		display_name: req.body.display_name,
		birth_date: req.body.birth_date,
		address: req.body.address,
		phone_number: req.body.phone_number,
		fiscal_code: req.body.fiscal_code
	});

	//cerco lo user in base allo username passato nel body della richiesta
	let userFound = await User.findOne({
		username: req.body.username
	}).exec();

	//se l'utente non è stato trovato ed ha inserito una password qualsiasi, per noi va bene
	if (!userFound && user.password != "" && user.username != "") {
		//hash della password
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		var hash = await bcrypt.hash(user.password, salt);
		user.password = hash;

		//salvataggio in mongodb
		user = await user.save();

		res.status(201).json({ success: true, message: 'User saved successfully' });
	}
	//se l'utente è stato trovato all'interno del db, non può registrarsi
	else if (userFound) {
		res.status(400).json({ success: false, message: 'This username is used.' });
	}
	else if (user.username == "") {
		res.status(400).json({ success: false, message: 'Il campo username non può essere lasciato vuoto!' });
	}
	else if (user.password == "") {
		res.status(400).json({ success: false, message: 'La password non può essere vuota!' });
	}

	/**
	 * Link to the newly created resource is returned in the Location header
	 * https://www.restapitutorial.com/lessons/httpmethods.html
	 */
	//res.location("/api/v1/user/" + userId).status(201).send();
});

//----------------------------------------------------------------------------

router.get('/user', async (req, res) => {
	var token = req.cookies.token;
  const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

	if(req.query.user == "") {
		var user = await User.findOne({
			username: payload.username
		})
		.exec();
	}
	else {
		var user = await User.findOne({
			username: req.query.user
		})
		.exec();
	}

	if(user) {
		if(user.username == payload.username) {
			res.status(200).json(user);
		}
		else {
			res.status(200).json( {display_name: user.display_name, username: user.username, email: user.email, img: user.img} );
		}
	}
	else {
		res.status(404).json("Utente non trovato");
	}

});


module.exports = router;
