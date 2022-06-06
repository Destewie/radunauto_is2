const express = require('express');
const router = express.Router();

//----------------------------------------------------------------------------

router.post('', (req, res) => {
  var myCookie = req.cookies.token;

  if (myCookie != null) {
    res.clearCookie("token");
    res.clearCookie("username");
    res.status(200).json({
      success: true,
      message: "Logout avvenuto con successo"
    });
    res.end();
    console.log("in teoria ho eliminato il cookie")

  } else {
    console.log("Sta provando a fare il logout ma non è loggato...");
    res.status(400).json("Non sei loggato");
  }
});

//----------------------------------------------------------------------------

module.exports = router;
