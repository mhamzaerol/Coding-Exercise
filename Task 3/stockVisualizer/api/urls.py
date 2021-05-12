from django.contrib import admin
from django.urls import path
from .views import StockDataView, get_stock_data

urlpatterns = [
    path('list-view', StockDataView.as_view()),
    path('query', get_stock_data),
]
