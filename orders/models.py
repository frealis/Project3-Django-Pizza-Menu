from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class MenuItem(models.Model):
  group     = models.CharField(max_length=64)
  item      = models.CharField(max_length=64)
  price_sm  = models.DecimalField(max_digits=5, decimal_places=2)
  price_lg  = models.DecimalField(max_digits=5, decimal_places=2)
  price     = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.group}, {self.item} | small: ${self.price_sm} | large: ${self.price_lg} | 1 size: ${self.price}"

class Topping(models.Model):
  item      = models.CharField(max_length=64)
  def __str__(self):
    return f"{self.item}"

class Extra(models.Model):
  item      = models.CharField(max_length=64)
  price_sm  = models.DecimalField(max_digits=5, decimal_places=2)
  price_lg  = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.item}"

class OrderHistory(models.Model):
  data_group    = models.CharField(max_length=64, default=None)
  data_size     = models.CharField(max_length=64, default=None)
  extras        = models.CharField(max_length=64, default=None)
  extras_price  = models.DecimalField(max_digits=5, decimal_places=2, default=None)
  name          = models.CharField(max_length=64, default=None)
  toppings      = models.CharField(max_length=64, default=None)
  price         = models.DecimalField(max_digits=5, decimal_places=2, default=None)
  user          = models.CharField(max_length=64, default=None)
  def __str__(self):
    return f"User: {self.user}"

# class ShoppingCart(models.Model):
#   user          = models.CharField(max_length=64)
#   menu_item_id  = models.IntegerField()
#   menu_item     = models.ManyToManyField(
#                     MenuItem, 
#                     blank=True, 
#                     related_name="order_history",
#                   )
#   def __str__(self):
#     return f"User: {self.user} | MenuItem ID: {self.menu_item_id} | MenuItem: {self.menu_item}"