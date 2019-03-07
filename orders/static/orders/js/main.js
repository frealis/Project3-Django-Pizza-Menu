document.addEventListener('DOMContentLoaded', function() {

  // Retrieve extras and toppings items data from <div> located within <thead>
  // on index.html, which gets serialized in views.py before retrieval here
  storage = document.querySelector('#storage');
  storage_extras = storage.getAttribute('data-storage_extras');
  storage_toppings = storage.getAttribute('data-storage_toppings');

  // Attach 'click' event listeners to all <input> buttons
  inputs = document.querySelectorAll('input')
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('click', function() {
      select_item(this);
    });
  };

  // --------------------- SELECT ITEM ---------------------

  // Handle when a user clicks a checkbox on the menu
  function select_item(obj) {

    // Get data from individual selected item -- tr_id represents the unique row
    // that the selected menu item is on, and td_id represents its unique checkbox
    tr_id = obj.getAttribute('data-tr_id');
    td_id = obj.getAttribute('data-td_id');
    data_toppings = obj.getAttribute('data-toppings');
    data_extras = obj.getAttribute('data-extras');

    // Hide all selections, extras, and toppings
    hide_all();

    // Show extras
    if (data_extras === 'true') {
      show_extras(tr_id);

    // Show toppings
    } else if (data_toppings === 'true') {
      show_toppings(tr_id);
    };

    // Re-activate current checkbox selection
    // document.getElementsByName(td_id)[0].checked = true;
    document.querySelectorAll('[data-td_id = "' + td_id + '"]')[0].checked = true;
  };

  // --------------------- SHOW EXTRAS ---------------------

  // Show extras
  function show_extras(tr_id) {

    // Create a new row, <tr>, that includes list of extras.
    const tr_extras = document.createElement('tr');
    const td_extras = document.createElement('td');
    const td_extras_input = document.createElement('td');
    const ul_extras = document.createElement('ul');
    for (let i = 0; i < JSON.parse(storage_extras).length; i++) {

      // Show all 4 extras items for the Steak + Cheese sub
      if (tr_id === 'Subs + Steak + Cheese') {
        const li_extras = document.createElement('li');
        li_extras.innerHTML = JSON.parse(storage_extras)[i]['fields']['item'];
        ul_extras.append(li_extras);
        const br_extras = document.createElement('br');
        td_extras_input.append(create_checkbox(tr_id), br_extras);

      // Only show the Extra Cheese option for all other subs
      } else {
        if (JSON.parse(storage_extras)[i]['fields']['item'] === 'Extra Cheese') {
          const li_extras = document.createElement('li');
          li_extras.innerHTML = JSON.parse(storage_extras)[i]['fields']['item'];
          ul_extras.append(li_extras);
          const br_extras = document.createElement('br');
          td_extras_input.append(create_checkbox(tr_id), br_extras);
        };
      };
    };

    // Stitch together the extras row, <tr>, that will be inserted into the DOM
    td_extras.append(ul_extras);
    tr_extras.className = 'tr_extras';
    tr_extras.append(td_extras, td_extras_input);

    // Add extras row, <tr>, to DOM. 
    document.querySelector('tbody').insertBefore(tr_extras, tbody.childNodes[index(tr_id) + 1]);
  };

// --------------------- CREATE CHECKBOX ---------------------

  function create_checkbox(tr_id) {
    // const br_extras = document.createElement('br');
    const input_extras = document.createElement('input');
    input_extras.className = tr_id
    input_extras.type = 'checkbox'
    return input_extras
    // td_extras_input.append(input_extras, br_extras);
  }

  // --------------------- SHOW TOPPINGS ---------------------

  // List all toppings here
  toppings_items = 'toppings items go here';

  // Show toppings
  function show_toppings(tr_id) {

    // Create a new row, <tr>, that includes list of toppings.
    const tr_toppings = document.createElement('tr');
    const td_toppings = document.createElement('td');
    const ul_toppings = document.createElement('ul');
    for (let i = 0; i < JSON.parse(storage_toppings).length; i++) {
      const li_toppings = document.createElement('li');
      li_toppings.innerHTML = JSON.parse(storage_toppings)[i]['fields']['item'];
      ul_toppings.append(li_toppings);
    }
    td_toppings.append(ul_toppings);
    tr_toppings.className = 'tr_toppings';
    tr_toppings.append(td_toppings);

    // Add toppings row, <tr>, to DOM. 
    document.querySelector('tbody').insertBefore(tr_toppings, tbody.childNodes[index(tr_id) + 1]);
  };

  // --------------------- FIND INDEX ---------------------

  // Figure out the index of the HTML child objects of <tbody>, namely topping and
  // extra rows, <tr>'s, within the DOM.
  function index (tr_id) {
    var array = [];
    var index = 0;
    for (let i = 0; i < tbody.childNodes.length; i++) {
      array[i] = tbody.childNodes[i];
      if (array[i].id === tr_id) {
        index = i;
      };
    };
    return index;
  }

  // --------------------- HIDE ALL ---------------------

  // Hide toppings and extras
  function hide_all() {

    // Hide extras
    var extras = document.querySelector('.tr_extras');
    if (extras) {
      extras.parentNode.removeChild(extras);
    }

    // Hide toppings
    var toppings = document.querySelector('.tr_toppings');
    if (toppings) {
      toppings.parentNode.removeChild(toppings);
    }

    // Uncheck all checkboxes
    var input = document.getElementsByTagName('input')
    for (i = 0; i < input.length; i++) {
      input[i].checked = false;
    };
  };
});