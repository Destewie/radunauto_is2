//----------------------------------------------------------------------------

function registration() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;

  fetch('../api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { username: username, password: password, email: email } ),
    }).then((resp) => resp.json())

  .then(function(data) { // Here you get the data to modify as you please
    var result = data.success;

    var outcome;

    if(result == true) {
      outcome = "Registrazione effettuata con successo, ";

      //document.getElementById("form").innerHTML = "";
      //document.getElementById("titolo").innerHTML = "Registrazione effettuata con successo";

      document.getElementById("registration_alert").className = "alert alert-success";
      document.getElementById("registration_alert").innerHTML = outcome + '<a href="login.html">Accedi</a>';
      document.getElementById("registration_alert").style = "display: block";
    }
    else {
      outcome = "Username già esistente";

      document.getElementById("registration_alert").className = "alert alert-danger";
      document.getElementById("registration_alert").innerHTML = outcome;
      document.getElementById("registration_alert").style = "display: block";
    }

    return;
    }).catch( error => console.error(error));
};

//----------------------------------------------------------------------------

function create_club() {
  var name = document.getElementById('name').value;
  var description = document.getElementById('description').value;

  fetch('../api/clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { name: name,
                            description: description
    } ),
    }).then((resp) => resp.json())

  .then(function(data) { // Here you get the data to modify as you please
    var result = data.success;

    document.getElementById("form").innerHTML = "";
    document.getElementById("titolo").innerHTML = "Esito creazione club";

    var outcome;
  
    if(result == true) {
      outcome =  "Club creato con successo <br><br>";
      outcome += '<form method="get" action="lista_club.html">';
        outcome += '<button class="btn" style="background-color: #ffb4b0;" type="submit" >Mostra tutti i club</button>';
      outcome += '</form>';
    }
    else {
      outcome = "Errore";
    }

    document.getElementById("risultato").innerHTML = outcome;
  });
}

function create_event() {
  var title = document.getElementById('title').value;
  var club = document.getElementById('club').value;
  var description = document.getElementById('description').value;

  fetch('../api/raduni', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { title: title, description: description, club: club } ),
    }).then((resp) => resp.json())

  .then(function(data) {
    var result = data.success;

    document.getElementById("form").innerHTML = "";
    document.getElementById("titolo").innerHTML = "Esito creazione club";

    var outcome;
  
    if(result == true) {
      outcome = "Raduno creato con successo";
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
      document.getElementById("login_alert").style = "display: block";
      //window.location = "login.html"; //se il login non è andato, rimando di nuovo alla pagina del login
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

  return decodeURI(dc.substring(begin + prefix.length, end));
}

//----------------------------------------------------------------------------

function logout() {
  var cookie = getCookie("token");

  //faccio una richiesta POST a /api/logout
  fetch('../api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( { cookie : cookie } ), //inglobo il cookie preso nel body della richiesta post che faccio al server
    }).then((resp) => resp.json()) //penso che resp sia la risposta ricevuta da /api/logout e che qui viene trasformata in json

  .then(function(data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
    // qui "data" è quindi la versione in json della risposta tornata da /api/logout
    if(data.success) {
      window.location = "/logout.html"; //se il login è andato, rimando alla home
    } else {
      window.location = "home.html"; //se il login non è andato, rimando di nuovo alla pagina del login
    }

    return;
    }).catch( error => console.error(error));
};

//----------------------------------------------------------------------------

function add_sub_raduno(titoloRaduno) {
  var cookie = getCookie("token");

  //faccio una POST asincrona alla api che ho in raduni.js
  fetch('../api/raduni/add_subscriber', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({title: titoloRaduno, cookie:cookie})
  }).then((resp) => resp.json())

  .then(function(data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
    // qui "data" è quindi la versione in json della risposta tornata dalla richiesta

    document.getElementById("btn"+titoloRaduno).disabled = true; //disattiva il bottone dopo averlo premuto

    if(data.success) {
      alert("Iscrizione avvenuta con successo!")
    } else {
      alert("Sei già iscritto a questo evento")
    }

    return;
    }).catch( error => console.error(error));
}

