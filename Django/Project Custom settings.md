# Django Project Custom settings (Confgurations)



## Static Configs

-   update `project/settings.py`


```

STATIC_ROOT= BASE_DIR / 'static'
STATICFILES_DIRS=[
]


    

```

## Template configs


-   Update `project/settings.py`


```

'DIRS': [
            BASE_DIR / 'master_app/templates/master_app',
    ],

```


## Media Configs


-   Update `project/settings.py`


```
MEDIA_URL = '/media/'
MEDIA_ROOT= BASE_DIR.parent / 'media'

```
## Update projects urls (static, media)


-   Update `project/urls.pt`


```

from django.conf import settings
from django.conf.urls.static import static


if settings.DEBUG:
    urlpatterns+= static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)
    urlpatterns+=static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

```
## Email Configs


-   Update `project/settings.py`


```

#Email Setting...
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'XXXX'
EMAIL_HOST_PASSWORD = 'XXXX'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = "XXXX"  

```
