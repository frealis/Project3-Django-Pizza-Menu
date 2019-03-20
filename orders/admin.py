from django.contrib import admin
from .models import MenuItem, OrderHistory, Topping, Extra


# Register your models here.
admin.site.register(MenuItem)
admin.site.register(OrderHistory)
admin.site.register(Topping)
admin.site.register(Extra)