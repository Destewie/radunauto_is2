const express = require('express');
const router = express.Router();
const User = require('../models/user'); // get our mongoose model
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10;

//----- ADD USER
router.post('', async (req, res) => {
		//creo un contenitore per un user basandomi su un modello per mongoose
		var user = new User({
	        username: req.body.username,
	        password: req.body.password
	    });

		//cerco lo user in base allo username passato nel body della richiesta
		let userFound = await User.findOne({
				username: req.body.username
			}).exec();

		//se l'utente viene trovato non va bene perché vogliamo che gli username siano univoci
		if(userFound) {
			res.json({ success: false, message: 'This username is used.' });
		}
		//in caso contrario, provvedo a fare l'hash della sua password e a salvarlo nel db
		else {
			//hash della password
			const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
			var hash = await bcrypt.hash(user.password, salt);
			user.password = hash;

			//salvataggio in mongodb
			user = await user.save();

	    	res.json({ success: true, message: 'User saved successfully' });
		}

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    //res.location("/api/v1/user/" + userId).status(201).send();
});


module.exports = router;
