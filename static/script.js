//----------------------------------------------------------------------------

function registration() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var email = document.getElementById('email').value;
  var display_name = document.getElementById('display_name').value;
  var birth_date = document.getElementById('birth_date').value;
  var address = document.getElementById('address').value;
  var phone_number = document.getElementById('phone_number').value;
  var fiscal_code = document.getElementById('fiscal_code').value;
  var password2 = document.getElementById('password2').value;

  if (password == password2 && username != "" && password != "" && email != "" && display_name != "") {
    fetch('../api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
        display_name: display_name,
        birth_date: birth_date,
        address: address,
        phone_number: phone_number,
        fiscal_code: fiscal_code
      }),
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

          window.location.href = "login.html";
        }
        else {
          outcome = "Username già esistente";

          document.getElementById("registration_alert").className = "alert alert-danger";
          document.getElementById("registration_alert").innerHTML = outcome;
          document.getElementById("registration_alert").style = "display: block";
        }

        return;
      }).catch(error => console.error(error));
  }
  else {
    if(password == password2) {
      alert("Compilare tutti i campi richiesti");
    }
    else {
      alert("Le password inserite non corrispondono");
    }
  }
};

//----------------------------------------------------------------------------

function create_club() {
  var name = document.getElementById('name').value;
  var description = document.getElementById('description').value;

  if(name != "" && description != "") {
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
          outcome = "Errore <br><br>";
          outcome += '<form method="get" action="lista_club.html">';
          outcome += '<button class="btn" style="background-color: #ffb4b0;" type="submit" >Torna ai club</button>';
          outcome += '</form>';
        }

        document.getElementById("risultato").innerHTML = outcome;
      });
  }
  else {
    alert("Compilare tutti i campi richiesti");
  }
}

//----------------------------------------------------------------------------

function create_event() {
  var title = document.getElementById('title').value;
  var club = document.getElementById('club').value;
  var description = document.getElementById('description').value;
  var datetime = document.getElementById('datetime').value;

  if(title != "" && club != "" && datetime != "") {
    fetch('../api/raduni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, description: description, club: club, datetime: datetime }),
    }).then((resp) => resp.json())

      .then(function (data) {
        var result = data.success;

        document.getElementById("form").innerHTML = "";
        document.getElementById("titolo").innerHTML = "Esito creazione evento";

        var outcome;

        if (result == true) {
          outcome = "Evento creato con successo <br><br>";
          outcome += '<form method="get" action="prossimi_eventi.html">';
          outcome += '<button class="btn" style="background-color: #ffb4b0;" type="submit" >Mostra tutti gli eventi</button>';
          outcome += '</form>';
        }
        else {
          outcome = "Errore <br><br>";
          outcome += '<form method="get" action="prossimi_eventi.html">';
          outcome += '<button class="btn" style="background-color: #ffb4b0;" type="submit" >Torna agli eventi</button>';
          outcome += '</form>';
        }

        document.getElementById("risultato").innerHTML = outcome;
      });
  }
  else {
    alert("Compilare tutti i campi richiesti");
  }
}

//----------------------------------------------------------------------------

function login() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  if(username != "" && password != "") {
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
  }
  else {
    alert("Compilare tutti i campi richiesti");
  }
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

  //faccio una richiesta POST a /api/logout
  fetch('../api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
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
    body: JSON.stringify({ title: titoloRaduno })
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
        alert("Qualcosa ha impedito la tua iscrizione al club :(")
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

        window.location.reload();
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
            html += "<tr><td>" + response[i].name + "</td><td>" + response[i].owner + '</td><td style="text-align:center"><button id="' + btnId + '" type="button" class="btn btn-outline-primary" onclick="apriPaginaIscrittiClub(\'' + response[i].name + '\')">Iscritti</button></td></tr>';
          }
          html += "</table></div>";
        }


        $('#clubs').html(html); //va a mettere tutto dento all'elemento con id = eventi
      }

    }
  });
}

//----------------------------------------------------------------------------

//modifica il contenuto della div con id="eventi" riempiendola solo con gli eventi di cui l'utente attivo è organizzatore
//WIP SHAG
function filtra_mieiEventi() {
  var usernameCookie = getCookie("username");

  $.ajax({
    'url': '/api/raduni',
    'type': 'GET',
    'dataType': 'json',
    'data': { organizzatore: usernameCookie },
    'success': function (response) {

      if (response) {
        //per modificare la riga sopra alla tabella
        let htmlFiltro = '<br> Mostra nuovamente tutti i raduni<br>'
        htmlFiltro += '<form action="prossimi_eventi.html" method="get">'
        htmlFiltro += '<button type="submit" style="background-color: #ffb4b0;" class="btn"> <i>Mostra</i> </button><br>'
        htmlFiltro += '</form>'
        $('#filtro').html(htmlFiltro);


        //per modificare la lista dei club
        var html = '<br><div class=container-lg textcenter>';

        //se l'utente non è loggato non può filtrare i raduni per vedere solo quelli di cui è organizzatore
        if (usernameCookie == null) {
          html = '<br> <div style="text-align:center"> Per vedere i raduni che hai organizzato devi aver fatto il <a href="login.html">login</a></div>';
        }
        else if (response.length == 0) {
          html += '<br> <div style="text-align:center">'
          html += 'Non hai ancora organizzato nessun raduno <br>'
          html += '<a href="creazione_raduno.html">Crea un nuovo raduno</a>'
          html += '</div>';
        }
        else {
          //mostro i raduni di cui l'utente è organizzatore
          html += '<table class="table"><thead style="background-color: #ffb4b0;"><tr><th>Titolo</th><th>Descrizione</th><th>Club organizzatore</th><th style="text-align:center">Visualizza iscritti</th></tr></thead>';

          for (var i = 0; i < response.length; i++) {
            btnId = 'btnVis' + response[i].title;
            html += "<tr><td>" + response[i].title + "</td><td>" + response[i].description + '</td><td>' + response[i].club + '</td><td style="text-align:center"><button id="' + btnId + '" type="button" class="btn btn-outline-primary" onclick="apriPaginaIscrittiRaduno(\'' + response[i].title + '\')">Iscritti</button></td></tr>';
          }

          html += "</table></div>";
        }


        $('#eventi').html(html); //va a mettere tutto dento all'elemento con id = eventi
      }

    }
  });
}


