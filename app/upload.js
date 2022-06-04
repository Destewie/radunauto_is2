const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require('fs');
const jwt = require('jsonwebtoken');

var storage = multer.diskStorage(
  {
    destination: "data/images/",
    filename: function(req, file, cb) {
      var token = req.cookies.token;
      const payload = jwt.verify(token, process.env.SUPER_SECRET, {ignoreExpiration: true});
      var username = payload.username;
      var time = Date.now().toString();

      cb(null, username + time.slice(0, time.length - 7) + token.slice(0, 15) + ".png");
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
