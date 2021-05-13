const express = require('express');
const NodeCache = require('node-cache');
const  crypto = require('crypto');
const  cache = new NodeCache();

const router = express.Router();

let players = [
  {name: 'hacker', balance: 0},
  {name: 'Vaibhav', balance: 10000},
  {name: 'Maaz', balance: 10000},
  {name: 'Shuvam', balance: 10000},
  {name: 'Vineet', balance: 10000},
];

const curr = new Date();

const blogs = [
  {content: 'post 1', date: curr.toDateString() },
  {content: 'post 2', date: curr.toDateString() },
];

const getCSRFTokenKey = (userId) => `csrf_token_${userId.toLowerCase()}`

const transferWithCSRFToken = (from, to, amount, userId, req_csrf_token) => {
  const saved_csrf_token = cache.get(getCSRFTokenKey(userId));
  if (!saved_csrf_token || !req_csrf_token ||  saved_csrf_token != req_csrf_token) {
    console.debug(`probable CSRF attack: ${from.name} ${to.name} ${amount} ${userId} ${req_csrf_token}`);
    throw new Error(`invalid csrf token`);
  }

  from.balance -= amount;
  to.balance += amount;
  return { success: true };
  
}

// router.post('/prepareTransfer', (req, res, next) => {
//   // NOTE: reauthenticate user;
//   const nonce = 'random';
//   return res.redirect('/');
// });

const transferWithoutCSRFToken = async (from, to, amount) => {
  from.balance -= amount;
  to.balance += amount;
  return { success: true };
};


router.post('/transfer', async (req, res, next) => {
  try {
    const { amount, to_player_id, req_csrf_token } = req.body;
    const to_arr = players.filter((each) => each.name.toLowerCase() == to_player_id.toLowerCase());
    const userId = req.session.user && req.session.user.name;
    if (to_arr.length != 1)
      throw new Error(`invalid account to transfer credit to: ${to}`);

    if (!userId)
      throw new Error(`unauthorized user: ${userId}`);
    const from_arr = players.filter((each) => each.name.toLowerCase() == userId.toLowerCase());
  
    if (from_arr.length != 1)
      throw new Error(`unauthorized user: ${userId}`);

    const from = from_arr[0];
    const to = to_arr[0];

    if (!amount || isNaN(amount) || from.balance < amount)
      throw new Error(`insufficient/invalid amount: ${amount}`);
    
    if (from.name == to.name)
      throw new Error(`same account tranfer by ${from.name}`);

    const transferRes = await transferWithoutCSRFToken(from, to, parseInt(amount));
    // const transferRes = await transferWithCSRFToken(from, to, parseInt(amount), userId, req_csrf_token);

    req.session.user = from;
    // console.log('transferRes', transferRes);
    // return res.json(transferRes);
    return res.redirect('/');
  } catch (error) {
    let csrf_token;
    if (req.session.user)
      csrf_token = cache.get(getCSRFTokenKey(req.session.user.name));
    return res.render('index', { user: req.session.user, blogs, players, error, csrf_token });
  }
});


router.get ("/login", (req, res )=> {
  res.sendFile(__dirname + "/login.js");
});

router.get("/location", (req, res) => {
  res.sendFile(__dirname + "/location.js");
});

router.post('/login', (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      throw new Error(`empty userId`);
    
    const user = players.filter((each) => each.name.toLowerCase() == userId.toLowerCase());
    if (!user || !user.length)
      throw new Error(`user ${userId} not found`);

    req.session.user = user[0];
    // console.log('players', players);
  
    let csrf_token = crypto.randomBytes(16).toString('base64');
    cache.set(getCSRFTokenKey(userId), csrf_token);
    // console.log('session', req.session);
    return res.json({ success: true });
  } catch (error) {
    let csrf_token;
    if (req.session.user)
      csrf_token = cache.get(getCSRFTokenKey(req.session.user.name));
    return res.render('index', { user: req.session.user, blogs, players, error, csrf_token });
  }
});

router.get('/reset', async (req, res, next) => {
  const destroyRes = await req.session.destroy();
  players = [
    {name: 'hacker', balance: 0},
    {name: 'Vaibhav', balance: 10000},
    {name: 'Maaz', balance: 10000},
    {name: 'Shuvam', balance: 10000},
    {name: 'Vineet', balance: 10000},
  ];
  cache.flushAll();
  return res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let csrf_token;
  // console.log('req.session', req.session);
  if (req.session.user)
    csrf_token = cache.get(getCSRFTokenKey(req.session.user.name));
  res.render('index', { user: req.session.user, blogs, players, csrf_token });
});

module.exports = router;
