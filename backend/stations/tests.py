from django.test import TestCase
from .models import Station, GasPriceSubmission

class StationModelTests(TestCase):
    def test_station_creation(self):
        station = Station.objects.create(overpass_id=123456789, name='Test Station', lat=34.0522, lon=-118.2437)
        self.assertEqual(station.name, 'Test Station')
        self.assertEqual(station.overpass_id, 123456789)
        self.assertEqual(station.lat, 34.0522)
        self.assertEqual(station.lon, -118.2437)
        self.assertEqual(str(station), 'Test Station')

class GasPriceSubmissionTests(TestCase):
    def setUp(self):
        self.station = Station.objects.create(overpass_id=123, name="Shell", lat=33.9533, lon=-117.3961)

    def test_submission_creation(self):
        submission = GasPriceSubmission.objects.create(
            station=self.station,
            regular=4.29,
            premium=4.79,
            diesel=5.09,
            rating=4
        )
        self.assertEqual(submission.station, self.station)
        self.assertEqual(submission.regular, 4.29)
        self.assertEqual(submission.premium, 4.79)
        self.assertEqual(submission.diesel, 5.09)
        self.assertEqual(submission.rating, 4)
        self.assertIn("Submission for", str(submission))
