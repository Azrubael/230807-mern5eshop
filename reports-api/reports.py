#!/usr/bin/env python3

"""Useful links:
https://pika.readthedocs.io/en/stable/examples/connecting_async.html
https://www.rabbitmq.com/tutorials/tutorial-one-python.html
https://github.com/rabbitmq/rabbitmq-tutorials/tree/main/python
"""

import pika
import email.message
from smtplib import SMTP_SSL
from smtplib import SMTPAuthenticationError
import ssl
from os import environ as env
import sys

try:
    SENDER = env["SDR"]
    RECEIVER = env["RVR"]
    EMAIL_SERVER = env["SRV"]
    EMAIL_PORT = env["PORT"]
    NAME = env["NAME"]
    KWD = env["KWD"]
    QUEUE_HOST = env["QHOST"]
    QUEUE_PORT = env["QPORT"]
    QUEUE_USER = env["QUSR"]
    QUEUE_PASS = env["QPWD"]
except KeyError:
    print('[error]: `API_KEY` environment variable required')
    sys.exit(1)


def generate(subject, body):
    """Creates an email with an attachement."""
    message = email.message.EmailMessage()
    message["From"] = SENDER
    message["To"] = RECEIVER
    message["Subject"] = subject
    message.set_content(body)

    return message


def send_email(msg):
    """Sends the message to the configured SMTP server."""
    ssl_context = ssl.create_default_context()
    mail_server = SMTP_SSL(EMAIL_SERVER, port=EMAIL_PORT, context=ssl_context)

    try:
        mail_server.login(SENDER, KWD)
    except SMTPAuthenticationError:
        print("Fail to ligin SMTP server")
        sys.exit(1)

    mail_server.send_message(msg)
    print("A message sent to ", RECEIVER)
    mail_server.quit()


def main():
    """Handling of a connection with rabbitmq."""
    # credentials = pika.PlainCredentials("guest", "guest")
    def callback(ch, method, properties, body):
        print(f" [x] Received a new order:\n{ body }")
        try:
            msg_email = generate("A new order informaion.", body)
            send_email(msg_email)
        except:
            print(f"Email sending error.")

    try: 
        credentials = pika.PlainCredentials(QUEUE_USER, QUEUE_PASS)
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=QUEUE_HOST, port=QUEUE_PORT, credentials=credentials))
        channel = connection.channel()
        print("Hockey")
    except:
        print(f"Queue connection error.")
        sys.exit(1)
    else:    
        channel.queue_declare(queue="jobs", durable=True)
        channel.basic_consume(queue="jobs", on_message_callback=callback, auto_ack=True)

        print(" [*] Waiting for messages.")
        channel.start_consuming()


if __name__ == "__main__":
    main()