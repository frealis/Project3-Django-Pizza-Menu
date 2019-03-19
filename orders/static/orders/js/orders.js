document.addEventListener('DOMContentLoaded', function() {

  // Reloads page if user hits the "Back" button
  // https://stackoverflow.com/questions/20899274/how-to-refresh-page-on-back-button-click
  if(!!window.performance && window.performance.navigation.type === 2) {
    console.log('Reloading');
    window.location.reload();
  }

  // Initialize total price for the order
  let total_price = 0;

  // --------------------- CREATE LIST ---------------------

  function create_list(name) {
    const li = document.createElement('li');
    li.name = name
    li.innerHTML = name;
    return li;
  }

  // --------------------- DISPLAY ORDER ---------------------

  // Retrieve and display items from localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const data_group = JSON.parse(localStorage.getItem(i))['data_group'];
    const data_size = JSON.parse(localStorage.getItem(i))['data_size'];
    const name = JSON.parse(localStorage.getItem(i))['name'];
    const price = parseFloat(JSON.parse(localStorage.getItem(i))['value']);

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

    // Append the price of the individual item to the list of orders
    br = document.createElement('br');
    total_individual_price = price + total_extras_price;
    li.append(br, '$', total_individual_price.toFixed(2));

    // Stitch together the <li> element within a <ul> element and then insert it
    // into the DOM
    const ul = document.createElement('ul');
    ul.append(li);
    document.querySelector('#display_orders').append(ul);

    // Add the price of each item, plus any extras from subs, to the total price
    total_price += price + total_extras_price;
  };

  // Append the total price to the DOM
  document.querySelector('#total_price').append(total_price.toFixed(2));
});
