from django.test import TestCase
from stations.models import Fuel, Station
from .models import Car
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
User = get_user_model()

class CarModelTests(TestCase):
    def setUp(self):
        # Create a user and a fuel type for testing
        self.user = User.objects.create_user(username='testuser', password='securepass123')
        # create a station first
        self.station = Station.objects.create(name="Test Station", user=self.user)
        # now create fuel with station reference
        self.fuel = Fuel.objects.create(station=self.station, type='Premium', price=3.59)

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
        self.assertEqual(car.fuel_type.type, 'Premium')
        self.assertEqual(car.owner.username, 'testuser')

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

    def test_negative_mpg_raises_error(self):
        car = Car(
            year=2022,
            make='Nissan',
            model='Altima',
            mpg=-5.0,
            owner=self.user,
            fuel_type=self.fuel
        )
        with self.assertRaises(ValidationError):
            car.full_clean()
