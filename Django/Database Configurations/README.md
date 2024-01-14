#   Django - Database Configurations

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': config('DB_NAME'), 
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'), 
        'PORT': config('DB_PORT'),
    }
}


```



-   Test Connection String


```


from decouple import config
from decouple import Csv
import psycopg2

# Connect to your PostgreSQL database on a remote server
conn = psycopg2.connect(host=config('DB_HOST'), port=config('DB_PORT'), dbname=config('DB_NAME'), user=config('DB_USER'), password=config('DB_PASSWORD'))

# Open a cursor to perform database operations
cur = conn.cursor()

print(cur)


```