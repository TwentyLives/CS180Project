from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth import get_user_model
User = get_user_model()
from stations.models import Fuel

# Create your models here.
class Car(models.Model):
    year = models.IntegerField()
    make = models.CharField(max_length=32)
    model = models.CharField(max_length=16)
    mpg = models.FloatField(validators=[MinValueValidator(0.0)])
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    fuel_type = models.ForeignKey(Fuel, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"
