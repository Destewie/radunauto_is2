const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const jwt = require('jsonwebtoken');

//----------------------------------------------------------------------------

//GET DELLE AUTO DI UN UTENTE
router.get('', async (req, res) => {
  let cars = await Car.find({
      owner: req.query.owner
    })
    .exec();

    if(cars) {
      res.status(200).json(cars);
    }
    else {
      res.status(404).json("Errore");
    }
});

//----------------------------------------------------------------------------

// POST PER INSERIRE UN AUTO
router.post('', async (req, res) => {
    var token = req.cookies.token;
    const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

		if(req.body.name != "" && req.body.manufacturer != "" && req.body.model != "" && req.body.year != "") {
      var car = new Car({
        name: req.body.name,
        owner: payload.username,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year
        });

        car = await car.save();

        if(car) {
          res.status(201).json("Auto salvata");
        }
        else {
          res.status(400).json("Errore");
        }
    }

    else {
      res.status(400).json("Errore");
    }
});

module.exports = router;
