from django.shortcuts import render, redirect
from .forms import RegistrationForm
from django.contrib import messages
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth.models import User

def register(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.password = form.cleaned_data['password']
            user.save()
            messages.success(request, "Registration successful!")
            return redirect("login")
    else:
        form = RegistrationForm()
    return render(request, "register/register.html", {"form": form})

class RegisterAPI(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "username": user.username,
                "password": request.data.get("password") 
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            # Authentication successful
            return Response({
                    "username": user.username,
                    "password": password  # WARNING: Do not expose passwords in production
                }, status=status.HTTP_200_OK)
        else:
            # Authentication failed
            return Response({"error": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)
        
# from django.contrib.auth.models import User (I know im working in your code so if we ever merge i need this library)
class TotalUsersAPI(APIView):
    def get(self, request):
        total_users = User.objects.count()
        return Response({"total_users": total_users}, status=status.HTTP_200_OK)        