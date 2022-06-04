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

// POST PER RIMUOVERE UN'AUTO
router.post('/remove', async (req, res) => {
    var token = req.cookies.token;
    const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});

    let car = await Car.findOne({ // trovo il post in base all'id
  			_id: req.body._id
  		}).exec();

    if(car.owner == payload.username) {
      await Car.deleteOne({ _id: car._id }); // elimino l'automobile

      res.status(201).json("Auto rimossa");
    }
    else {
      res.status(400).json("Non puoi rimuovere questa automobile");
    }
});

//----------------------------------------------------------------------------

// POST PER INSERIRE UN AUTO
router.post('', async (req, res) => {
    var token = req.cookies.token;
    const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});
    var time = Date.now().toString();
    const image = payload.username + time.slice(0, time.length - 7) + token.slice(0, 15);

		if(req.body.name != "" && req.body.manufacturer != "" && req.body.model != "" && req.body.year != "" && req.body.license_plate != "") {
      var car = new Car({
        name: req.body.name,
        owner: payload.username,
        license_plate: req.body.license_plate,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        year: req.body.year,
        image: image
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
