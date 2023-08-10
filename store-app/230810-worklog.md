# 2023-08-10    11:32
=====================

# https://nginx.org/en/docs/beginners_guide.html#conf_structure
# see 'Serving Static Content'

    $ docker rmi azrubael/mern5shop:next1 -f
Untagged: azrubael/mern5shop:next1
Deleted: sha256:660187f862fda66bac379b8ccc029d402eb0902ea07da6150d3cb3c3d00d2b16
    $ docker ps -a
CONTAINER ID   IMAGE                                 COMMAND                  CREATED      STATUS                    PORTS     NAMES
c42d7d708f79   gcr.io/k8s-minikube/kicbase:v0.0.39   "/usr/local/bin/entr…"   6 days ago   Exited (137) 6 days ago             minikube

    $ cd $(pwd) 
    $ docker build -t azrubael/mern5shop:next1 .
    $ cd nginx
    $ docker build -t azrubael/mern5shop:nginx .
    $ docker network create e5shop
    $ docker network ls
    $ docker run --rm --name 5shop-next1 --network e5shop -it -p 3000:3000 azrubael/mern5shop:next1
# http://localhost:3000/
# Golden Bakery
    $ docker container stop 5shop-next1
    
# Запуск контейнера фронтенд Next.js с применением сервера Nginx    
    $ docker run --rm --network e5shop --name 5shop-next1 azrubael/mern5shop:next1
    $ docker run --rm --network e5shop --name 5shop-nginx --link 5shop-next1:nextjs --publish 3000:80 azrubael/mern5shop:nginx
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
            "618dc896884d3112c1381acdc9e9fdbd32692b5eccf63aed77604b45252ddcd1": {
                "Name": "5shop-nginx",
                "EndpointID": "df3351a1055b36a270d28697c0809b7edd70307730e4bc384cc2906c478005de",
                "MacAddress": "02:42:ac:12:00:03",
                "IPv4Address": "172.18.0.3/16",
                "IPv6Address": ""
            },
            "b89d861e9835de2375e1012f651729dd71af371727ad2949ad6d844e9cbcb0b9": {
                "Name": "5shop-next1",
                "EndpointID": "6e19dea26799e64e08a1c3516c721ec5b380c77980e17c40f74083e95b503de3",
                "MacAddress": "02:42:ac:12:00:02",
                "IPv4Address": "172.18.0.2/16",
                "IPv6Address": ""
            }
        },
        "Options": {},
        "Labels": {}
    }
]

    $ docker ps -a
CONTAINER ID   IMAGE                                 COMMAND                  CREATED          STATUS                    PORTS                  NAMES
618dc896884d   azrubael/mern5shop:nginx              "/docker-entrypoint.…"   33 seconds ago   Up 32 seconds             0.0.0.0:3000->80/tcp   5shop-nginx
b89d861e9835   azrubael/mern5shop:next1              "docker-entrypoint.s…"   7 minutes ago    Up 7 minutes              3000/tcp               5shop-next1
c42d7d708f79   gcr.io/k8s-minikube/kicbase:v0.0.39   "/usr/local/bin/entr…"   6 days ago       Exited (137) 6 days ago                          minikube
    $ docker stop nifty_ritchie 5shop-next1
nifty_ritchie
5shop-next1


# 2023-08-10    14:31
=====================