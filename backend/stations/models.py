from django.db import models
from register.models import User

# Create your models here.


class Station(models.Model):
    name = models.CharField(max_length=128)
    review_score = models.IntegerField(default=0)

    def __str__(self):
        return self.name
    class Meta:
        db_table = "stations"

class Address(models.Model):
    street = models.CharField(max_length=64)
    city = models.CharField(max_length=32)
    state = models.CharField(max_length=16)
    zip = models.CharField(max_length=5)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    class Meta:
        db_table = "address"

class Fuel(models.Model):
    type = models.CharField(max_length=16)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    last_updated = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = "fuel"

