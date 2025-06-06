from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.test_user = User.objects.create_user(username="testuser", password="testpass123")

    def test_login_success(self):
        response = self.client.post("/api/login/", {
            "username": "testuser",
            "password": "testpass123"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("username", response.data)

    def test_login_failure_username(self):
        response = self.client.post("/api/login/", {
            "username": "wrongusername",
            "password": "testpass123"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)

    def test_login_failure_password(self):
        response = self.client.post("/api/login/", {
            "username": "testuser",
            "password": "wrongpassword"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)

    def test_register_success(self):
        response = self.client.post("/api/register/", {
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpass123"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["username"], "newuser")

    def test_register_missing_fields(self):
        response = self.client.post("/api/register/", {
            "username": ""
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)