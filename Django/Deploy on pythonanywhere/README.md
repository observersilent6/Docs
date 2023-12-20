#   Django - Deploy on pythonanywhere




**Ref**

    https://help.pythonanywhere.com/pages/DeployExistingDjangoProject/



## Step 1 : Uploading your code to PythonAnywhere

Assuming your code is already on a code sharing site like GitHub or Bitbucket, you can just clone it from a Bash Console:

```
# for example
$ git clone https://oauth-key-goes-here@github.com/username/repo.git

```


## Step 2 : Create a virtualenv and install Django and any other requirements


In your Bash console, create a virtualenv, naming it after your project, and choosing the version of Python you want to use:

```
 mkvirtualenv --python=/usr/bin/python3.10 mysite-virtualenv
(mysite-virtualenv)$ pip install django


```

## Step 3 : Setting up your Web app and WSGI file

At this point, you need to be armed with 3 pieces of information:

-   The path to your Django project's top folder -- the folder that contains "manage.py", eg /home/myusername/mysite
-   The name of your project (that's the name of the folder that contains your settings.py), eg mysite
-   The name of your virtualenv, eg mysite-virtualenv


## Step 4 : Create a Web app with Manual Config
Head over to the `Web tab` and create a new web app, choosing the `"Manual Configuration"` option and the right version of Python (the same one you used to create your virtualenv).

**NOTE**: Make sure you choose `Manual Configuration`, not the `"Django"` option, that's for new projects only.


##  Step 5 : Enter your virtualenv name

Once that's done, enter the name of your `virtualenv` in the **Virtualenv** section on the **web tab** and click OK.

You can just use its short name `"mysite-virtualenv"`, and it will automatically complete to its full path in `/home/username/.virtualenvs`.


##  Step 6 : Optional: enter path to your code

Although this isn't necessary for the app to work, you can optionally set your working directory and give yourself a convenient hyperlink to your source files from the web tab.

Enter the path to your project folder in the Code section on the web tab, eg `/home/myusername/mysite` in `Source code` and `Working directory`


##  Step 7 : Edit your WSGI file

One thing that's important here: your Django project (if you're using a recent version of Django) will have a file inside it called `wsgi.py`. This is not the one you need to change to set things up on PythonAnywhere -- the system here ignores that file.



Instead, the WSGI file to change is the one that has a link inside the "Code" section of the Web tab -- it will have a name something like `/var/www/yourusername_pythonanywhere_com_wsgi.py` or `/var/www/www_yourdomain_com_wsgi.py`.


Click on the WSGI file link, and it will take you to an editor where you can change it.

Delete everything except the Django section and then uncomment that section. Your WSGI file should look something like this:

```

+++++++++++ DJANGO +++++++++++
To use your own django app use code like this:
import os
import sys

# assuming your django settings file is at '/home/iamindian/mysite/mysite/settings.py'
# and your manage.py is is at '/home/iamindian/mysite/manage.py'
path = '/home/iamindian/mysite/news-channels'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'mysite.settings'

# then:
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

```


-   Be sure to substitute the correct path to your project, the folder that contains manage.py, which you noted above.
-   Don't forget to substitute in your own username too!
-   Also make sure you put the correct value for DJANGO_SETTINGS_MODULE.
-   This guide assumes you're using a recent version of Django, so leave the old wsgi.WSGIHandler() code commented out, or better still, delete it.



Save the file, then go and hit the `Reload` button for your domain. (You'll find one at the top right of the wsgi file editor, or you can go back to the main web tab)


##  Step 8 : How to setup static files in Django

There are 3 main things to do:

-   set STATIC_ROOT in settings.py
-   run python3.10 manage.py collectstatic (or python3.9 or python3.8 as appropriate)
-   set up a Static Files entry on the PythonAnywhere Web tab.
Optionally, you can also customise STATIC_URL, if you want to use a static URL prefix other than /static/


##  Step 9 : Set up a static files mapping
Finally, set up a static files mapping to get our web servers to serve out your static files for you.

Go to the Web tab on the PythonAnywhere dashboard
Go to the Static Files section
Enter the same URL as STATIC_URL in the url section (typically, /static/)
Enter the path from STATIC_ROOT into the path section (the full path, including /home/username/etc)
Then hit Reload and test your static file mapping by going to retrieve a known static file.

Eg, if you have a file at /home/myusername/myproject/static/css/base.css, go visit http://www.your-domain.com/static/css/base.css