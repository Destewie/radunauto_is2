//----------------------------------------------------------------------------

function registration() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  fetch('../api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { username: username, password: password } ),
    }).then((resp) => resp.json())

  .then(function(data) { // Here you get the data to modify as you please
    var result = data.success;

    document.getElementById("form").innerHTML = "";
    document.getElementById("titolo").innerHTML = "Esito registrazione";

    var outcome;

    if(result == true) {
      outcome = "Registrazione effettuata con successo";
    }
    else {
      outcome = "Username già esistente";
    }

    document.getElementById("risultato").innerHTML = outcome;

    return;
    }).catch( error => console.error(error));
};

//----------------------------------------------------------------------------

function create_club() {
  var name = document.getElementById('name').value;
  var owner = document.getElementById('owner').value;

  fetch('../api/clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { name: name, owner: owner } ),
    }).then((resp) => resp.json())

  .then(function(data) { // Here you get the data to modify as you please
    var result = data.success;

    document.getElementById("form").innerHTML = "";
    document.getElementById("titolo").innerHTML = "Esito creazione club";

    var outcome;

    if(result == true) {
      outcome = "Club creato con successo";
    }
    else {
      outcome = "Errore";
    }

    document.getElementById("risultato").innerHTML = outcome;
  });
}

//----------------------------------------------------------------------------

function login() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  fetch('../api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { username: username, password: password } ),
    }).then((resp) => resp.json())

  .then(function(data) { 
    // qui "data" è il json che è stato tornato da  authentication
    //volendo qui puoi fare quello che vuoi con quel json
    if(data.success) {
      window.location = "/home.html"; //se il login è andato, rimando alla home
    } else {
      window.location = "login.html"; //se il login non è andato, rimando di nuovo alla pagina del login 
    }

    return;
    }).catch( error => console.error(error));
};

//----------------------------------------------------------------------------

//funzione presa dall'internet. La uso come black box
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
      end = dc.length;
      }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
} 

//----------------------------------------------------------------------------

function logout() {
  var cookie = getCookie("token");

  fetch('../api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { cookie : cookie } ), //inglobo il cookie preso nel body della richiesta post che faccio al server
    }).then((resp) => resp.json())

  .then(function(data) { 
    // qui "data" è il json che è stato tornato da logout.js
    //volendo qui puoi fare quello che vuoi con quel json
    if(data.success) {
      window.location = "/logout.html"; //se il login è andato, rimando alla home
    } else {
      window.location = "home.html"; //se il login non è andato, rimando di nuovo alla pagina del login 
    }

    return;
    }).catch( error => console.error(error));
};

//----------------------------------------------------------------------------