from django.test import TestCase
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from .models import Vehicle, RefuelLog
from datetime import date

User = get_user_model()

class VehicleModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='securepass123')

    def test_create_vehicle_successfully(self):
        vehicle = Vehicle.objects.create(
            user=self.user,
            make='Toyota',
            model='Camry',
            type='Sedan',
            year=2020,
            trim='LE',
            fuel_type='Regular',
            fuel_side='Left',
            tank_capacity=15.5,
            mpg=30.0,
            current_miles=50000
        )
        self.assertEqual(str(vehicle), "2020 Toyota Camry")
        self.assertEqual(vehicle.user.username, 'testuser')

    def test_negative_mpg_raises_validation_error(self):
        vehicle = Vehicle(
            user=self.user,
            make='Honda',
            model='Civic',
            type='Sedan',
            year=2021,
            trim='EX',
            fuel_type='Regular',
            fuel_side='Right',
            tank_capacity=13.0,
            mpg=-25.0,
            current_miles=25000
        )
        with self.assertRaises(ValidationError):
            vehicle.full_clean()

    def test_string_representation(self):
        vehicle = Vehicle.objects.create(
            user=self.user,
            make='Ford',
            model='Escape',
            type='SUV',
            year=2022,
            trim='SE',
            fuel_type='Premium',
            fuel_side='Right',
            tank_capacity=16.0,
            mpg=28.0,
            current_miles=10000
        )
        self.assertEqual(str(vehicle), "2022 Ford Escape")


class RefuelLogModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='securepass123')
        self.vehicle = Vehicle.objects.create(
            user=self.user,
            make='Toyota',
            model='RAV4',
            type='SUV',
            year=2023,
            trim='XLE',
            fuel_type='Regular',
            fuel_side='Left',
            tank_capacity=14.8,
            mpg=32.0,
            current_miles=1500
        )

    def test_create_refuel_log_successfully(self):
        log = RefuelLog.objects.create(
            vehicle=self.vehicle,
            date=date.today(),
            gas_type='Regular',
            gallons=10.5,
            cost=42.00,
            odometer=1520
        )
        self.assertEqual(str(log), f"Refuel Regular on {log.date} for {self.vehicle}")

    def test_refuel_log_requires_vehicle(self):
        with self.assertRaises(IntegrityError):
            RefuelLog.objects.create(
                vehicle=None,
                date=date.today(),
                gas_type='Premium',
                gallons=8.0,
                cost=35.00,
                odometer=1600
            )
