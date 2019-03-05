// --------------------- SELECT ITEM ---------------------

// Handle when a user clicks a checkbox on the menu
function select_item(obj) {

  // Variables
  tr_id = obj.getAttribute('data-tr_id');
  td_name = obj.getAttribute('name');
  data_toppings = obj.getAttribute('data-toppings');
  data_extras = obj.getAttribute('data-extras');

  // Hide all
  hide_all();

  // Show toppings
  if (data_toppings === 'true') {
    show_toppings(tr_id);

  // Show extras
  } else if (data_extras === 'true') {
    show_extras(tr_id);
  };

  // Re-activate new checkbox selection
  document.getElementsByName(td_name)[0].checked = true;
};

// --------------------- SHOW EXTRAS ---------------------

// List all extras here
extras_items = 'extras items go here';

// Show extras
function show_extras(tr_id) {

  // Create a new row, <tr>, that includes list of extras.
  const tr_extras = document.createElement('tr');
  const td_extras = document.createElement('td');
  td_extras.innerHTML = extras_items;
  tr_extras.className = 'tr_extras';
  tr_extras.append(td_extras);

  // Add toppings row <tr> to DOM. 
  document.querySelector('tbody').insertBefore(tr_extras, tbody.childNodes[index(tr_id)]);
};

// --------------------- SHOW TOPPINGS ---------------------

// List all toppings here
toppings_items = 'toppings items go here';

// Show toppings
function show_toppings(tr_id) {

  // Create a new row, <tr>, that includes list of toppings.
  const tr_toppings = document.createElement('tr');
  const td_toppings = document.createElement('td');
  td_toppings.innerHTML = toppings_items;
  tr_toppings.className = 'tr_toppings';
  tr_toppings.append(td_toppings);

  // Add toppings row <tr> to DOM. 
  document.querySelector('tbody').insertBefore(tr_toppings, tbody.childNodes[index(tr_id)]);
};

// --------------------- FIND INDEX ---------------------

// Figure out the index of the HTML child objects of <tbody>.
function index (tr_id) {
  var array = [];
  var index = 0;
  for (let i = 0; i < tbody.childNodes.length; i++) {
    array[i] = tbody.childNodes[i];
    if (array[i].id === tr_id) {
      index = i + 1;
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