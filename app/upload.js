const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Car = require('../models/car');

var storage = multer.diskStorage(
  {
    destination: "static/images/",
    filename: function(req, file, cb) {
      var token = req.cookies.token;
    	const payload = jwt.verify(token, process.env.SUPER_SECRET, { ignoreExpiration: true });
      const filename = payload.username + req.cookies.image_timestamp;

      cb(null, filename + ".png");
    }
  }
)

const upload = multer({ storage: storage });

router.post("/single", upload.single("image"), (req, res) => {
  res.send({
    status: "success",
    message: "Files uploaded successfully"
  });
});

module.exports = router;
