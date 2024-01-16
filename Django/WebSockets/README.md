#   Django - Web Sockets

Ref : https://freedium.cfd/https://medium.com/geekculture/a-beginners-guide-to-websockets-in-django-e45e68c68a71

Ref : https://channels.readthedocs.io/en/stable/installation.html

    pip install channels channels["daphne"]


Once that’s done, you should add `daphne` to the beginning of your `INSTALLED_APPS` setting:

    INSTALLED_APPS = [
        'daphne',
        ...
    ]



You can also add "channels" for Channel’s runworker command.

    INSTALLED_APPS = [
        'channels',
        ...
    ]


-   Update projects/settings.py
        # Channels Configurations
        
        ASGI_APPLICATION = "webapp.asgi.application"

        CHANNEL_LAYERS = {
            'default': {
                'BACKEND': "channels.layers.InMemoryChannelLayer"
                }
        }


-   Update project/asgi.py

        import os

        from channels.auth import AuthMiddlewareStack
        from channels.routing import ProtocolTypeRouter, URLRouter
        from channels.security.websocket import AllowedHostsOriginValidator
        from django.core.asgi import get_asgi_application

        from chat.routing import websocket_urlpatterns

        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webapp.settings")
        django_asgi_app = get_asgi_application()

        import chat.routing

        application = ProtocolTypeRouter(
            {
                "http": django_asgi_app,
                "websocket": AuthMiddlewareStack(
                URLRouter(
                    websocket_urlpatterns
                )
            ),
            }
        )


-   Update app/routing.py


        from master_app.consumers import PracticeConsumer

        from django.urls import re_path
        websocket_urlpatterns = [
            re_path(r"ws/whole1/$", PracticeConsumer.as_asgi()),
        ]


-   Update app/consumers.py



```

from channels.consumer import AsyncConsumer
from random import randint

class PracticeConsumer(AsyncConsumer):

    async def websocket_connect(self,event):
        # when websocket connects
        print("connected",event)
        

        await self.send({"type": "websocket.accept",
                         })



        await self.send({"type":"websocket.send",
                         "text":0})
        


    async def websocket_receive(self,event):
        # when messages is received from websocket
        print("receive",event)

        await self.send({
            "type": "websocket.send",
            "text": randint(0,100) 
        })
        


    async def websocket_disconnect(self, event):
        # when websocket disconnects
        print("disconnected", event)


```