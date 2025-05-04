"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from register import views as register_views
from garage import views as garage_views
from stations import views as station_views
from map import views as map_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register_views.register, name='register'),
    path('garage/', garage_views.garage, name='garage'),
    path('stations/', station_views.stations, name='stations'),
    path('map/', map_views.map, name='map'),
]
