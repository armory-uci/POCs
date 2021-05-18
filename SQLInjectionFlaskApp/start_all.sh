shellinaboxd --disable-peer-check -b -t -p 3001 -s /:root:root:/app/:bash
ack -g ".py" | entr -r python3 app.py
