const express = require('express');
const router = express.Router();
const Club_post = require('../models/club_post'); // get our mongoose model
const Club = require('../models/club');
const jwt = require('jsonwebtoken');

//----------------------------------------------------------------------------

// POST PER RIMUOVERE UN POST DI UN CLUB

router.post('/remove_post', async (req, res) => {
  var token = req.cookies.token;
  const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});
  var username = payload.username;
  var post_id = req.body.post_id;

  let post = await Club_post.findOne({ // trovo il post in base all'id
			_id: post_id
		}).exec();

  if(post) { // se ho trovato il post
    let club = await Club.findOne({ // trovo il club dove è stato caricato il post
  			name: post.club
  		}).exec();

    if(club) { // se ho trovato il club
      if(username == club.owner) { // se l'user che ha fatto richiesta è proprietario del club
        console.log("cancello il post");
        await Club_post.deleteOne({ _id: post_id }); // elimino il post

        res.status(200).json("Post eliminato");
      }
    }
    else { // errore che non dovrebbe succedere perchè se esiste il post, allora esiste anche il club
      res.status(500).json("Errore");
    }
  }
  else { // se faccio richiesta per eliminare un post che non esiste
    res.status(404).json("Errore");
  }

});

//----------------------------------------------------------------------------

//GET DEI POST DI UN DETERMINATO CLUB
router.get('', async (req, res) => {
  var token = req.cookies.token;
  const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

  let clubFound = await Club.findOne({
			name: req.query.club
		}).exec();

  if(clubFound) {
    var iscritti = clubFound.subscribers;

    if(iscritti.includes(payload.username)) {
      let findPost = await Club_post.find({
    			club: req.query.club
    		})
        .sort('-timestamp') // ordina per timestamp in ordine decrescente
        .exec();

        if(findPost) {
          res.status(200).json(findPost);
        }
        else {
          res.status(404).json("Nessun post trovato");
        }
    }
    else {
      res.status(403).json("Non risulti iscritto al club");
    }
  }
  else { // se faccio richiesta su un club che non esiste
    res.status(404).json("Club non trovato");
  }
});

//----------------------------------------------------------------------------

// POST PER INSERIRE UN CLUB POST
router.post('', async (req, res) => {
    var token = req.cookies.token;
    const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

		if(req.body.club != "" && req.body.title != "" && req.body.description != "") {
      let clubFound = await Club.findOne({
    			name: req.body.club
    		}).exec();

      if(req.body.img) {
        var time = Date.now().toString();
      	var image = payload.username + time;
      	res.cookie("image_timestamp", time);
      }
      else {
        var image = "";
      }

      if(clubFound) {
        var iscritti = clubFound.subscribers;

        if(iscritti.includes(payload.username)) {
          var club_post = new Club_post({
            club: req.body.club,
      	    author: payload.username,
            title: req.body.title,
            description: req.body.description,
            img: image
      	    });

            club_post = await club_post.save();

            res.status(201).json({ success: true, message: 'Post successfully created' });
        }
        else { // se non sei iscritto al club, non hai i permessi per creare un post
          res.status(403).json({success: false, message: 'Non sei iscritto al club'});
        }

      }


    }
    else {
      res.status(400).json({success: false, message: 'Inserire tutti i campi richiesti'});
    }
});

module.exports = router;
