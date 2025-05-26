from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Station, Fuel, Address

User = get_user_model()

class StationModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.station = Station.objects.create(name='Test Station', user=self.user)

    def test_station_creation(self):
        self.assertEqual(self.station.name, 'Test Station')
        self.assertEqual(self.station.user, self.user)
        self.assertEqual(str(self.station), 'Test Station')

class FuelModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='fueluser', password='testpass')
        self.station = Station.objects.create(name='Fuel Station', user=self.user)
        self.fuel = Fuel.objects.create(type='Diesel', price=4.29, station=self.station)

    def test_fuel_creation(self):
        self.assertEqual(self.fuel.type, 'Diesel')
        self.assertEqual(self.fuel.price, 4.29)
        self.assertEqual(self.fuel.station, self.station)
        self.assertIsNotNone(self.fuel.last_updated)

class AddressModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='addressuser', password='testpass')
        self.station = Station.objects.create(name='Address Station', user=self.user)
        self.address = Address.objects.create(
            street='123 Main St',
            city='Riverside',
            state='CA',
            zip='92521',
            station=self.station
        )

    def test_address_creation(self):
        self.assertEqual(self.address.street, '123 Main St')
        self.assertEqual(self.address.city, 'Riverside')
        self.assertEqual(self.address.state, 'CA')
        self.assertEqual(self.address.zip, '92521')
        self.assertEqual(self.address.station, self.station)
