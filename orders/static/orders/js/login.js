document.addEventListener('DOMContentLoaded', function() {

  // Login AJAX Request.
  document.querySelector('#submit-login').onclick = () => {

    // Ensure that both a username and password were entered
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    if (username !== '' && password !== '') {

      // Initialize POST request, extract the CSRF value from the index.html DOM,
      // and put that into the header of the POST request.
      const request = new XMLHttpRequest();
      request.open('POST', '/login');
      const csrf_token = document.querySelector('#csrf').childNodes[0]['value'];
      request.setRequestHeader("X-CSRFToken", csrf_token);

      // The FormData() object can be used to transmit data to the server (ie. 
      // transmit data to views.py).
      const login_data = new FormData();
      login_data.append('username', username);
      login_data.append('password', password);

      // Send login_data (aka FormData()) to views.py, followed by a callback
      // function that executes once a response is received from views.py.
      request.send(login_data);
      request.onload = () => {
        const response = request.responseText;
        const success = JSON.parse(response)['success'];
        const error_message = JSON.parse(response)['message'];

        console.log('===== success: ', success)

        if (success === true) {
          location.reload();
        } else {
          document.querySelector('.error-login').innerHTML = error_message;
        }
      };

      // Disable the default page reload after a POST request.
      return false;
    };
  };
});

function error_login() {
  document.querySelector('.error-login').innerHTML = 'Login error.'
}