from rest_framework import serializers
from .models import Vehicle, RefuelLog

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']

class RefuelLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefuelLog
        fields = '__all__'
        read_only_fields = ['id', 'vehicle', 'created_at']