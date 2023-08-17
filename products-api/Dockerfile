FROM ubuntu:18.04

WORKDIR /app

RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip install flask==2.1.*

COPY *.py .

ENV FLASK_APP=runme
EXPOSE 5002
CMD flask run --host 0.0.0.0 --port 5002