from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework import generics
from .serializers import StockDataSerializer
from rest_framework.response import Response
from .models import StockData, APIKey
from django.http import HttpResponse
from datetime import date, datetime
import requests, pytz

# Create your views here.

TEST = True

class StockDataView(generics.ListAPIView):
    queryset = StockData.objects.all()
    serializer_class = StockDataSerializer

def get_stock_data(request):
    api_key_obj = APIKey.objects.last()
    api_key = api_key_obj.key
    if not api_key_obj:
        if not TEST:
            return HttpResponse('Please add an API key to use this service', status=500)
        api_key = 'AK4LITYUAYB5FWD9'

    if request.method == 'GET':
        symbol, interval = request.GET.get('symbol', ''), request.GET.get('interval', '')
        latest_query = StockData.objects.filter(symbol=symbol).last()
        if latest_query:
    
            json_data = latest_query.json_data
            
            if not 'Meta Data' in json_data or not '3. Last Refreshed' in json_data['Meta Data']: 
                return JsonResponse(latest_query.json_data)

            date_info = json_data['Meta Data']['3. Last Refreshed']

            last_date_time = datetime.strptime(date_info, '%Y-%m-%d %H:%M:%S')
            cur_date_time = datetime.now(tz=pytz.timezone('US/Eastern')).replace(tzinfo=None)
            out_of_time = not (cur_date_time.hour >= 14 and cur_date_time.hour < 20)
    
            if out_of_time or (cur_date_time - last_date_time).total_seconds() <= int(interval) * 60:
                return JsonResponse(json_data)

        payload = {
            'function': 'TIME_SERIES_INTRADAY',
            'symbol': symbol,
            'interval': f'{interval}min',
            'apikey': api_key,
        }
        r = requests.get('https://www.alphavantage.co/query', params=payload)
        
        cached_query = StockData(symbol=symbol, interval=interval, json_data=r.json())
        cached_query.save()
        
        return JsonResponse(r.json())
    
    return HttpResponse('')