#   Login Functionality



# Django Login Functionality


#### Update `app/urls.py` 

```
from django.urls import path, re_path

url(r'^login/$', views.UserLoginView, name="user-login"),
```

#### Update `project/settings.py`

```

from django.urls import reverse_lazy

LOGIN_REDIRECT_URL = reverse_lazy('main_page')
LOGIN_URL = reverse_lazy('login_page')
LOGOUT_URL = reverse_lazy('logout_page')

```


#### Update `app/forms.py`

```
from django import forms
class loginForm(forms.Form):
    username = forms.CharField(label='Username', widget=forms.TextInput())
    password = forms.CharField(widget=forms.PasswordInput())

```


#### login template (login.html)

```
{% extends "base.html" %}
{% block title %}Login{% endblock %}
{% block content %}
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-12 col-md-6">
                <div class="card mx-auto my-5 w-100  w-md-50 border-0 bg-transparent" >
                    <div class="card-header bg-transparent border-0">
                        <div class="row justify-content-center text-center">
                            <div class="col">
                                <h2 class="card-title fw-bolder  display-6">Login</h2>  
                            </div>
                        </div>
                      </div>
                    <div class="card-body">
                        <form class="row g-3 needs-validation" novalidate  action="{% url 'user-login' %}" method="POST" id="login_form"> 
                          {% include 'form_errors.html' %}
                            {% csrf_token %}
                            <div class="">
                              <input type="text" class="form-control bg-transparent" id="exampleInputEmail1" aria-describedby="emailHelp" required="" name="username" autocomplete="off" placeholder="Username" tabindex="1" autofocus="on">
                              <div class="invalid-feedback">
                                Please enter a valid username
                              </div>
                            </div>
                            <div class="">
                              <input type="password" class="form-control bg-transparent mt-3" id="exampleInputPassword1" required="" name="password" autocomplete="off" placeholder="Password" tabindex="2">
                              
                              <div class="invalid-feedback">
                                Please enter a password
                              </div>
                            </div>
                            <div class="mt-5">
                                <div class="row justify-content-center text-center">
                                    <div class="col">
                                        <input type="hidden" name="next" value="{{ request.path }}" />
                                        <button type="submit" class="btn btn-primary  w-50  "  tabindex="3">Login</button>
                                    </div>
                                </div>
                            </div>
                            <div class="">
                              <div class="row justify-content-center text-center">
                                  <div class="col">
                                    <p class="card-text">Don't have an account <a href="#!" target="_self" class="card-link text-primary text-decoration-none" tabindex="4">Register</a>
                                    </p>
                                  </div>
                              </div>
                            </div>
                            <div class="">
                              <div class="row justify-content-center text-center">
                                  <div class="col">
                                    <a href="#!" target="_self" class="card-link text-watercourse text-decoration-none" tabindex="5">Forgot Pasword ? </a>
                                  </div>
                              </div>
                            </div>
                          </form>
                    </div>
                  </div>
            </div>
        </div>
    </div>
{% endblock %}

{% block extra_js %}
<script>
    // Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})();
</script>
{% endblock %}

```


#### Form Errors Template (form_errors.html)

```
{% if form.errors %}
{% for field in form %}
    {% for error in field.errors %}
        <div class="alert alert-dark-burgundy-gradient-3 text-white ">
            <strong> {{ error|escape }}</strong>
            
        </div>
    {% endfor %}
{% endfor %}
{% for error in form.non_field_errors %}
    <div class="alert alert-dark-burgundy-gradient-3 text-white  ">
        <strong>{{ error|escape }}</strong>
        
    </div>
{% endfor %}
{% endif %}
```


#### Update `views.py`

```

from .forms import (
    loginForm
)



# TODO  :   User Login View

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


```


#### Login decorators

```
from django.contrib.auth.decorators import login_required

@login_required

```