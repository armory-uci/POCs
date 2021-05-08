FROM httpd:2.4
COPY ./public-html/ /usr/local/apache2/htdocs/
COPY start_all.sh /usr/local/start_all.sh
RUN apt-get update && apt-get install -y openssl shellinabox
RUN ["chmod", "+x", "./start_all.sh"]
ENTRYPOINT /usr/local/start_all.sh