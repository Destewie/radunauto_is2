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

    document.write(result);

    return;
    }).catch( error => console.error(error));
};

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
      result = "Daje chicco sei dentro";
    }

    document.write(result);

    return;
    }).catch( error => console.error(error));
};