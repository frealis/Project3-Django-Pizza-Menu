from django.db import models

# Create your models here.
class Customer(models.Model):
  first_name = models.CharField(max_length=64)
  last_name = models.CharField(max_length=64)
  email = models.CharField(max_length=64)
  password = models.CharField(max_length=64)

class DinnerPlatter(models.Model):
  type = models.CharField(max_length=64)
  price_sm = models.DecimalField(max_digits=5, decimal_places=2)
  price_lg = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.type} | small: ${self.price_sm} | large: ${self.price_lg}"

class Pasta(models.Model):
  type = models.CharField(max_length=64)
  price = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.type} | ${self.price}"

class RegularPizza(models.Model):
  type = models.CharField(max_length=64)
  price_sm = models.DecimalField(max_digits=5, decimal_places=2)
  price_lg = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.type} | small: ${self.price_sm} | large: ${self.price_lg}"

class Salad(models.Model):
  type = models.CharField(max_length=64)
  price = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.type} | ${self.price}"

class SicilianPizza(models.Model):
  type = models.CharField(max_length=64)
  price_sm = models.DecimalField(max_digits=5, decimal_places=2)
  price_lg = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.type} | small: ${self.price_sm} | large: ${self.price_lg}"

class Sub(models.Model):
  type = models.CharField(max_length=64)
  price_sm = models.DecimalField(max_digits=5, decimal_places=2)
  price_lg = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.type} | small: ${self.price_sm} | large: ${self.price_lg}"
    
class SubLarge(models.Model):
  type = models.CharField(max_length=64)
  price_lg = models.DecimalField(max_digits=5, decimal_places=2)
  def __str__(self):
    return f"{self.type} | large: ${self.price_lg}"

# The 50 cent extra cheese option for small & large has not been implemented