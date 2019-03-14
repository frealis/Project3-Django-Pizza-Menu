from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from orders.models import MenuItem, Topping, Extra

# Create your views here.

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

# Test
def test_view(request):
  if request.method == "POST":
    print('============= test_view() called =============')
    # x = request.POST
    # print(request)

    # # Query for currency exchange rate
    # currency = request.form.get("currency")
    # res = requests.get("http://api.fixer.io/lastest", params={
    #   "base": "USD", "symbols": currency})

    # Collect data on every checkbox that is selected
    # checked = request.form.get("1 topping")
    # print(checked)

    # # Make sure request succeeded
    # if res.status_code != 200:
    #   return jsonify({"success": False})

    # # Make sure currency is in response
    # data = res.json()
    # if currency not in data["rates"]:
    #   return jsonify({"success": False})

    # # This happens if everything is ok
    # return jsonify({"success": True, "rate": data["rates"][currency]})

    context = {
      # "form_data": request.POST["Cheese"],
    }

      # return HttpResponseRedirect(reverse("test")
      # return HttpResponseRedirect(reverse("flight", args=(flight_id,)))
    return render(request, "orders/test.html", context)