const express = require('express');
const router = express.Router();

//----------------------------------------------------------------------------

router.post('', (req, res) => {
  var myCookie = req.body.cookie;

  if(myCookie != null) {
    res.clearCookie("token");
    res.json({
       success : true,
       message : "Logout avvenuto con successo"
    });
    res.end();
    console.log("in teoria ho eliminato il cookie")

  } else {
    console.log("Sta provando a fare il logout ma non è loggato...");
  }
});

//----------------------------------------------------------------------------

module.exports = router;