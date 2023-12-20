# Python Decouple Configurations


#### Install pip package

pip install python-decouple

#### create `.env` file at parent directory (mostly sibling with `media` directory):


```
#.env
SECRET_KEY=&st58at2xg@q-v1bq(@rg6m^w=r2i4=v)i4t%zjd5v^9zq8p2p
DEBUG=True
ALLOWED_HOSTS='*'
SITE_ID=1
DB_NAME=db.sqlite3
EMAIL_BACKEND='django.core.mail.backends.console.EmailBackend'
EMAIL_HOST='smtp.gmail.com'
EMAIL_HOST_USER='XXXX'
EMAIL_HOST_PASSWORD='XXXX'
EMAIL_PORT=587
EMAIL_USE_TLS=True
DEFAULT_FROM_EMAIL="XXXX"  

```


#### Then use it on your `settings.py`.


```
from decouple import config
from decouple import Csv

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())
EMAIL_HOST = config('EMAIL_HOST', default='localhost')
EMAIL_PORT = config('EMAIL_PORT', default=25, cast=int)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / config('DB_NAME')
,
    }
}
```