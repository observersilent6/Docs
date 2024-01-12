#   Django - Login Functionality



####    app/urls.py

path('login', views.UserLoginView, name="user_login"),



####    project/settings.py



from django.urls import reverse_lazy

LOGIN_REDIRECT_URL = reverse_lazy('index')
LOGIN_URL = reverse_lazy('user_login')
LOGOUT_URL = reverse_lazy('logout_page')



####    app/forms.py


from django import forms
class loginForm(forms.Form):
    username = forms.CharField(label='Username', widget=forms.TextInput())
    password = forms.CharField(widget=forms.PasswordInput())



####    app/views.py

from .forms import (
    loginForm
)



from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.shortcuts import render, redirect

def UserLoginView(request):
    template_name = "login.html"
    if request.user.is_authenticated:
        return redirect("index")
    else:
        if request.method == "POST":
            form = loginForm(request.POST)
            valuenext = request.POST.get('next')
            if form.is_valid():
                try:
                    u = authenticate(
                        request,
                        username=form.cleaned_data["username"],
                        password=form.cleaned_data["password"]
                    )
                    if u is not None:
                        if u.is_active:
                            login(request, u)
                            if len(valuenext) != 0 and valuenext is not None:
                                return redirect(valuenext)
                            else:
                                return redirect("index")
                        else:
                            messages.error(
                                request, "User does not verify himself or he has been blocked from using our services due to violation of our terms and conditions.")
                    else:
                        messages.error(
                            request, "Username or password has been entered incorrectly.")
                except Exception as e:
                    messages.error(
                        request, "Please login after sometimes. Requests are not processed at this time.")
            else:
                messages.error(
                    request, "Please entered correct information for respective required fields.")

    form = loginForm()
    context = {
        "form": form,
        "section": True
    }
    return render(request, template_name, context)
