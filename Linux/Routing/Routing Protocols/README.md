#   Routing Protocols

It would be a pain to have to manually configure routes on a routing table for every device on your network, so instead we use what are known as routing protocols. Routing protocols are used to help our system adapt to network changes, it learns of different routes, builds them in the routing table and then routes our packets through that way. There are two primary routing protocol types, distance vector protocols and link state protocols.


### Convergence

Before we talk about the protocols, we should go over a term using in routing known as convergence. When using routing protocols, routers communicate with other routers to collect and exchange information about the network. When they agree on how a network should look, every routing table maps out the complete topology of the network, thus "converging". When something occurs in the network topology, the convergence will temporarily break until all routers are aware of this change.