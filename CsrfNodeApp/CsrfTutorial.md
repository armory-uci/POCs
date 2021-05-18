> ## **PRE-REQUISITE**: [please follow the link and **disable same site policy** in your chromium-based browser else this tutorial won't work](https://stackoverflow.com/a/63444906)
---
# **Cross Site Request Forgery (CSRF).**
# Explore

In the down-right window, we have a browser with multiple tabs open. let us go through each of them.

* The tab with URL https://www.download-games.net/CyberFunk2077 is a torrent hosting and downloading website which is under the hood is a **malicious attack vector**. This website performs CSRF attack in the background without the knowledge of the user.

* The tab with URL https://www.call-of-dooooty.com/online is a CSRF vulnerable website. To demonstrate the harm CSRF attack can cause, this website has a monetary transaction in its functionality. To log in click the **login via SSO** button and sign in using either of the following usernames.
  * vineet
  * maaz
  * vaibhav
  * shuvam

  It's important to note the user we sign in with, As after signup all the transactions are performed on the logged-in user. To Identify the logged-in user's authenticity we set and use cookies.

  After you log in, you can see all the users in the system with their respective account balance(for demonstration it's In-game currency).

  Below that, you have options to transfer your balance to any of the other users.
  To facilitate this we have the following HTML form associated
  ```html
  <form action="/transfer" method="post">
      <input type="input" name="amount" placeholder="amount"/>
      <input type="input" name="to_player_id" placeholder="receiver (vineet etc)"/>
      <input type="submit" value="transfer currency to"/>
  </form>
  ```
* In the rightmost tab, we have provided options to reset to the initial state and log errors for more visibility. 

# Exploit

To CSRF in action follow the following steps.
### STEP 1: 
Restore to the starting state by clicking the **RESET** button and log in from any of the above usernames.
notice that your current logged-in user's account balance is 1000 and hacker's is 0.

### STEP 2:
Click the **download torrent for CyberFunk 2077!** button and press ok on the popup alert.
you'll notice that your account balance is reduced by 5000 and the hackers account balance is increased by 5000. This indicates that a transaction on the CSRF vulnerable website has taken place without the user's knowledge from the malicious website.

The way hacker made that possible is given in the code snipped below
```html
<script>
  function transferCurrency() {
      alert('your download will begin in few seconds automatically!');
  }
</script>
<form action="https://www.call-of-dooooty.com/transfer" method="post" onsubmit="transferCurrency()">
  <input type="hidden"
      name="amount"
      value="5000"/>
  <input type="hidden"
      name="to_player_id"
      value="hacker"/>
  <input type="submit"
      value="download torrent for CyberFunk 2077!"/>
</form>
```
Above is a prepopulated hidden form that is triggered when the user clicks the download game button. This leverages the fact that all subsequence request made from the browser on which the users authenticated session resides, would automatically attack authorized cookies to all outgoing request irrespective of the request's origin source domain.

The issue is that the HTTP request from the legit website and the request from the evil website are exactly the same. This means there is no way to reject requests coming from the evil website and allow requests coming from the legit website. To protect against CSRF attacks we need to ensure there is something in the request that the evil site is unable to provide.

# Mitigate

One solution is to use the [Synchronizer Token Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#General_Recommendation:_Synchronizer_Token_Pattern). This solution is to ensure that each request requires, in addition to our session cookie, a randomly generated token as an HTTP parameter. When a request is submitted, the server must look up the expected value for the parameter and compare it against the actual value in the request. If the values do not match, the request should fail.

To Activate this flow do the following
* navigate to /app/routes/index.js to line 51 using
```
vim /app/routes/index.js +51
```

there you'll see the following code block
```js
const transferRes = await transferWithoutCSRFToken(from, to, parseInt(amount));
// const transferRes = await transferWithCSRFToken(from, to, parseInt(amount), userId, req_csrf_token);
```

comment the line with transferWithoutCSRFToken and uncomment next line with transferWithCSRFToken.
to make the code look as below.
```js
// const transferRes = await transferWithoutCSRFToken(from, to, parseInt(amount));
const transferRes = await transferWithCSRFToken(from, to, parseInt(amount), userId, req_csrf_token);
```

with the above changes now **RESET** and retry the **EXPLOIT** steps, you'll see that CSRF attacks are successfully mitigated.

CSRF was thwarted as follows.
on login, the below code block at /app/routes/index.js line no 127, generated and stores a unique CSRF token in a persistent cache.

```js
let csrf_token = crypto.randomBytes(16).toString('base64');
cache.set(getCSRFTokenKey(userId), csrf_token);
```

which is used for verification by transferWithCSRFToken functions at /app/routes/index.js line no 25 on each transfer request. This token is only known to the legit website hence malicious website can't guess this random token.

modified legit website code to make balance transfer.
```html
<form action="/transfer" method="post">
    <input type="hidden" name="req_csrf_token" value="{{ csrf_token }}" />
    <input type="input" name="amount" placeholder="amount"/>
    <input type="input" name="to_player_id" placeholder="receiver (vineet etc)"/>
    <input type="submit" value="transfer currency to"/>
</form>
```

<strong>Congratulations!!! you just learnt how to secure your Node.js server from CSRF attacks!</strong>