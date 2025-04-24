from django.db import models
from registration.models import User

# Create your models here.
class Station(models.Model):
    name = models.CharField(max_length=128)
    user = models.ForeignKey(User)

    def __str__(self):
        return self.name

class Fuel(models.Model):
    type = models.CharField(max_length=16)
    price = models.DecimalField()
    station = models.ForeignKey(Station)
    last_updated = models.DateTimeField(auto_now_add=True)

class Address(models.Model):
    street = models.CharField(max_length=64)
    city = models.CharField(max_length=32)
    state = models.CharField(max_length=16)
    zip = models.CharField(max_length=5)
    station = models.ForeignKey(Station)