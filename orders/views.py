from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from orders.models import MenuItem, Topping, Extra, OrderHistory

# Index
def index(request):
  if not request.user.is_authenticated:
    return render(request, "orders/login.html", {"message": None})
  context = {
    "user": request.user,
    "menu": MenuItem.objects.all(),
    "toppings": serializers.serialize('json', Topping.objects.all()),
    "extras": serializers.serialize('json', Extra.objects.all()),
  }
  return render(request, "orders/index.html", context)

# Login
def login_view(request):
  # Grab username & password submitted via POST request
  username = request.POST["username"]
  password = request.POST["password"]
  # Django built-in username & password authentication
  user = authenticate(request, username=username, password=password)
  if user is not None:
    # Django built-in login
    login(request, user)
    return HttpResponseRedirect(reverse("index"))
  else:
    return render(request, "orders/login.html", {"message": "Invalid credentials."})

# Logout
def logout_view(request):
  logout(request)
  return render(request, "orders/logout.html", {"message": "Logged out."})

# Register
def register_view(request):
  # Grab username & password submitted via POST request
  username = request.POST["username"]
  password = request.POST["password"]
  first_name = request.POST["first_name"]
  last_name = request.POST["last_name"]
  email = request.POST["email"]

  # Create a User object which is part of Django's authentication system --
  # I'm not sure where exactly these User objects are stored
  user = User.objects.create_user(username, email, password)
  user.first_name = first_name
  user.last_name = last_name
  user.save()

  # Log user in after registration
  user = authenticate(request, username=username, password=password)
  if user is not None:
    login(request, user)
    return HttpResponseRedirect(reverse("index"))
  else:
    return render(request, "orders/login.html", {"message": "Invalid credentials."})

# Orders
def orders_view(request):
  if request.method == 'GET':
    return render(request, "orders/orders.html")
  
  if request.method == 'POST':

    # Save order data to the database
    add = OrderHistory(
            data_group=request.POST['data_group'],
            data_size=request.POST['data_size'],
            extras=request.POST['extras'],
            extras_price=request.POST['extras_price'],
            name=request.POST['name'],
            price=request.POST['price'],
            toppings=request.POST['toppings'],
            user=request.POST['user'],
          )
    add.save()

    # Make API request to Stripe to create a charge
    # Set your secret key: remember to change this to your live secret key in production
    # See your keys here: https://dashboard.stripe.com/account/apikeys    
    try:
      # Use Stripe's library to make requests...
      import stripe
      stripe.api_key = "sk_test_1xe9xL3ilJwRXLABHF1JfPhL00QFOSOlPx"

      charge = stripe.Charge.create(
      amount=2000,
      currency="usd",
      source="tok_visa", # obtained with Stripe.js
      metadata={'order_id': '6735'}
      )
      pass
    except stripe.error.CardError as e:
      # Since it's a decline, stripe.error.CardError will be caught
      body = e.json_body
      err  = body.get('error', {})

      print("Status is: %s" % e.http_status)
      print("Type is: %s" % err.get('type'))
      print("Code is: %s" % err.get('code'))
      # param is '' in this case
      print("Param is: %s" % err.get('param'))
      print("Message is: %s" % err.get('message'))
    except stripe.error.RateLimitError as e:
      # Too many requests made to the API too quickly
      pass
    except stripe.error.InvalidRequestError as e:
      # Invalid parameters were supplied to Stripe's API
      pass
    except stripe.error.AuthenticationError as e:
      # Authentication with Stripe's API failed
      # (maybe you changed API keys recently)
      pass
    except stripe.error.APIConnectionError as e:
      # Network communication with Stripe failed
      pass
    except stripe.error.StripeError as e:
      # Display a very generic error to the user, and maybe send
      # yourself an email
      pass
    except Exception as e:
      # Something else happened, completely unrelated to Stripe
      pass

    print(charge)


  return HttpResponse('Success!')

# Success
def success_view(request):
  return render(request, "orders/success.html")