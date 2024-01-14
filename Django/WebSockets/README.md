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

        from master_app.routing import websocket_urlpatterns

        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webapp.settings")
        django_asgi_app = get_asgi_application()

        import master_app.routing

        application = ProtocolTypeRouter(
            {
                "http": django_asgi_app,
                "websocket": URLRouter(websocket_urlpatterns),
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
# import asyncio
import json
from channels.consumer import AsyncConsumer
from random import randint
from time import sleep
import time

from .models import *

# from scapy.all import sniff, IP, TCP

from scapy.all import sniff, IP, TCP
# import asyncio
# from concurrent.futures import ThreadPoolExecutor


from .utils import (
    ETHERNET_IP_VERSION_TYPE
)
from channels.db import database_sync_to_async





# from asgiref.sync import sync_to_async

# import asyncio



def sync_function(packet):
    # Your synchronous code here
    Packets.objects.create(
        destination_ip=get_packet_dst_ip(packet),   
        source_ip=get_packet_src_ip(packet),
        type=ETHERNET_IP_VERSION_TYPE.get(str(packet.type), "Unknown"),
        protocol=proto_name_by_num(packet.proto),
        tcp_sport=packet.sport,
        tcp_dport=packet.dport,
        payload=read_payload(packet),
    )
    pass

# async def async_function():
#     sync_function_result = await sync_to_async(sync_function)()


from .helpers import (
    read_pcap_file,
    get_protocol_name,
    proto_name_by_num,
    read_payload,
    read_payload_v2,
    get_packet_src_ip,
    get_packet_dst_ip
)


# target_ip = "192.168.0.143"  # Replace with the IP address you want to monitor
# target_port = "8000"         # Replace with the port number you want to monitor

# def packet_callback(packet):
#     if packet.haslayer(IP) and packet.haslayer(TCP):
#         ip_src = packet[IP].src
#         ip_dst = packet[IP].dst
#         port_src = packet[TCP].sport
#         port_dst = packet[TCP].dport
#         # print(f"Packet from {ip_src}:{port_src} to {ip_dst}:{port_dst}")
#         return port_dst

def packet_callback(packet):
    # print(type(packet))
    # print(packet.show())
    try:
        if packet.haslayer(TCP):
            # print(packet[IP])
            ip_src = packet[IP].src
            ip_dst = packet[IP].dst
            port_src = packet[TCP].sport
            port_dst = packet[TCP].dport

            packet_data = {
                "ip_src": ip_src,
                "ip_dst": ip_dst,
                "port_src": port_src,
                "port_dst": port_dst,
            }
            # print("...")
            return packet_data
        else:
            return None
    except Exception as e:
        print("Error")
        print(e)
        # print(packet)
        return None

def collect_packets():

    timeout_seconds = 0.1
    start_time = time.time()
    captured_packets = []

    while time.time() - start_time < timeout_seconds:
        c = sniff( filter="tcp", timeout=1)
        # print(c.summary())
        # if c is not None:
        for packet in c:
            # Process each packet in the captured_packets list
            # print(packet.summary(), "*****")
            # print(read_payload(packet.payloafd))
            # print(read_payload_v2(packet))
            captured_packets.append(packet)
            # pass

        # print(c)
        # captured_packets.append(sniff(prn=packet_callback, store=0, filter="tcp", count=1))
    # captured_packet = sniff(prn=packet_callback, store=0, filter="tcp", count=0)
    # for cp in captured_packet:
    #     print("----------------")
    #     print(packet_callback(cp))
    #     print("----------------")
    # result = packet_callback(captured_packet)
    # print(captured_packets)
    print("Finished running")
    return captured_packets

class PracticeConsumer(AsyncConsumer):

    async def websocket_connect(self,event):
        # when websocket connects
        print("connected",event)
        

        await self.send({"type": "websocket.accept",
                         })



        await self.send({"type":"websocket.send",
                         "text":0})
        

        # await asyncio.ensure_future(self.capture_packets())


    # async def capture_packets(self):
    #     def packet_callback(packet):
    #         if packet.haslayer(IP) and packet.haslayer(TCP):
    #             ip_src = packet[IP].src
    #             ip_dst = packet[IP].dst
    #             port_src = packet[TCP].sport
    #             port_dst = packet[TCP].dport

    #             packet_data = {
    #                 "ip_src": ip_src,
    #                 "ip_dst": ip_dst,
    #                 "port_src": port_src,
    #                 "port_dst": port_dst,
    #             }

    #             self.send(json.dumps(packet_data))

        # Start sniffing on the network interface
        


    
    # async def async_function(result):
    #     loop = asyncio.get_event_loop()
    #     for packet in result:
    #         with ThreadPoolExecutor() as executor:
    #             sync_function_result = await loop.run_in_executor(executor, sync_function(packet))


    async def websocket_receive(self,event):
        # when messages is received from websocket
        print("receive",event)

        
        # print("----------------------------")
        # print("----------------------------")
        # print(result)
        # print("----------------------------")
        result = collect_packets()
        # print(result)
        # time.sleep(2)
        # print(result)
        # # packet_data_list = []
        # loop = asyncio.get_event_loop()

        # for packet in result:
        #     with ThreadPoolExecutor() as executor:
        #         sync_function_result = await loop.run_in_executor(executor, sync_function(packet))
            # packet_data_list.append(
            #     (packet[IP].dst, packet[IP].src, read_payload(packet))
            # )
        # asyncio.run(async_function(result))

        await self.save_to_database(result)

        packet_data_list = [(packet[IP].dst, packet[IP].src, read_payload(packet)) for packet in result]
        # print(packet_data_list)
        json_data = json.dumps(packet_data_list)
        # print(json_data)


        await self.send({"type": "websocket.send",
                         "text": json_data})
        


    @database_sync_to_async
    def save_to_database(self, result):
        # Create and save the model instance
        if result is not None:
            for packet in result:
                Packets.objects.create(
                    destination_ip=get_packet_dst_ip(packet),   
                    source_ip=get_packet_src_ip(packet),
                    type=ETHERNET_IP_VERSION_TYPE.get(str(packet.type), "Unknown"),
                    protocol=proto_name_by_num(packet.proto),
                    tcp_sport=packet.sport,
                    tcp_dport=packet.dport,
                    payload=read_payload(packet),
                )

        return None
        # my_model_instance = MyModel(field1=fiesld1_value, field2=field2_value)
        # my_model_instance.save()
        

        

    # async def send_packet_data(self, packet_data):
    #     await self.send(text_data=json.dumps(packet_data))


    async def websocket_disconnect(self, event):
        # when websocket disconnects
        print("disconnected", event)


```