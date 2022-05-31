const express = require('express');
const router = express.Router();
const Club_post = require('../models/club_post'); // get our mongoose model
const Club = require('../models/club');
const jwt = require('jsonwebtoken');

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
    		}).exec();

        if(findPost) {
          res.status(200).json(findPost);
        }
        else {
          res.status(404).json("Nessun post trovato");
        }
    }
    else {
      res.json("Non risulti iscritto al club");
    }
  }
  else {
    res.status(404).json("Club non trovato");
  }
});

//----------------------------------------------------------------------------

// POST PER INSERIRE UN CLUB POST
router.post('', async (req, res) => {
    var token = req.cookies.token;
    const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

		if(req.club != "" && req.title != "" && req.description != "" && req.author != "") {
      var club_post = new Club_post({
        club: req.body.club,
  	    author: payload.username,
        title: req.body.title,
        description: req.body.description
  	    });

        club_post = await club_post.save();

        res.json({ success: true, message: 'Post successfully created' });
    }
    else {
      res.json({success: false, message: 'Inserire tutti i campi richiesti'});
    }
});

module.exports = router;
