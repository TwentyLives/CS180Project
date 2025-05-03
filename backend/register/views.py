from django.shortcuts import render, redirect
from .forms import RegistrationForm
from django.contrib import messages

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