//----------------------------------------------------------------------------

function apriPaginaIscrittiClub(nomeClub) {
  window.location.href = "iscritti_club.html?nomeClub=" + nomeClub;
}

//----------------------------------------------------------------------------

function apriPaginaIscrittiRaduno(titoloRaduno) {
  window.location.href = "iscritti_raduno.html?titoloRaduno=" + titoloRaduno;
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
  var image = document.getElementById("image").files[0]; // prendo il file dal form

  if (image) {
    var img = "img";
  }

  if (title != "" && description != "") {
    fetch('../api/club_posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        club: club,
        title: title,
        description: description,
        img: img
      })
    }).then((resp) => resp.json())

      .then(function (data) { //il json di "resp" viene poi passato direttamente a questa funzione come parametro
        // qui "data" è quindi la versione in json della risposta tornata dalla richiesta
        console.log(data.message)

        if (image) {
          const formData = new FormData();
          formData.append("image", image);

          fetch('../api/upload/single', {
            method: 'POST',
            body: formData
          }).then((resp) => resp.json())
            .then(function (data) {
              hide_post_form();
            });
        }

        alert("Post creato!");

        show_club_feed(club);

        return;


      }).catch(error => console.error(error));
  }
  else {
    alert("Compilare tutti i campi richiesti");
  }
}

//----------------------------------------------------------------------------

function remove_post(post_id) {
  fetch('../api/club_posts/remove_post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ post_id: post_id })
  }).then((resp) => resp.json())

    .then(function (data) {
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

  if (name != "" && license_plate != "" && manufacturer != "" && model != "" && year != "") {
    fetch('../api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        license_plate: license_plate,
        manufacturer: manufacturer,
        model: model,
        year: year,
        image: image
      })
    }).then((resp) => resp.json())

      .then(function (data) {
        if(image) {
          const formData = new FormData();
          formData.append("image", image);

          fetch('../api/upload/single', {
            method: 'POST',
            body: formData
          }).then((resp) => resp.json())

            .then(function (data) {
              alert("Auto inserita");

              hide_car_form();
            });
        }
        else {
          alert("Auto inserita");

          hide_car_form();
        }

        window.location.reload();
      });
  }
  else {
    alert("Compilare tutti i campi richiesti");
  }
}

//----------------------------------------------------------------------------

function show_removal_buttons() {
  var removal_buttons = document.getElementsByClassName("pulsanterimozione");

  if (removal_buttons[0].style.display == "none") {
    for (let removal_button of removal_buttons) {
      removal_button.style = "display: block";
    }

    document.getElementById("pulsanterimozioneauto").innerHTML = "Annulla";
  }
  else {
    for (let removal_button of removal_buttons) {
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
    body: JSON.stringify({ _id: id })
  }).then((resp) => resp.json())

    .then(function (data) {
      alert("Auto rimossa");
      window.location.reload();
    });
}

//----------------------------------------------------------------------------

function updateProfile() {
  var display_name = document.getElementById("display_name").value;
  var birth_date = document.getElementById("birth_date").value;
  var address = document.getElementById("address").value;
  var phone_number = document.getElementById("phone_number").value;
  var image = document.getElementById("image").files[0]; // prendo il file dal form

  if (image) {
    var img = "img";
  }

  fetch('../api/users/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      display_name: display_name,
      birth_date: birth_date,
      address: address,
      phone_number: phone_number,
      img: img
    })
  }).then((resp) => resp.json())

    .then(function (data) {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        fetch('../api/upload/single', {
          method: 'POST',
          body: formData
        }).then((resp) => resp.json())
          .then(function (data) {
            window.location.href = "profilo.html";
          });
      }
      else {
        window.location.href = "profilo.html";
      }
    });

}

//----------------------------------------------------------------------------

function remove_ban(userName, clubName) {
  fetch('../api/clubs/remove_ban', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nomeUtente: userName, nomeClub: clubName })
  }).then((resp) => resp.json())

    .then(function (data) {

      console.log(data.message);

      if (data.success) {
        //disabilito il bottone se la richiesta è andata a buon fine
        btnId = "btnRmBan" + userName;
        document.getElementById(btnId).disabled = true;

        alert("Utente rimosso dal ban!");

        window.location.reload();
      }
      else {
        alert("Qualcosa è andato storto");
      }

      return;
    }).catch(error => console.error(error));
}

//----------------------------------------------------------------------------

function login_redirect() {
  window.location.href = "login.html";
}

//----------------------------------------------------------------------------
