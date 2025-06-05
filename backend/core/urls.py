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

from register.views import RegisterAPI, LoginAPI
from register.views import TotalUsersAPI
from register.views import UserInfoAPI
from stations.views import GasPriceSubmitView, StationPricesView
from garage.views import VehicleListCreateView, VehicleDeleteView, RefuelLogListCreateView
from stations.views import AllStationPricesView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterAPI.as_view(), name='api-register'),
    path('api/login/', LoginAPI.as_view(), name='api-login'),
    path("api/total-users", TotalUsersAPI.as_view(), name="total-users"),
    path('api/submit-gas-price/', GasPriceSubmitView.as_view(), name='submit-gas-price'),
    path('api/station-prices/<int:overpass_id>/', StationPricesView.as_view(), name='station-prices'),
    path('api/vehicles/', VehicleListCreateView.as_view(), name='vehicle-list-create'),
    path('api/vehicles/<uuid:pk>/', VehicleDeleteView.as_view(), name='vehicle-delete'),
    path('api/refuel/<uuid:vehicle_id>/', RefuelLogListCreateView.as_view(), name='refuel-log-list-create'),
    path('api/userinfo/', UserInfoAPI.as_view(), name='userinfo'),
    path('api/station-prices/', AllStationPricesView.as_view(), name='station-prices-all'),

]
