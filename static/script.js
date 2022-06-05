//----------------------------------------------------------------------------

function registration() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;

  fetch('../api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password, email: email }),
  }).then((resp) => resp.json())

    .then(function (data) { // Here you get the data to modify as you please
      var result = data.success;

      var outcome;

      if (result == true) {
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
    }).catch(error => console.error(error));
};

//----------------------------------------------------------------------------

function create_club() {
  var name = document.getElementById('name').value;
  var description = document.getElementById('description').value;

  fetch('../api/clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name,
      description: description
    }),
  }).then((resp) => resp.json())

    .then(function (data) { // Here you get the data to modify as you please
      var result = data.success;

      document.getElementById("form").innerHTML = "";
      document.getElementById("titolo").innerHTML = "Esito creazione club";

      var outcome;

      if (result == true) {
        outcome = "Club creato con successo <br><br>";
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

//----------------------------------------------------------------------------

function create_event() {
  var title = document.getElementById('title').value;
  var club = document.getElementById('club').value;
  var description = document.getElementById('description').value;

  fetch('../api/raduni', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title, description: description, club: club }),
  }).then((resp) => resp.json())

    .then(function (data) {
      var result = data.success;

      document.getElementById("form").innerHTML = "";
      document.getElementById("titolo").innerHTML = "Esito creazione club";

      var outcome;

      if (result == true) {
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
    body: JSON.stringify({ username: username, password: password }),
  }).then((resp) => resp.json())

    .then(function (data) {
      // qui "data" è il json che è stato tornato da  authentication
      //volendo qui puoi fare quello che vuoi con quel json
      if (data.success) {
        window.location = "/home.html"; //se il login è andato, rimando alla home
      } else {
        document.getElementById("login_alert").style = "display: block";
        //window.location = "login.html"; //se il login non è andato, rimando di nuovo alla pagina del login
      }

      return;
    }).catch(error => console.error(error));
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
  else {
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
    body: JSON.stringify({ cookie: cookie }), //inglobo il cookie preso nel body della richiesta post che faccio al server
  }).then((resp) => resp.json()) //penso che resp sia la risposta ricevuta da /api/logout e che qui viene trasformata in json

    .then(function (data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
      // qui "data" è quindi la versione in json della risposta tornata da /api/logout
      if (data.success) {
        window.location = "/logout.html"; //se il login è andato, rimando alla home
      } else {
        window.location = "home.html"; //se il login non è andato, rimando di nuovo alla pagina del login
      }

      return;
    }).catch(error => console.error(error));
};

//----------------------------------------------------------------------------

function add_sub_raduno(titoloRaduno) {
  var cookie = getCookie("token");

  //faccio una POST asincrona alla api che ho in raduni.js
  fetch('../api/raduni/add_subscriber', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: titoloRaduno, cookie: cookie })
  }).then((resp) => resp.json())

    .then(function (data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
      // qui "data" è quindi la versione in json della risposta tornata dalla richiesta

      document.getElementById("btn" + titoloRaduno).disabled = true; //disattiva il bottone dopo averlo premuto

      if (data.success) {
        alert("Iscrizione avvenuta con successo!")
      } else {
        alert("Sei già iscritto a questo evento")
      }

      return;
    }).catch(error => console.error(error));
}

//----------------------------------------------------------------------------

function add_sub_club(nomeClub) {
  var cookie = getCookie("token");

  //faccio una POST asincrona alla api che ho in raduni.js
  fetch('../api/clubs/add_subscriber', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nomeClub, cookie: cookie })
  }).then((resp) => resp.json())

    .then(function (data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
      // qui "data" è quindi la versione in json della risposta tornata dalla richiesta
      console.log(data.message)

      document.getElementById("btn" + nomeClub).classList.add('disabled'); //disattiva il bottone dopo averlo premuto

      if (data.success) {
        document.getElementById("btn" + nomeClub + "feed").classList.remove('disabled'); // attiva il bottone per vedere il club feed
        alert("Iscrizione avvenuta con successo!")
      } else {
        alert("Qualcosa ha impedito la tua iscrizine al club :(")
      }

      return;
    }).catch(error => console.error(error));
}

//----------------------------------------------------------------------------

function remove_sub_club(userName, clubName) {
  //faccio una POST asincrona alla api che ho in raduni.js
  fetch('../api/clubs/remove_subscriber', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomeUtente: userName, nomeClub: clubName })
  }).then((resp) => resp.json())

    .then(function (data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
      // qui "data" è quindi la versione in json della risposta tornata dalla richiesta
      console.log(data.message)

      btnId = "btnRm" + userName;
      document.getElementById(btnId).disabled = true; //disattiva il bottone dopo averlo premuto

      if (data.success) {
        alert("Utente rimosso con successo!")
      } else {
        alert("Ci sono stati problemi nella rimozione dell'utente")
      }

      return;
    }).catch(error => console.error(error));
}

//----------------------------------------------------------------------------

