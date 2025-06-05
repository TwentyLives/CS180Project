from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Vehicle, RefuelLog
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from .serializers import VehicleSerializer, RefuelLogSerializer

class VehicleListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        vehicles = Vehicle.objects.filter(user=request.user)
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VehicleDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        vehicle = get_object_or_404(Vehicle, pk=pk, user=request.user)
        vehicle.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RefuelLogListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, vehicle_id):
        vehicle = get_object_or_404(Vehicle, pk=vehicle_id, user=request.user)
        logs = RefuelLog.objects.filter(vehicle=vehicle)
        serializer = RefuelLogSerializer(logs, many=True)
        return Response(serializer.data)

    def post(self, request, vehicle_id):
        vehicle = get_object_or_404(Vehicle, pk=vehicle_id, user=request.user)
        serializer = RefuelLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(vehicle=vehicle)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)