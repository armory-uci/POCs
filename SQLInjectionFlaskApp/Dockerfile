# Docker file for a slim Ubuntu-based Python3 image

FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
  && apt-get install -y vim \
  && apt-get install -y openssl shellinabox \
  && apt-get install -y python3-pip python3-dev \
  && apt-get install -y mysql-server \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 --no-cache-dir install --upgrade pip \
  && rm -rf /var/lib/apt/lists/* 

RUN /etc/init.d/mysql start && mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS inventory; \
         USE inventory; \
         CREATE TABLE items(item_name VARCHAR(100), price INT); \
         INSERT INTO items(item_name, price) VALUES \
         ('Claw Hammer', 20), ('Sledge hammer', 30), ('hammer', 10), \
         ('5mm nails', 5), ('10mm nails', 12), ('15mm nails', 34), ('17mm nails', 50); \
	 USE mysql; \
	 ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysqlroot';"


RUN pip install flask pymysql

WORKDIR /app

COPY . /app

EXPOSE 5000
EXPOSE 3001

ENTRYPOINT ./start_all.sh