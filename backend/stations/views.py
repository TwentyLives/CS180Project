from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Station, GasPriceSubmission

class GasPriceSubmitView(APIView):
    def post(self, request):
        station_data = request.data.get('station')
        prices = request.data.get('prices')

        if not station_data or not prices:
            return Response({"error": "Missing station or prices"}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create the station by overpass_id
        overpass_id = station_data.get('overpass_id')
        if not overpass_id:
            return Response({"error": "Missing station overpass_id"}, status=status.HTTP_400_BAD_REQUEST)

        station, _ = Station.objects.get_or_create(
            overpass_id=overpass_id,
            defaults={
                "name": station_data.get("name"),
                "lat": station_data.get("lat"),
                "lon": station_data.get("lon"),
            }
        )

        # Create a new gas price submission
        GasPriceSubmission.objects.create(
            station=station,
            regular=prices.get("regular"),
            premium=prices.get("premium"),
            diesel=prices.get("diesel"),
            rating=prices.get("rating", 0)
        )

        return Response({"message": "Gas price submitted!"}, status=status.HTTP_201_CREATED)
