from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from orders.models import MenuItem, Topping, Extra, OrderHistory


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

# Orders
def orders_view(request):
  if request.method == 'GET':
    return render(request, "orders/orders.html")
  
  if request.method == 'POST':

    print('request.POST: ', request.POST)

    # from orders.models import OrderHistory

    # f = Flight.objects.get(pk=5)
    # p = Passenger(first="Alice", last="Adams")
    # p.save()

    # add = OrderHistory(
    #         data_group=request.POST['data_group'],
    #         data_size=request.POST['data_size'],
    #         extras=request.POST['extras'],
    #         extras_price=request.POST['extras_price'],
    #         name=request.POST['name'],
    #         price=request.POST['price'],
    #         toppings=request.POST['toppings'],
    #         user=request.POST['user'],
    #       )
    # add.save()

    # print('add: ', add)
    # print('OrderHistory: ', OrderHistory.data_group)

    # print('OrderHistory.objects.all(): ', OrderHistory.objects.all())

  return HttpResponse('Success!')

# Success
def success_view(request):
  return render(request, "orders/success.html")