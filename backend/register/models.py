from django.db import models

class User(models.Model):
    login = models.CharField(max_length=32, primary_key=True)
    password = models.CharField(max_length=128)  # Use a hashed password
    email = models.EmailField()
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)

    def __str__(self):
        return self.login
    
    class Meta:
        db_table = "users"