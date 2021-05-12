from django.contrib import admin
from .models import StockData, APIKey

# Register your models here.

class StockDataAdmin(admin.ModelAdmin):
    fields = ['symbol', 'interval', 'json_data']

class APIKeyAdmin(admin.ModelAdmin):
    fields = ['key']

admin.site.register(StockData, StockDataAdmin)
admin.site.register(APIKey, APIKeyAdmin)