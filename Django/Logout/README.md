#   Logout 

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout


# TODO  :   User Logout View
def UserLogoutView(request):
    logout(request)
    return redirect('master-home')