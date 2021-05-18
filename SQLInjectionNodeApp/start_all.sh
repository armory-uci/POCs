shellinaboxd --disable-peer-check -b -t -p 3001 -s /:root:root:/app/:bash
service mysql restart
pm2-runtime ./bin/www --watch 