//modifica il contenuto della div con id="clubs" riempiendola solo con club di cui l'utente attivo è proprietario
function filtra_mieiClub() {
  var usernameCookie = getCookie("username");

  $.ajax({
    'url': '/api/clubs',
    'type': 'GET',
    'dataType': 'json',
    'data': { proprietario: usernameCookie },
    'success': function (response) {

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
        if (usernameCookie == null) {
          html = '<br> <div style="text-align:center"> Purtroppo per vedere i tuoi club devi aver fatto il <a href="login.html">login</a></div>';
        }
        else {
          //mostro i club di cui l'utente è proprietario
          html += '<table class="table"><thead style="background-color: #ffb4b0;"><tr><th>Nome club</th><th>Proprietario</th><th style="text-align:center">Gestisci iscritti</th></tr></thead>';
          btnId = 'btnRm' + usernameCookie;
          for (var i = 0; i < response.length; i++) {
            html += "<tr><td>" + response[i].name + "</td><td>" + response[i].owner + '</td><td style="text-align:center"><button id="' + btnId + '" type="button" class="btn btn-outline-primary" onclick="apriPaginaIscritti(\'' + response[i].name + '\')">Iscritti</button></td></tr>';
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
  window.location.href = "iscritti_club.html?nomeClub=" + nomeClub;
}

//----------------------------------------------------------------------------

function show_club_feed(nomeClub) {
  window.location.href = "/club_feed.html?club=" + nomeClub;
}

//----------------------------------------------------------------------------

function show_post_form() {
  document.getElementById('mostrapostform').style = "background-color: #ffb4b0; display: none";
  document.getElementById('form').style = "display: block";
}

//----------------------------------------------------------------------------

function hide_post_form() {
  document.getElementById('mostrapostform').style = "background-color: #ffb4b0; display: block";
  document.getElementById('form').style = "display: none";
}

//----------------------------------------------------------------------------

function create_new_post() {
  var usernameCookie = getCookie("username");

  var parameterList = new URLSearchParams(window.location.search);
  var club = parameterList.get("club"); // prendo il club dai parametri

  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;

  if(title != "" && description != "") {
    fetch('../api/club_posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({club: club,
                            author: usernameCookie,
                            title: title,
                            description: description})
    }).then((resp) => resp.json())

    .then(function(data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
      // qui "data" è quindi la versione in json della risposta tornata dalla richiesta
      console.log(data.message)

      hide_post_form();

      if(data.success) {
        alert("Post creato!");

        show_club_feed(club);
      } else {
        alert("Qualcosa è andato storto");
      }

      return;
      }).catch( error => console.error(error));
  }
}

//----------------------------------------------------------------------------

function remove_post(post_id) {
  fetch('../api/club_posts/remove_post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: post_id})
  }).then((resp) => resp.json())

  .then(function(data) {
    document.getElementById("post" + post_id).innerHTML = ""; // cancello dalla pagina il post appena tolto
    alert("post eliminato!");
  });
}

//----------------------------------------------------------------------------

function show_car_form() {
  document.getElementById('aggiungiautomobile').style = "display: none";
  document.getElementById('form').style = "display: block";
}

//----------------------------------------------------------------------------

function hide_car_form() {
  document.getElementById('aggiungiautomobile').style = "display: block";
  document.getElementById('form').style = "display: none";
}

//----------------------------------------------------------------------------

function add_car() {
  var name = document.getElementById("name").value;
  var license_plate = document.getElementById("license_plate").value;
  var manufacturer = document.getElementById("manufacturer").value;
  var model = document.getElementById("model").value;
  var year = document.getElementById("year").value;
  var image = document.getElementById("image").files[0]; // prendo il file dal form

  if(name != "" && license_plate != "" && manufacturer != "" && model != "" && year != "") {
    fetch('../api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name: name,
                            license_plate: license_plate,
                            manufacturer: manufacturer,
                            model: model,
                            year: year})
    }).then((resp) => resp.json())

    .then(function(data) {
      const formData = new FormData();
      formData.append("image", image);

      fetch('../api/upload/single', {
        method: 'POST',
        body: formData
      }).then((resp) => resp.json())

      .then(function(data) {
        alert("Auto inserita");

        hide_car_form();
      });

      window.location.reload();
    });
  }
}

//----------------------------------------------------------------------------

function show_removal_buttons() {
  var removal_buttons = document.getElementsByClassName("pulsanterimozione");

  if(removal_buttons[0].style.display == "none") {
    for(let removal_button of removal_buttons) {
      removal_button.style = "display: block";
    }

    document.getElementById("pulsanterimozioneauto").innerHTML = "Annulla";
  }
  else {
    for(let removal_button of removal_buttons) {
      removal_button.style = "display: none";
    }

    document.getElementById("pulsanterimozioneauto").innerHTML = "Rimuovi";
  }
}

//----------------------------------------------------------------------------

function removeCar(id) {
  fetch('../api/cars/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({_id: id})
  }).then((resp) => resp.json())

  .then(function(data) {
    alert("Auto rimossa");
    window.location.reload();
  });
}

//----------------------------------------------------------------------------

function remove_ban(userName, clubName) {
  fetch('../api/clubs/remove_ban', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomeUtente: userName, nomeClub: clubName})
  }).then((resp) => resp.json())

  .then(function(data) {

    console.log(data.message);

    if(data.success) {
      //disabilito il bottone se la richiesta è andata a buon fine
      btnId = "btnRmBan" + userName;
      document.getElementById(btnId).disabled = true; 
      
      alert("Utente rimosso dal ban!");
    }
    else {
      alert("Qualcosa è andato storto");
    }

      return;
      }).catch( error => console.error(error));
}

//----------------------------------------------------------------------------
