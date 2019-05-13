# Web Programming with Python and JavaScript - Project 3

# Description

- This is project 3 for CS50 Web Development with Python and Javascript. It is a website built using Django that features the menu for a restaurant called "Pinochio's Pizza & Subs" and allows visitors to create a profile, login, select items from the menu to order, view the total price of the order, and "place" an order. When an order is placed, a record of it is stored in an sqlite3 database (a local database only used for development purposes). 

- Additionally, a test request is made to the Stripe API which is a service used to process online payments. This project is in the development phase and not yet suitable for production -- you'd probably want to use an external database and use a Stripe production API key in order to actually process customer transactions.

# Configuration, Structure - Run Locally

- Navigate to the ~/project3 folder and run pip3 install -r requirements.txt to make sure that Django is installed -- requirements.txt lists Django==2.0.3

- Start the Django pizza application from within ~/project3 by running:

  $ python manage.py runserver

  ... and the website should be accessible at 127.0.0.1:8000. 

- To start the web application locally using the Heroku Local CLI plugin:

  $ heroku local web -f Procfile.windows

  ... and the website should be accessible at localhost:5000.

- The structure of this Django project follows something like this: the project itself, project3, is named "pizza", and the app that handles orders is called "orders". So within the project3/ folder there is a project3/pizza/ folder and a project3/orders/ folder, and the confusing thing they both contain a urls.py file. 

  > Within the pizza/ folder:
  
    1. settings.py -- the only thing which has been added to it are some settings involving the static/ folder. 

    2. urls.py
      - links "" to orders/urls.py 
      - links "admin/" to a built-in Django app which allows a GUI to interact with and modify the sqlite3 database

  > Within the orders/ folder:
  
    1. urls.py -- establishes all of the URL syntax for the orders app (which has been linked from the urls.py file within the pizza/ folder), and links these URL routes to functions within the views.py file 

    2. views.py -- controls what happens when a user visits a URL route (acts like app.py, or application.py, in a FLASK application)

    3. models.py -- create the structure of tables to be used with the sqlite3 database
      - to create the SQL commands to reflect the changes to any tables within models.py, you create a "migration" file, which is stored in ~/orders/migrations/, by running:

        $ python manage.py makemigrations

      - to apply the SQL located within migration files and alter the database, run:

        $ python.manage.py migrate

    4. admin.py -- add models from ~/orders/models.py to admin.py in order to track them using the built-in Django admin GUI

- To open the Django shell where you can run Python commands, including commands that can manipulate the sqlite3 database, navigate to ~/project3 and run:
  
    $ python manage.py shell

- If using git for version control, be sure to add *.pyc, __pycache__/, and *.sqlite3 to .gitignore.

# What's contained in the files

_login.html, views.py_
  - When a user visits the site they are given an option to login or to register a new account:

    1. If a user tries to register, views.py makes sure that all required fields are filled out and if so then a new 'user' object is created via Django's built-in User model imported from django.contrib.auth.models and the data is stored in the database, and then the user is "logged in" through Django's built-in authentication() and login() functions imported from django.contrib.auth.

    2. If a user tries to log in, views.py uses the authentication() function to ensure that they have a correct combination of username & password, and if so then it uses the login() function to log them in and create a user object associated with the account. Both functions are imported from django.contrib.auth.

