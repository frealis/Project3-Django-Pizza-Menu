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

  // --------------------- CREATE CHECKBOX ---------------------

  function create_checkbox(tr_id, name) {
    const checkbox = document.createElement('input');
    checkbox.className = tr_id;
    checkbox.name = name
    checkbox.type = 'checkbox';
    return checkbox;
  }

  // --------------------- CREATE LIST ---------------------

  function create_list(name) {
    const li = document.createElement('li');
    li.name = name
    li.innerHTML = name;
    return li;
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

  // --------------------- INDEX ---------------------

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
    document.querySelectorAll('[data-td_id = "' + td_id + '"]')[0].checked = true;
  };

  // --------------------- SHOW EXTRAS ---------------------

  // Show extras
  function show_extras(tr_id) {

    // Create a new row, <tr>, that includes list of extras.
    const tr_extras = document.createElement('tr');
    const td_extras = document.createElement('td');
    const td_extras_checkbox = document.createElement('td');
    const ul_extras = document.createElement('ul');
    for (let i = 0; i < JSON.parse(storage_extras).length; i++) {

      // Show all 4 extras items for the Steak + Cheese sub
      if (tr_id === 'Subs + Steak + Cheese') {

       // Create list of sub extras
       ul_extras.append(create_list(JSON.parse(storage_extras)[i]['fields']['item']));
          
        // Create a checkbox
        const br_extras = document.createElement('br');
        td_extras_checkbox.append(create_checkbox(tr_id), br_extras);

      // Only show the Extra Cheese option for all other subs
      } else {
        if (JSON.parse(storage_extras)[i]['fields']['item'] === 'Extra Cheese') {

          // Create list item of 'Extra Cheese' for all subs
          ul_extras.append(create_list(JSON.parse(storage_extras)[i]['fields']['item']));
          
          // Create a checkbox
          td_extras_checkbox.append(create_checkbox(tr_id));
        };
      };
    };

    // Stitch together the extras row, <tr>, that will be inserted into the DOM
    td_extras.append(ul_extras);
    tr_extras.className = 'tr_extras';
    tr_extras.append(td_extras, td_extras_checkbox);

    // Add extras row, <tr>, to DOM. 
    document.querySelector('tbody').insertBefore(tr_extras, tbody.childNodes[index(tr_id) + 1]);
  };

  // --------------------- SHOW TOPPINGS ---------------------

  // Show toppings
  function show_toppings(tr_id) {

    // Create a new row, <tr>, that includes list of toppings.
    const tr_toppings = document.createElement('tr');
    const td_toppings = document.createElement('td');
    const td_toppings_checkbox = document.createElement('td');
    const ul_toppings = document.createElement('ul');

    const tr = document.createElement('tr');
    const td = document.createElement('td');
    const table = document.createElement('table');

    for (let i = 0; i < JSON.parse(storage_toppings).length; i++) {
    // for (let i = 0; i < 5; i++) {

      // Parse storage_toppings string and grab the name of the individual topping
      topping = JSON.parse(storage_toppings)[i]['fields']['item']

      // Create list of pizza toppings
      ul_toppings.append(create_list(topping));
    
      // Create a checkbox
      const br_extras = document.createElement('br');
      td_toppings_checkbox.append(create_checkbox(tr_id, topping), br_extras);
    };

    // Stitch together the toppings row, <tr>, that will be inserted into the DOM
    td_toppings.append(ul_toppings);
    tr_toppings.className = 'tr_toppings';
    tr_toppings.append(td_toppings, td_toppings_checkbox);

    // Add toppings row, <tr>, to DOM. 
    document.querySelector('tbody').insertBefore(tr_toppings, tbody.childNodes[index(tr_id) + 1]);
  };
});

  // --------------------- CREATE SPAN ---------------------

  function create_span(name) {
    const span = document.createElement('span');
    span.name = name
    span.innerHTML = name;
    return span;
  }