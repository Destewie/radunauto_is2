const express = require('express');
const app = express();
const cors = require('cors');

const Authentication = require('./authentication.js');
const TokenChecker = require('./tokenChecker.js');
const Users = require('./users.js');
const Clubs = require('./clubs.js');
const Raduni = require('./raduni.js');
const Dotenv = require("dotenv").config();


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
app.use('/api/login', Authentication);

app.use('/api/users', Users);

app.use('/api/clubs', TokenChecker);
app.use('/api/clubs', Clubs);
app.use('/api/raduni', Raduni);


app.use(function(req, res) {
    res.redirect('/home.html');
});

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});


module.exports = app;
