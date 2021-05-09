FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app
COPY . /app

RUN apt-get update \
  && apt-get install -y vim \
  && apt-get install -y openssl shellinabox \
  && apt-get install -y mysql-server \
  && apt-get install -y curl gnupg \
  && curl -sL https://deb.nodesource.com/setup_12.x  | bash - \
  && apt-get install -y nodejs \
  && npm install

RUN /etc/init.d/mysql start && mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS inventory; \
         USE inventory; \
         CREATE TABLE items(item_name VARCHAR(100), price INT); \
         INSERT INTO items(item_name, price) VALUES \
         ('Claw Hammer', 20), ('Sledge hammer', 30), ('hammer', 10), \
         ('5mm nails', 5), ('10mm nails', 12), ('15mm nails', 34), ('17mm nails', 50); \
	 USE mysql; \
	 ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mysqlroot';"


EXPOSE 5000
EXPOSE 3001

RUN ["chmod", "+x", "./start_all.sh"]
ENTRYPOINT ./start_all.sh