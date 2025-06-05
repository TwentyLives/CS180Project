from django.db import models
from django.contrib.auth.models import User
import uuid

# Create your models here.
class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('Sedan', 'Sedan'),
        ('SUV', 'SUV'),
        ('Van', 'Van'),
    ]
    FUEL_TYPE_CHOICES = [
        ('Regular', 'Regular'),
        ('Premium', 'Premium'),
        ('Diesel', 'Diesel'),
    ]
    FUEL_SIDE_CHOICES = [
        ('Left', 'Left'),
        ('Right', 'Right'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    make = models.CharField(max_length=32)
    model = models.CharField(max_length=32)
    type = models.CharField(max_length=8, choices=VEHICLE_TYPE_CHOICES)
    year = models.IntegerField()
    trim = models.CharField(max_length=32)
    fuel_type = models.CharField(max_length=8, choices=FUEL_TYPE_CHOICES)
    fuel_side = models.CharField(max_length=5, choices=FUEL_SIDE_CHOICES)
    tank_capacity = models.FloatField()
    mpg = models.FloatField()
    current_miles = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"

class RefuelLog(models.Model):
    GAS_TYPE_CHOICES = [
        ('Regular', 'Regular'),
        ('Premium', 'Premium'),
        ('Diesel', 'Diesel'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='refuel_logs')
    date = models.DateField()
    gas_type = models.CharField(max_length=8, choices=GAS_TYPE_CHOICES)
    gallons = models.FloatField()
    cost = models.FloatField()
    odometer = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Refuel {self.gas_type} on {self.date} for {self.vehicle}"