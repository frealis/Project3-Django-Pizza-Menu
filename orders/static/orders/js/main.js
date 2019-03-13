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

  // List of dictionaries used to keep track of active menu item selections and
  // initialize total price & add it to the DOM on initial page load
  active_selections = []
  let total_price = 0;
  document.querySelector('#total_price').append(total_price.toFixed(2));

  // --------------------- CREATE CHECKBOX ---------------------

  // This function is only called when extras for subs, or toppings for pizzas
  // are displayed, to make checkboxes for those items. These are different from
  // the checkboxes created via HTML on the index.html page. Each checkbox has
  // a class = tr_id which is later used to associate the checkbox with its menu
  // item. The 'limit' parameter is intended to be used for pizza toppings in 
  // order to limit the number of toppings that can be selected depending on the
  // pizza, and the 'price' parameter is intended to add the price of any selected 
  // extras for subs.
  function create_checkbox(tr_id, name, limit, price) {
    const checkbox = document.createElement('input');
    checkbox.className = tr_id;
    checkbox.name = name;
    checkbox.setAttribute("data-price", price);
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

      // Call stage_items() function
      stage_items();
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

  // --------------------- HIDE ---------------------

  // Hide toppings and extras
  function hide(obj, delete_index, scenario) {

    // Variables passed in from <input> attributes on index.html
    tr_id = obj.getAttribute('data-tr_id');

    // Scenario 1: If a different checkbox is checked but in the same row as 
    // active selection, set *.clicked = false and clear that active selection 
    // from active_selections[] 
    if (delete_index && scenario === 1) {
      var as_td_id = active_selections[delete_index[0]]['td_id']
      var uncheck = document.querySelectorAll('[data-td_id = "' + as_td_id + '"]');
      if (uncheck) {
        for (let i = 0; i < uncheck.length; i++) {
          uncheck[i].checked = false;
        };
      };
      delete active_selections[delete_index[0]];
      const items = document.querySelector('[class = "' + tr_id + '"]');
      if (items) {
        items.parentNode.removeChild(items);
      };
    };

    // Scenario 2: If the same checkbox is clicked twice in a row, clear both of 
    // its entries in active_selections[] and hide the items
    if (delete_index && scenario === 2) {
      delete active_selections[delete_index[0]];
      delete active_selections[delete_index[1]];
      const items = document.querySelectorAll('[class = "' + tr_id + '"]');
      if (items) {
        for (let i = 0; i < items.length; i++) {
          items[i].parentNode.removeChild(items[i]);
        };
      };
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
  };

  // --------------------- SELECT ITEM ---------------------

  // Handle when a user clicks a checkbox on the menu
  function select_item(obj) {

    // Get data from individual selected item -- tr_id represents the unique row
    // that the selected menu item is on, and td_id represents its unique checkbox
    data_extras = obj.getAttribute('data-extras');
    data_toppings = obj.getAttribute('data-toppings');
    name = obj.getAttribute('name');
    size = obj.getAttribute('data-size');
    td_id = obj.getAttribute('data-td_id');
    tr_id = obj.getAttribute('data-tr_id');

    // HANDLE EXTRAS ---------------------------------
    if (data_extras === 'true') {

      // Update active selections
      active_selections.push({'td_id': td_id, 'tr_id': tr_id});

      // Show extras items
      show_extras(tr_id, size);

      // Scenario 1: Handle a different checkbox being clicked, but on the same 
      // row as an active selection
      del_scenario_1 = []
      for (let i = 0; i < active_selections.length; i++) {
        if (active_selections[i]) {
          if (!(active_selections[i]['td_id'] === td_id) && active_selections[i]['tr_id'] === tr_id) {
            del_scenario_1.push(i);
          };        
        };
      };
      if (del_scenario_1.length === 1) {
        hide(obj, del_scenario_1, del_scenario_1.length);
      };

      // Scenario 2: Handle the same checkbox being clicked twice
      del_scenario_2 = [];
      for (let i = 0; i < active_selections.length; i++) {
        if (active_selections[i]) {
          if (active_selections[i]['td_id'] === td_id && active_selections[i]['tr_id'] === tr_id) {
            del_scenario_2.push(i);
          };
        };
      };
      if (del_scenario_2.length === 2) {
        hide(obj, del_scenario_2, del_scenario_2.length);
      };
    };
    
    // HANDLE TOPPINGS ---------------------------------
    if (data_toppings === 'true') {

      // Update active selections
      active_selections.push({'td_id': td_id, 'tr_id': tr_id});

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
      } else if (name === 'Special') {
        show_toppings(tr_id, 5);
      };

      // Scenario 1: Handle a different checkbox being clicked, but on the same 
      // row as an active selection
      del_scenario_1 = []
      for (let i = 0; i < active_selections.length; i++) {
        if (active_selections[i]) {
          if (!(active_selections[i]['td_id'] === td_id) && active_selections[i]['tr_id'] === tr_id) {
            del_scenario_1.push(i);
          };        
        };
      };
      if (del_scenario_1.length === 1) {
        hide(obj, del_scenario_1, del_scenario_1.length);
      };

      // Scenario 2: Handle the same checkbox being clicked twice
      del_scenario_2 = [];
      for (let i = 0; i < active_selections.length; i++) {
        if (active_selections[i]) {
          if (active_selections[i]['td_id'] === td_id && active_selections[i]['tr_id'] === tr_id) {
            del_scenario_2.push(i);
          };
        };
      };
      if (del_scenario_2.length === 2) {
        hide(obj, del_scenario_2, del_scenario_2.length);
      };
    };

    stage_items();
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
        td_extras_checkbox.append(create_checkbox(tr_id, extra, size), br_extras_checkbox);

      // Only show the Extra Cheese option for all other subs
      } else {
        if (JSON.parse(storage_extras)[i]['fields']['item'] === 'Extra Cheese') {
          // Create a price variable to be passed to the create_checkbox() 
          // function
          let price = 0;

          // Create list item of 'Extra Cheese' for all subs
          ul_extras.append(create_list(JSON.parse(storage_extras)[i]['fields']['item']));
          
          // Display 'Extra Cheese' price for all subs
          const br_extras_prices = document.createElement('br');
          if (size === 'small') {
            td_extras_price.append('+ ', extra_price_sm, br_extras_prices);
            price = extra_price_sm;
          } else if (size === 'large') {
            td_extras_price.append('+ ', extra_price_lg, br_extras_prices);
            price = extra_price_lg;
          };

          // Create a checkbox - set arbitrary limit number, since the 'limit'
          // parameter is supposed to be used for pizza toppings. Just make sure
          // that the limit set here is always more than the total amount of
          // extras that can go on a sub.
          limit = 10;
          td_extras_checkbox.append(create_checkbox(tr_id, extra, limit, price));
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

      // Create a checkbox, omitting the 'price' parameter
      const br_extras = document.createElement('br');
      td_toppings_checkbox.append(create_checkbox(tr_id, topping, limit), br_extras);
    };

    // Stitch together the toppings row, <tr>, that will be inserted into the DOM
    td_toppings.append(ul_toppings);
    tr_toppings.className = tr_id;
    tr_toppings.append(td_toppings, td_toppings_checkbox);

    // Add toppings row, <tr>, to DOM. 
    document.querySelector('tbody').insertBefore(tr_toppings, tbody.childNodes[index(tr_id) + 1]);
  };

  // --------------------- STAGE ITEMS ---------------------

  // Place currently selected items into a "staging area" that is visible on
  // index.html and updated everytime the select_item() function is called, or
  // everytime an extras or toppings checkbox is checked
  function stage_items() {
    document.querySelector('#current_selections').innerHTML = '';
    document.querySelector('#total_price').innerHTML = '';
    x = document.querySelectorAll('[type="checkbox"]')
    selected_menu_items = [];
    selected_extras_toppings = [];

    // Gather a list of every currently selected item on the menu. Menu item 
    // selections have data-tr_id attributes, and toppings and extras items have 
    // their class attribute = to the tr_id value of the menu item that they are 
    // associated with
    for (let i = 0; i < x.length; i++) {
      if (x[i].dataset.tr_id && x[i].checked) {
        selected_menu_items.push(x[i]);
      };
      if (x[i]['className'] && x[i].checked) {
        selected_extras_toppings.push(x[i]);
      };
    };
  
    // Append selected menu items to a list
    let total_price = 0;
    const ul = document.createElement('ul');
    for (let j = 0; j < selected_menu_items.length; j++) {
      const li = document.createElement('li');
      li.append(selected_menu_items[j].dataset.group, ': ', selected_menu_items[j].name);

      // Append selected extras or toppings to their respective menu item
      let total_extras_price = 0;
      for (let k = 0; k < selected_extras_toppings.length; k++) {
        if (selected_menu_items[j].dataset.tr_id === selected_extras_toppings[k]['className']) {

          // Append extras/toppings item
          const br = document.createElement('br');
          li.append(br, '- ', selected_extras_toppings[k]['name']);

          // Add price if it exists (extras have a price, toppings don't)
          if (selected_extras_toppings[k].dataset.price !== 'undefined') {
            const extras_price = parseFloat(selected_extras_toppings[k].dataset.price)
            console.log(selected_extras_toppings[k].dataset.price);
            total_extras_price += extras_price;
          };
        };
      };

      // Stitch together selected menu items, extras, and toppings and calculate
      // the total price
      const br = document.createElement('br');
      const total_price_individual = parseFloat(selected_menu_items[j].value) + total_extras_price
      
      // console.log(parseFloat(selected_menu_items[j].value));
      
      li.append(br, '$', total_price_individual.toFixed(2));
      ul.append(li);
      total_price += total_price_individual;
    };

    // Place selected items and total price into the DOM
    document.querySelector('#current_selections').appendChild(ul);
    document.querySelector('#total_price').append(total_price.toFixed(2));
  };
});