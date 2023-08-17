FROM python:alpine

WORKDIR /app

RUN pip install python-decouple && \
pip install pika

COPY reports.py .
COPY .env .

EXPOSE 5001 465
CMD python3 reports.py