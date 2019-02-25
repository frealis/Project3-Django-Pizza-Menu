from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.models import User

# Create your views here.

# Index
def index(request):
    if not request.user.is_authenticated:
        return render(request, "orders/login.html", {"message": None})
    context = {
        "user": request.user
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
