This is my treining project of the online store with a few of microservices:
- frontend - React;
- backend - Node.js;
- MongoDB;
- rabbitmw;
- notificztions - Node.js.


[1] - To start only frontend `store-app` in production mode:
```bash
cd store-app
docker build -t azrubael/mern5shop:nextjs .
# or    docker pull azrubael/mern5shop:nextjs
cd nginx
docker build -t azrubael/mern5shop:nginx .
# or    docker pull azrubael/mern5shop:nginx
docker network create e5shop
docker network ls
docker run --rm --network e5shop --name nextjs-container -it -p 3000:3000 azrubael/mern5shop:nextjs
docker run --rm --network e5shop --name nginx-container --link nextjs-container:nextjs -p 80:80 azrubael/mern5shop:nginx
```
# http://localhost:3000
To stop frontend `store-app` in production mode:
```bash
docker stop nextjs-container
docker network delete e5shop
```


[2] - To start only backend `products-api` in production mode the _FIRST_ time:
```bash
cd products-api
docker build -t azrubael/mern5shop:nodedb2 .
docker network create e5shop
docker network ls
docker run --name mongodb --network e5shop -p 27017:27017 -d -v data:/data/db mongo
docker run --rm --network e5shop --name nodedb2-container -p 5002:5002 azrubael/mern5shop:nodedb2
```
# http://localhost:5002/products
To start only backend `products-api` in production mode the _SECOND_ time:
```bash
docker start mongodb
docker run --rm --network e5shop --name nodedb2-container -p 5002:5002 azrubael/mern5shop:nodedb2
```
To stop only backend `products-api` in production mode
```bash
docker stop nodedb2-container mongodb
# For the last time
docker rm mongodb
```

