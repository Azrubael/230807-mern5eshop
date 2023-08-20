FROM python:alpine

WORKDIR /app

RUN pip install pika

COPY reports.py .

EXPOSE 5001 465

CMD python3 reports.py