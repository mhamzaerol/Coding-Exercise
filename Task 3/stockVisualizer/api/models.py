from django.db import models

# Create your models here.

class StockData(models.Model):
    class Meta:
        ordering = ['id']

    symbol = models.CharField(max_length=20)
    interval = models.PositiveIntegerField()
    json_data = models.JSONField()

class APIKey(models.Model):
    key = models.CharField(max_length=20)