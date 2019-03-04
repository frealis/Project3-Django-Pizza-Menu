// List all toppings here
toppings_items = 'toppings items go here';

// Create a new row, <tr>, that includes list of toppings, hidden by default.
const tr = document.createElement('tr');
const td = document.createElement('td');
td.className = 'toppings';
td.innerHTML = toppings_items;
td.style.display = 'none';
tr.append(td);

// Checkbox selection & toppings variables
toppings_visible = false;
number_of_selections = 0;
current_selection = "";
previous_selection = "";

// Handle when a user clicks a checkbox on the menu
function select_item(tr_id, td_name) {
  number_of_selections++;
  current_selection = td_name;

  console.log('select_item(tr_id): ', tr_id);
  console.log('select_item(td_name): ', td_name);
  
  // Give var previous_selection a value since it starts off as an empty string
  if (previous_selection === "") {
    previous_selection = current_selection;
  };

  // Handle when a user clicks on an item that was either already selected, or 
  // when nothing on the menu was previously selected
  if (current_selection === previous_selection) {

    // Hide toppings
    if (number_of_selections > 1) {
      hide_toppings();

    // Show toppings
    } else {
      show_toppings(tr_id, td_name);
    };

  // User clicks on an item that was -not- already selected
  } else {

    // Hide toppings & de-select all checkboxes
    hide_toppings();

    // Show toppings
    show_toppings(tr_id, td_name);

    // Re-activate new checkbox selection
    number_of_selections = 1;
    // document.getElementsByName(param)[0].checked = true;
    // console.log(document.getElementsByName(param)[0].checked);
  };
  
  // Update var previous_selection before function exits
  previous_selection = current_selection;
};

// Hide toppings
function hide_toppings() {
  if (number_of_selections > 1) {
    number_of_selections = 0;
    var toppings = document.querySelector('.toppings');
    toppings.style.display = 'none';
    toppings_visible = false;
    var input = document.getElementsByTagName('input')
    for (i = 0; i < input.length; i++) {
      input[i].checked = false;
    };
  };
};

// Show toppings
function show_toppings(tr_id, td_name) {
  if (tr_id !== 'Cheese') {

    // Figure out the index of the HTML child objects of <tbody>.
    var array = [];
    var index = 0;
    for (let i = 0; i < tbody.childNodes.length; i++) {
      array[i] = tbody.childNodes[i];
      if (array[i].id === tr_id) {
        index = i + 1;
      };
    };

    console.log('show_toppings(tr_id): ', tr_id);
    console.log('show_toppings(td_name): ', td_name);

    // Add toppings row <tr> to DOM. 
    document.querySelector('tbody').insertBefore(tr, tbody.childNodes[index]);

    // Toggle toppings visibility
    var toppings = document.querySelector('.toppings');
    if (toppings_visible === false) {
      toppings_visible = true;
      toppings.style.display = 'inline';
    } else {
      toppings_visible = false;
      toppings.style.display = 'none';
    };
  };
};

// [] is CSS attribute selector
// document.querySelector('[id="1 topping"]').append(tr); 