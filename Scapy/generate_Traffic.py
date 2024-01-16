from scapy.all import IP, TCP, send

def generate_http_traffic(destination_ip, destination_port=80, count=10):
    # Craft HTTP GET requests
    http_packets = IP(dst=destination_ip)/TCP(dport=destination_port)/"GET / HTTP/1.1\r\nHost: example.com\r\n\r\n"

    # Send packets
    send(http_packets, count=count)

if __name__ == "__main__":
    # Specify the destination IP address
    target_ip = "192.168.14.159"

    # Specify the destination port (default is 80 for HTTP)
    target_port = 8000

    # Specify the number of HTTP requests to send (default is 10)
    request_count = 100000

    generate_http_traffic(target_ip, destination_port=target_port, count=request_count)