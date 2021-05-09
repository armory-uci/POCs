const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', {search_result: [{}]});
});

module.exports = router;
