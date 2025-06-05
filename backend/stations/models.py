from django.db import models

# Create your models here.
class Station(models.Model):
    # Overpass API station id
    overpass_id = models.BigIntegerField(unique=True)
    name = models.CharField(max_length=128, blank=True, null=True)
    lat = models.FloatField()
    lon = models.FloatField()

    def __str__(self):
        return self.name or f"Station {self.overpass_id}"

class GasPriceSubmission(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE, related_name="submissions")
    regular = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    premium = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    diesel = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    rating = models.PositiveSmallIntegerField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Submission for {self.station} at {self.submitted_at}"
