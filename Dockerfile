FROM locustio/locust

COPY locustfile.py /mnt/locust/locustfile.py

EXPOSE 8089