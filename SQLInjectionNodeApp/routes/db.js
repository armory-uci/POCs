var express = require('express');
var router = express.Router();
const config = require('../config');

function test(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => resolve('batman'), timeout);
  })
}

/* GET db listing. */
router.get('/:id', async function(req, res, next) {
  // res.send('respond with a resource');
  let results = await test(1000);
  console.log('id', req.params.id, config);
  return res.json(config);
});


module.exports = router;
