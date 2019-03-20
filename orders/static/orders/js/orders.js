document.addEventListener('DOMContentLoaded', function() {

  // Reloads page if user hits the "Back" button
  // https://stackoverflow.com/questions/20899274/how-to-refresh-page-on-back-button-click
  if(!!window.performance && window.performance.navigation.type === 2) {
    console.log('Reloading');
    window.location.reload();
  }

  // Initialize total price for the order & get user name from the DOM
  let total_price = 0;
  let user = document.querySelector('#user').innerHTML;

  // --------------------- CREATE LIST ---------------------

  function create_list(name) {
    const li = document.createElement('li');
    li.name = name
    li.innerHTML = name;
    return li;
  }

  // --------------------- DISPLAY ORDER ---------------------

  // Enable the "Place Order" button if at least 1 order item exists
  document.querySelector('#place_order').disabled = true;
  for (let i = 0; i < localStorage.length; i++) {
    if (JSON.parse(localStorage.getItem(i))['user'] === user) {
      document.querySelector('#place_order').disabled = false;
    };
  };

  // Retrieve and display items from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    if (JSON.parse(localStorage.getItem(i))['user'] === user) {
      const data_group  = JSON.parse(localStorage.getItem(i))['data_group'];
      const data_size   = JSON.parse(localStorage.getItem(i))['data_size'];
      const name        = JSON.parse(localStorage.getItem(i))['name'];
      const price       = parseFloat(JSON.parse(localStorage.getItem(i))['value']);

      // Enclose each ordered item within an <li> element
      var item = '';
      if (data_size === undefined) {
        item = data_group + ', ' + name;
      } else {
        item = data_group + ', ' + name + ', ' + data_size;
      };
      const li = create_list(item);

      // Append any extras that were selected for subs items
      extras = JSON.parse(localStorage.getItem(i))['extras'];
      let total_extras_price = 0;
      if (extras.length !== 0) {
        for (let j = 0; j < extras.length; j++) {
          br_extras = document.createElement('br');
          li.append(br_extras, '- ', extras[j])
        };
        total_extras_price += JSON.parse(localStorage.getItem(i))['extras_price'];
      };

      // Append any toppings that were selected for pizza items
      toppings = JSON.parse(localStorage.getItem(i))['toppings'];
      if (toppings.length !== 0) {
        for (let j = 0; j < toppings.length; j++) {
          br_toppings = document.createElement('br');
          li.append(br_toppings, '- ', toppings[j])
        };
      };

      // Append the price of the individual item and any extras to the list of 
      // orders
      br = document.createElement('br');
      total_individual_price = price + total_extras_price;
      li.append(br, '$', total_individual_price.toFixed(2));

      // Stitch together the <li> element within a <ul> element and then insert it
      // into the DOM
      const ul = document.createElement('ul');
      ul.append(li);
      document.querySelector('#display_orders').append(ul);``

      // Add the price of each item, plus any extras from subs, to the total price
      total_price += price + total_extras_price;
    };
  };

  // Append the total price to the DOM
  document.querySelector('#total_price').append(total_price.toFixed(2));

  // --------------------- SEND LOCALSTORAGE DATA TO SERVER ---------------------

  document.querySelector('#place_order').onclick = () => {

    // Initialize POST request, extract the CSRF value from the index.html DOM,
    // and put that into the header of the POST request
    const request = new XMLHttpRequest();
    request.open('POST', '/orders');
    const csrf_token = document.querySelector('#csrf').childNodes[0]['value'];
    request.setRequestHeader("X-CSRFToken", csrf_token);

    // Retrieve items from localStorage and append them to localStorage_data
    const localStorage_data = new FormData();
    for (let i = 0; i < localStorage.length; i++) {
      if (JSON.parse(localStorage.getItem(i))['user'] === user) {
        let data_group    = JSON.parse(localStorage.getItem(i))['data_group'];
        let data_size     = JSON.parse(localStorage.getItem(i))['data_size'];
        let extras        = JSON.parse(localStorage.getItem(i))['extras'];
        let extras_price  = JSON.parse(localStorage.getItem(i))['extras_price'];
        let name          = JSON.parse(localStorage.getItem(i))['name'];
        let toppings      = JSON.parse(localStorage.getItem(i))['toppings'];
        let price         = parseFloat(JSON.parse(localStorage.getItem(i))['value']);

        // Append data to localStorage_data
        localStorage_data.append('data_group',    data_group);
        localStorage_data.append('data_size',     data_size);
        localStorage_data.append('extras',        extras);
        localStorage_data.append('extras_price',  extras_price);
        localStorage_data.append('name',          name);
        localStorage_data.append('toppings',      toppings);
        localStorage_data.append('price',         price);
        localStorage_data.append('user',          user);

        // console.log(JSON.parse(localStorage.getItem(i)));
      };
    };

    // Send localStorage_data to views.py so that it can store all of the order
    // information in the database. Note -- this AJAX-type request sends the
    // order data to the server for storage, but the button on orders.html when 
    // clicked submits a GET request to redirect to success.html.
    request.send(localStorage_data);

    // Clear out the ordered items that were just sent to the server for database
    // storage from client-side localStorage
    localStorage_length = localStorage.length
    for (let i = 0; i < localStorage_length; i++) {
      if (JSON.parse(localStorage.getItem(i))['user'] === user) {
        localStorage.removeItem(i);
      };
    };
  };
});