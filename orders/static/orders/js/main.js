document.addEventListener('DOMContentLoaded', function() {

  // Retrieve extras and toppings items data from <div> located within <thead>
  // on index.html, which gets serialized in views.py before retrieval here
  storage = document.querySelector('#storage');
  storage_extras = storage.getAttribute('data-storage_extras');
  storage_toppings = storage.getAttribute('data-storage_toppings');

  // Attach 'click' event listeners to all <input> checkboxes on page load
  inputs = document.querySelectorAll('input')
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('click', function() {
      select_item(this);
    });
  };

  // List of dictionaries used to keep track of active menu item selections
  active_selections = []

  // --------------------- CREATE CHECKBOX ---------------------

  function create_checkbox(tr_id, name, limit) {
    const checkbox = document.createElement('input');
    checkbox.name = name
    checkbox.type = 'checkbox';

    // Built-in anonymous onclick function for each checkbox
    checkbox.onclick = function() {
      let count = 0;
      list = document.getElementsByClassName(tr_id);

      // Update the count for the total number of checkboxes selected
      for (let i = 0; i < list.length; i++) {
        if (list[i].checked === true) {
          count++;
        };
      };

      // Disable all other checkboxes if a limit argument exists (3rd argument)
      if (count === limit) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].checked !== true) {
            list[i].disabled = true;
          };
        };
      } else {
        for (let i = 0; i < list.length; i++) {
          list[i].disabled = false;
        };
      };
    };
    return checkbox;
  };

  // --------------------- CREATE LIST ---------------------

  function create_list(name) {
    const li = document.createElement('li');
    li.name = name
    li.innerHTML = name;
    return li;
  }

  // --------------------- HIDE ALL ---------------------

  // Hide toppings and extras
  function hide_all(obj, insertion_deletion) {

    // Variables
    data_extras = obj.getAttribute('data-extras');
    data_toppings = obj.getAttribute('data-toppings');
    name = obj.getAttribute('name');
    size = obj.getAttribute('data-size');
    td_id = obj.getAttribute('data-td_id');
    tr_id = obj.getAttribute('data-tr_id');

    // If the same checkbox is clicked twice in a row, wipe everything/toggle off
    if (insertion_deletion) {
      delete active_selections[insertion_deletion[0]];
      delete active_selections[insertion_deletion[1]];

      console.log('active_selections: ', active_selections);
      console.log('tr_id: ', tr_id);
      console.log(document.querySelectorAll(tr_id));
      console.log(document.querySelectorAll('[class = "' + tr_id + '"]'));

      const extras = document.querySelectorAll('[class = "' + tr_id + '"]');
      console.log(extras);
      if (extras) {
        extras.parentNode.removeChild(extras);
      };
    };

        // Hide all extras & toppings, uncheck all checkboxes
        // const extras = document.querySelector('.tr_extras')
        // if (extras) {
        //   extras.parentNode.removeChild(extras);
        // };
        // const toppings = document.querySelector('.tr_toppings');
        // if (toppings) {
        //   toppings.parentNode.removeChild(toppings);
        // };
        // const input = document.getElementsByTagName('input')
        // for (j = 0; j < input.length; j++) {
        //   input[j].checked = false;
        // };

      // If a selection is changed from small to large or vice-versa, de-select
      // everything and then re-select the current selection, but leave any visible
      // extras or toppings intact
      //  } else if (!(active_selections[i]['td_id'] === td_id)) {

      //   console.log('!active_selections: ', active_selections[i]['td_id'], ' i: ', i);

      //   // Uncheck all checkboxes
      //   const input = document.getElementsByTagName('input');
      //   for (l = 0; l < input.length; l++) {
      //     input[l].checked = false;
      //   };
      // };

        // Re-select the current selection
        // active_selections.push({'td_id': td_id});
        // document.querySelectorAll('[data-td_id = "' + td_id + '"]')[0].checked = true;
      // };
  //   };
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

  // Handle when a user clicks a checkbox on the menu -- basically these
  // checkboxes behave like radio buttons
  function select_item(obj) {

    // Get data from individual selected item -- tr_id represents the unique row
    // that the selected menu item is on, and td_id represents its unique checkbox
    data_extras = obj.getAttribute('data-extras');
    data_toppings = obj.getAttribute('data-toppings');
    name = obj.getAttribute('name');
    size = obj.getAttribute('data-size');
    td_id = obj.getAttribute('data-td_id');
    tr_id = obj.getAttribute('data-tr_id');

    // Show extras
    if (data_extras === 'true') {
      show_extras(tr_id, size);
    };
    
    // Show toppings
    if (data_toppings === 'true') {
      if (name === '1 topping') {
        show_toppings(tr_id, 1);
      } else if (name === '2 toppings') {
        show_toppings(tr_id, 2);
      } else if (name === '3 toppings') {
        show_toppings(tr_id, 3);
      } if (name === '1 item') {
        show_toppings(tr_id, 1);
      } else if (name === '2 items') {
        show_toppings(tr_id, 2);
      } else if (name === '3 items') {
        show_toppings(tr_id, 3);
      };
    };

    // Update active selections
    active_selections.push({'td_id': td_id, 'tr_id': tr_id});

    // If the current selection exists in the active_selections[] list twice, then
    // remove them from the list
    index_deletion = [];
    for (let i = 0; i < active_selections.length; i++) {
      if (active_selections[i]) {
        if (active_selections[i]['td_id'] === td_id && active_selections[i]['tr_id'] === tr_id) {
          index_deletion.push(i)
        };
        if (index_deletion.length === 2) {
          console.log(index_deletion);
          hide_all(obj, index_deletion);
        };
      };
    };

    // Re-activate current checkbox selection
    // document.querySelectorAll('[data-td_id = "' + td_id + '"]')[0].checked = true;
  };

  // --------------------- SHOW EXTRAS ---------------------

  function show_extras(tr_id, size) {

    // Create a new row, <tr>, that includes list of extras.
    const tr_extras = document.createElement('tr');
    const td_extras = document.createElement('td');
    const td_extras_checkbox = document.createElement('td');
    const td_extras_price = document.createElement('td');
    const ul_extras = document.createElement('ul');
    for (let i = 0; i < JSON.parse(storage_extras).length; i++) {

      // Parse storage_extras string and grab the name of the individual extra
      // names and prices
      extra = JSON.parse(storage_extras)[i]['fields']['item']
      extra_price_sm = JSON.parse(storage_extras)[i]['fields']['price_sm']
      extra_price_lg = JSON.parse(storage_extras)[i]['fields']['price_lg']

      // Show all 4 extras items for the Steak + Cheese sub
      if (tr_id === 'Subs + Steak + Cheese') {

        // Create list of sub extras
        ul_extras.append(create_list(JSON.parse(storage_extras)[i]['fields']['item']));

        // Display extras' prices
        const br_extras_prices = document.createElement('br');
        if (size === 'small') {
          td_extras_price.append('+ ', extra_price_sm, br_extras_prices);
        } else if (size === 'large') {
          td_extras_price.append('+ ', extra_price_lg, br_extras_prices);
        };

        // Create a checkbox
        const br_extras_checkbox = document.createElement('br');
        td_extras_checkbox.append(create_checkbox(tr_id, extra), br_extras_checkbox);

      // Only show the Extra Cheese option for all other subs
      } else {
        if (JSON.parse(storage_extras)[i]['fields']['item'] === 'Extra Cheese') {

          // Create list item of 'Extra Cheese' for all subs
          ul_extras.append(create_list(JSON.parse(storage_extras)[i]['fields']['item']));
          
          // Display 'Extra Cheese' price for all subs
          const br_extras_prices = document.createElement('br');
          if (size === 'small') {
            td_extras_price.append('+ ', extra_price_sm, br_extras_prices);
          } else if (size === 'large') {
            td_extras_price.append('+ ', extra_price_lg, br_extras_prices);
          };

          // Create a checkbox
          td_extras_checkbox.append(create_checkbox(tr_id, extra));
        };
      };
    };

    // Stitch together the extras row, <tr>, that will be inserted into the DOM
    td_extras.append(ul_extras);
    tr_extras.className = tr_id;
    tr_extras.append(td_extras, td_extras_price, td_extras_checkbox);

    // Add extras row, <tr>, to DOM. 
    document.querySelector('tbody').insertBefore(tr_extras, tbody.childNodes[index(tr_id) + 1]);
  };

  // --------------------- SHOW TOPPINGS ---------------------

  function show_toppings(tr_id, limit) {

    // Create a new row, <tr>, that includes list of toppings.
    const tr_toppings = document.createElement('tr');
    const td_toppings = document.createElement('td');
    const td_toppings_checkbox = document.createElement('td');
    const ul_toppings = document.createElement('ul');

    for (let i = 0; i < JSON.parse(storage_toppings).length; i++) {

      // Parse storage_toppings string and grab the name of the individual topping
      topping = JSON.parse(storage_toppings)[i]['fields']['item']

      // Create list of pizza toppings
      ul_toppings.append(create_list(topping));

      // Create a checkbox
      const br_extras = document.createElement('br');
      td_toppings_checkbox.append(create_checkbox(tr_id, topping, limit), br_extras);
    };

    // Stitch together the toppings row, <tr>, that will be inserted into the DOM
    td_toppings.append(ul_toppings);
    tr_toppings.className = 'tr_toppings';
    tr_toppings.append(td_toppings, td_toppings_checkbox);

    // Add toppings row, <tr>, to DOM. 
    document.querySelector('tbody').insertBefore(tr_toppings, tbody.childNodes[index(tr_id) + 1]);
  };
});