from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class MenuItem(models.Model):
  group = models.CharField(max_length=64)
  item = models.CharField(max_length=64)
  price_sm = models.DecimalField(max_digits=5, decimal_places=2)
  price_lg = models.DecimalField(max_digits=5, decimal_places=2)
  price = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.group}, {self.item} | small: ${self.price_sm} | large: ${self.price_lg} | single size: ${self.price}"

class ShoppingCart(models.Model):
  user = models.CharField(max_length=64)
  menu_item_id = models.IntegerField()
  menu_item = models.ManyToManyField(
                MenuItem, 
                blank=True, 
                related_name="shopping_cart",
              )
  def __str__(self):
    return f"User: {self.user} | MenuItem ID: {self.menu_item_id} | MenuItem: {self.menu_item}"

# The 50 cent extra cheese option for small & large has not been implemented
# The 50 cent upcharge for mushrooms, peppers, and onions has not been implemented