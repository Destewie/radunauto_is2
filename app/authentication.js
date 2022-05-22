const express = require('express');
const router = express.Router();
const User = require('../models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const bcrypt = require('bcryptjs/dist/bcrypt');


// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {

    //creo un contenitore per un user basandomi su un modello per mongoose
    var user = new User({
        username: req.body.username,
        password: req.body.password
	});

    //cerco lo user in base allo username passato nel body della richiesta
    let userFound = await User.findOne({
            username: req.body.username
        }).exec();

    //se non trovo l'utente
	if(userFound == null) {
		console.log("Utente non trovato");
        return res.status(400).send("Non siamo riusciti a trovare l'utente in questione");
    }
    //se trovo l'utente
	else {


        try {
        	//controllo se la password arrivata nella richiesta corrisponde a quella nel db
            if(await bcrypt.compare(user.password, userFound.password)) {
				//se sei qui è perché hai azzeccato sia il nome utente che la password
                console.log(user.username + " sei dentro! :)");

				//creo il token
				var payload = {
					username: user.username,
					// other data encrypted in the token
				}
				var options = {
					expiresIn: 86400 // expires in 24 hours
				}
				var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

        res.cookie("token", token);

				res.json({
					success: true,
					username: user.username,
					message: 'Adesso che sei loggato, goditi il token!',
					token: token,
				});

			}
            else {
                res.send("Non autorizzato :(");
            }
        }
        catch (err) {
            res.status(500).send(err);
        }
	}

});

module.exports = router;
