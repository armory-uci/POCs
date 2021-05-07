FROM node:14

WORKDIR /app
COPY . /app

RUN apt-get update \
  && apt-get install -y vim \
  && apt-get install -y openssl shellinabox \
  && npm install

EXPOSE 5000
EXPOSE 3001

RUN ["chmod", "+x", "./start_all.sh"]
ENTRYPOINT ./start_all.sh