_index.html, index.js, models.py, views.py_
  - The index.html page displays a header with the username, a logout link, a link to view any items that have been added to the order (aka, "shopping cart"), and a counter which keeps track of the number of items added to the order.

  - Below the header there are two sections: the menu, and a list of currently selected items. The menu is divided into 6 categories with each item listed by price, size, and selectable by clicking on its checkbox. When an item's checkbox is checked, that item is included in the list of currently selected items. The data for these menu items, toppings, and extras, are made available to index.html by retrieving them from the sqlite3 database which come from the MenuItem, Extra, and Topping models that are imported from orders.models and exist within the file ~/orders/models.py. The data is stored in a variable named "context" which is passed to index.html from views.py. The data can then be referenced directly from within index.html using templating syntax, ex. {{ user }}, {{ menu }}, etc.
  
  - Multiple items can be added to the list simultaneously, -except- any items with toppings or extras that come in both Small or Large sizes -- in these cases, only either the Small or the Large option can be selected, not both (this was a design decision that could be better). The reason is that when an item with toppings or extras is selected, a new row is added beneath that item that allows the user to select the different toppings or extras options, and for space reasons it was decided to only allow one of either a Small or Large option to be selected at a time.

  - Once the user is satisfied with their selections, they can hit the "Add to Order" button to move these items into localStorage, and the "x items ordered" counter is updated to reflect the total number of items added to the order (aka, the "shopping cart"). This clears all of the items in the list of currently selected items. Note: at this point, if a user had previous selected a Small item with toppings or extras and added that to their order, they could now select a Large version of the same item and add it to their order. This is a sort of work-around for the multiple sizes exclusion problem mentioned earlier.

  - Once a user is satisfied with their order, they can hit the "View Orders" button in the header which takes them to the orders.html page where they can then view their total order and the total price.

_orders.html, orders.js, views.py_
  - At the top of the orders.html page the displayed header is similar to the one on index.html. There is also a "Back to Menu" button which links back to index.html.

  - The main section of the page shows a list which represents the current order, aka "shopping cart". It consists of a simple header that reads "Order:" along with a button that reads "Place Order". These two items act as a small header for this section, and are dynamically generated with JavaScript from within orders.js. 
  
  - Next, any items in localStorage that have their "user" attribute equal to the user name that is extracted from the DOM are displayed in a list, along with their individual price, and the total price for all items. 

  - If the user is satisfied with their order, they can hit the "Place Order" button which does three things:

    1. Store the localStorage data that is associated with all of the items in the order in the sqlite3 database.

    2. Create a "charge" object using the Stripe library and send relevant data about the order to the Stripe API to process the money transaction (currently only works in testing mode, not ready for production).

    3. Erase all of the order items from localStorage, remove the order header (not the main page header) and generate a message that reads "Your order has been placed!" using JavaScript from orders.js to replace the order header.

# Personal touch

- The personal touch was integrating the Stripe library & interacting with the Stripe API whenever an order is placed to process a money transaction (although in its current state it is still in development and not suitable for production).

# Transferring Data from One Database to Another (ie. from sqlite3 to Postgres)

- In order to switch local databases from the stock sqlite3 database to a local Postges database (assuming one is installed on the local computer), you can use Django's manage.py program:

  1. Store data from the sqlite3 database as a *.json file:

    $ python manage.py dumpdata > dump.json

  2. Swap the DATABASE settings in settings.py from sqlite3 to Postgres

  3. Migrate the existing database schema to the new local Postgres database:

    $ python manage.py makemigrations (if necessary)
    $ python manage.py migrate

  4. python manage.py loaddata dump.json

  ... at this point the data may fail to load from dump.json into the new local Postgres database because, for some reason, manage.py encodes dump.json as utf-8-bom. You can write a script to remove the BOM (byte order marker) from dump.json, and make it usable in step #4, with a Python script like this:

-- decode-utf-8-bom.py

  # Syntax: python decode-utf-8-bom <read file> <write file>

  import sys

  file_write = open(sys.argv[2], mode='w', encoding="utf-8")

  with open(sys.argv[1], mode='r', encoding='utf-8-sig') as file_read:
    for line in file_read:
      file_write.write(line)

  file_write.close()

  ... so you can use this script locally to update a local Postgres database that is used for development, or you can push the script & local database data (assuming you have used the above script or otherwise have your data in plain utf-8 encoding) to Heroku and then insert it into the Heroku Postgres database like this:

  $ heroku run python manage.py loaddata dump_no_BOM.json

  ... where 'dump_no_BOM.json' is your local database data that has utf-8 encoding.