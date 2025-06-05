from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

class RegisterAPI(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "username": user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPI(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            # Get or create token for the user
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "username": user.username,
                "token": token.key
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

# from django.contrib.auth.models import User (I know im working in your code so if we ever merge i need this library)
class TotalUsersAPI(APIView):
    def get(self, request):
        total_users = User.objects.count()
        return Response({"total_users": total_users}, status=status.HTTP_200_OK)

class UserInfoAPI(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            # Add more fields if needed
        }, status=status.HTTP_200_OK)
    
# from django.contrib.auth.models import User (I know im working in your code so if we ever merge i need this library)
class TotalUsersAPI(APIView):
    def get(self, request):
        total_users = User.objects.count()
        return Response({"total_users": total_users}, status=status.HTTP_200_OK)        