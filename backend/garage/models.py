from django.db import models
from register.models import User
from stations.models import Fuel

class Car(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    year = models.IntegerField()
    make = models.CharField(max_length=32)
    model = models.CharField(max_length=16)
    mpg = models.FloatField()
    fuel_type = models.ForeignKey(Fuel, on_delete=models.CASCADE)
    tank_size = models.IntegerField(default=0)

    class Meta:
        db_table = "cars"
