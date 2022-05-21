function registration() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  fetch('../api/v1/users', {
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
