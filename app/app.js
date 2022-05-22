const express = require('express');
const app = express();
const cors = require('cors');

const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');
const users = require('./users.js');
const dotenv = require("dotenv").config();


// Configure Express.js parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS requests
app.use(cors())


/**
 * Serve front-end static files
 */
app.use('/', express.static(process.env.FRONTEND || 'static'));
// If process.env.FRONTEND folder does not contain index.html then use the one from static
app.use('../static/', express.static('static')); // expose also this folder


app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})



/**
 * Authentication routing and middleware
 */
//app.use('/api/v1/authentications', authentication);

// Protect booklendings endpoint
// access is restricted only to authenticated users
// a valid token must be provided in the request
//app.use('/api/v1/booklendings', tokenChecker);
//app.use('/api/v1/booklendings', books);
//app.use('/api/v1/students/me', tokenChecker);



/**
 * Resource routing
 */
app.use('/api/login', authentication);
app.use('/api/add_user', users);




/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


module.exports = app;
