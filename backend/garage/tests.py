from django.test import TestCase
from stations.models import Fuel
from .models import Car
from django.contrib.auth import get_user_model
User = get_user_model()

class CarModelTests(TestCase):
    def setUp(self):
        # Create a user and a fuel type for testing
        self.user = User.objects.create_user(username='testuser', password='securepass123')
        self.fuel = Fuel.objects.create(name='Premium')

    def test_create_car_successfully(self):
        """
        Test that a car can be created with valid fields.
        """
        car = Car.objects.create(
            year=2020,
            make='Toyota',
            model='Camry',
            mpg=30.0,
            owner=self.user,
            fuel_type=self.fuel
        )
        self.assertEqual(car.make, 'Toyota')
        self.assertEqual(car.fuel_type.name, 'Premium')
        self.assertEqual(car.owner.username, 'testuser')

    def test_missing_required_field_fails(self):
        """
        Test that creating a car with a missing required field raises an error.
        """
        with self.assertRaises(Exception):
            Car.objects.create(
                year=2020,
                model='Camry',
                mpg=30.0,
                owner=self.user,
                fuel_type=self.fuel
                # Missing 'make'
            )

    def test_mpg_must_be_float(self):
        """
        Test that mpg must be a float — simulate incorrect data type usage.
        """
        with self.assertRaises(ValueError):
            Car.objects.create(
                year=2020,
                make='Honda',
                model='Accord',
                mpg='thirty',  # Invalid type
                owner=self.user,
                fuel_type=self.fuel
            )

    def test_car_string_representation(self):
        """
        Optional: Add a __str__ to Car and test it here.
        """
        car = Car.objects.create(
            year=2022,
            make='Ford',
            model='Escape',
            mpg=27.0,
            owner=self.user,
            fuel_type=self.fuel
        )
        self.assertEqual(str(car), f"{car.year} {car.make} {car.model}")
