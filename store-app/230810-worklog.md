# 2023-08-10    11:32
=====================

# https://nginx.org/en/docs/beginners_guide.html#conf_structure
# see 'Serving Static Content'

    $ docker rmi azrubael/mern5shop:next1 -f
Untagged: azrubael/mern5shop:next1
Deleted: sha256:660187f862fda66bac379b8ccc029d402eb0902ea07da6150d3cb3c3d00d2b16
    $ cd $(pwd) 
    $ docker build -t azrubael/mern5shop:next1 .
    $ cd nginx
    $ docker build -t azrubael/mern5shop:nginx .
    $ docker network create e5shop
    $ docker network ls
    $ docker run --rm --network e5shop --name nextjs-container azrubael/mern5shop:next1
    $ docker run --rm --network e5shop --name nginx-container --link nextjs-container:nextjs --publish 80:80 azrubael/mern5shop:nginx
    $ docker ps -as
CONTAINER ID   IMAGE                                 COMMAND                  CREATED          STATUS                    PORTS                NAMES              SIZE
91afad7ef148   azrubael/mern5shop:nginx              "/docker-entrypoint.…"   37 seconds ago   Up 37 seconds             0.0.0.0:80->80/tcp   nginx-container    1.18kB (virtual 41.4MB)
a770f309b951   azrubael/mern5shop:next1              "docker-entrypoint.s…"   44 seconds ago   Up 43 seconds             3000/tcp             nextjs-container   2.15MB (virtual 753MB)
c42d7d708f79   gcr.io/k8s-minikube/kicbase:v0.0.39   "/usr/local/bin/entr…"   6 days ago       Exited (137) 6 days ago                        minikube           3.07MB (virtual 1.06GB)
# http://localhost:3000/
# Golden Bakery

    $ docker network inspect e5shop
[
    {
        "Name": "e5shop",
        "Id": "c71cd5a7fcd1ded4889d70949ed773cbd5d92426517eaebd4c313cc3caf63fb1",
        "Created": "2023-08-09T10:13:52.767759048Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "172.18.0.0/16",
                    "Gateway": "172.18.0.1"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {
            "15e67e305e8f986ef18f6094d5008f696ed40d0dd762c32d81dfc2f42b5b27dc": {
                "Name": "nginx-container",
                "EndpointID": "ec0b418ba99cd4ef6907256f00b290b02f2caf3064c2bb69a64f936b32a2e3e8",
                "MacAddress": "02:42:ac:12:00:03",
                "IPv4Address": "172.18.0.3/16",
                "IPv6Address": ""
            },
            "ade85cdf8d4429ea606e5d7354c4fefd6a16510b79703e631e0488ef8689db6d": {
                "Name": "nextjs-container",
                "EndpointID": "6faddb9801adae9c612c6dc62457b32672fe36e1a7b5a48bfd1dff5a4a36264b",
                "MacAddress": "02:42:ac:12:00:02",
                "IPv4Address": "172.18.0.2/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]
    $ docker stop nginx-container nextjs-container
nginx-container
nextjs-container


# 2023-08-10    16:40
=====================
# https://steveholgado.com/nginx-for-nextjs/
