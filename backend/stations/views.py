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

class StationPricesView(APIView):
    def get(self, request, overpass_id):
        try:
            station = Station.objects.get(overpass_id=overpass_id)
        except Station.DoesNotExist:
            return Response({"error": "Station not found"}, status=status.HTTP_404_NOT_FOUND)

        latest = station.submissions.order_by('-submitted_at').first()
        if not latest:
            return Response({"error": "No price data"}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "regular": latest.regular,
            "premium": latest.premium,
            "diesel": latest.diesel,
            "rating": latest.rating,
            "submitted_at": latest.submitted_at,
        })
    
class AllStationPricesView(APIView):
        def get(self, request):
            stations = Station.objects.all()
            results = []

            for station in stations:
                latest = station.submissions.order_by('-submitted_at').first()
                if latest:
                    results.append({
                        "id": station.overpass_id,
                        "name": station.name,
                        "brand": station.brand if hasattr(station, 'brand') else "Unknown",
                        "lat": station.lat,
                        "lon": station.lon,
                        "regular": latest.regular,
                        "premium": latest.premium,
                        "diesel": latest.diesel,
                        "rating": latest.rating,
                    })

            return Response(results)
    
