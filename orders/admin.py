from django.contrib import admin
from .models import DinnerPlatter, Pasta, RegularPizza, Salad, SicilianPizza, Sub, SubLarge

# Register your models here.
admin.site.register(DinnerPlatter)
admin.site.register(Pasta)
admin.site.register(RegularPizza)
admin.site.register(Salad)
admin.site.register(SicilianPizza)
admin.site.register(Sub)
admin.site.register(SubLarge)