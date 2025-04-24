from django.db import models

# Create your models here.
class User(models.Model):
    login = models.CharField(max_length=32, primary_key=True)
    password = models.CharField(max_length=32)