//----------------------------------------------------------------------------

function add_sub_club(nomeClub) {
  var cookie = getCookie("token");

  //faccio una POST asincrona alla api che ho in raduni.js
  fetch('../api/clubs/add_subscriber', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({name: nomeClub, cookie:cookie})
  }).then((resp) => resp.json())

  .then(function(data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
    // qui "data" è quindi la versione in json della risposta tornata dalla richiesta
    console.log(data.message)

    document.getElementById("btn"+nomeClub).disabled = true; //disattiva il bottone dopo averlo premuto

    if(data.success) {
      alert("Iscrizione avvenuta con successo!")
    } else {
      alert("Sei già iscritto a questo club")
    }

    return;
    }).catch( error => console.error(error));
}

//----------------------------------------------------------------------------

function remove_sub_club(userName, clubName) {
  //faccio una POST asincrona alla api che ho in raduni.js
  fetch('../api/clubs/remove_subscriber', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({nomeUtente: userName, nomeClub: clubName})
  }).then((resp) => resp.json())

  .then(function(data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
    // qui "data" è quindi la versione in json della risposta tornata dalla richiesta
    console.log(data.message)

    btnId = "btnRm"+userName;
    document.getElementById(btnId).disabled = true; //disattiva il bottone dopo averlo premuto

    if(data.success) {
      alert("Utente rimosso con successo!")
    } else {
      alert("Ci sono stati problemi nella rimozione dell'utente")
    }

    return;
    }).catch( error => console.error(error));
}

//----------------------------------------------------------------------------

//modifica il contenuto della div con id="clubs" riempiendola solo con club di cui l'utente attivo è proprietario
function filtra_mieiClub() {
  var usernameCookie = getCookie("username");

      $.ajax ({
                'url': '/api/clubs',
                'type': 'GET',
                'dataType': 'json',
                'data': {proprietario: usernameCookie},
                'success': function(response) {

                  if (response) {
                    //per modificare la riga sopra alla tabella
                    let htmlFiltro = '<br> Mostra nuovamente tutti i club<br>'
                    htmlFiltro += '<form action="lista_club.html" method="get">'
                    htmlFiltro += '<button type="submit" style="background-color: #ffb4b0;" class="btn"> <i>Mostra</i> </button><br>'
                    htmlFiltro += '</form>'
                    $('#filtro').html(htmlFiltro);
     

                    //per modificare la lista dei club
                        var html = '<br><div class=container-lg textcenter>';

                        //se l'utente non è loggato non può filtrare i club per vedere solo quelli di cui è proprietario
                        if(usernameCookie == null) {
                          html = 'Purtroppo per vedere i tuoi club devi aver fatto il <a href="login.html">login</a>';
                        }
                        else {
                          //mostro i club di cui l'utente è proprietario
                          html += '<table class="table"><thead style="background-color: #ffb4b0;"><tr><th>Nome club</th><th>Proprietario</th><th style="text-align:center">Gestisci iscritti</th></tr></thead>';
                          btnId = 'btnRm'+usernameCookie;
                          for (var i = 0; i < response.length; i++) {
                            html += "<tr><td>" + response[i].name + "</td><td>" + response[i].owner + '</td><td style="text-align:center"><button id="'+ btnId +'" type="button" class="btn btn-outline-primary" onclick="apriPaginaIscritti(\''+ response[i].name+'\')">Iscritti</button></td></tr>';
                          }
                          html += "</table></div>";
                        }


                        $('#clubs').html(html); //va a mettere tutto dento all'elemento con id = eventi
                }

              }
        });
}

//----------------------------------------------------------------------------

function apriPaginaIscritti(nomeClub) {
  window.location.href = "iscritti_club.html?nomeClub="+nomeClub;
}

//----------------------------------------------------------------------------
