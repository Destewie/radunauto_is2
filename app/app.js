const express = require('express');
const app = express();
const cors = require('cors');

const Authentication = require('./authentication.js');
const Logout = require('./logout.js');
const TokenChecker = require('./tokenChecker.js');
const Users = require('./users.js');
const Clubs = require('./clubs.js');
const Raduni = require('./raduni.js');
const Dotenv = require("dotenv").config();
const CookieParser = require('cookie-parser');


// Configure Express.js parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS requests
app.use(cors())

// cookie parser
app.use(CookieParser());

//Sicurezza di base
//Per fare in modo che un utente non loggato non possa richiedere queste pagine
app.use('/home.html', TokenChecker);
app.use('/creazione_club.html', TokenChecker);
app.use('/creazione_raduno.html', TokenChecker);


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
 * Resource routing
 */
app.use('/api/login', Authentication);
app.use('/api/logout', Logout);

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
