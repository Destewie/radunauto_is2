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

  .then(function(data) { // Here you get the data to modify as you please
    if(data.success) {
      result = data.token;
    }

    document.write(result);

    return;
    }).catch( error => console.error(error));
};
