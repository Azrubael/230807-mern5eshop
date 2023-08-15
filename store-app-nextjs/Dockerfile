FROM node:18-alpine as builder

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build

##############################
FROM nginx

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/out /usr/share/nginx/html