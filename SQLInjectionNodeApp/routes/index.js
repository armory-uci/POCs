const express = require('express');
const cors = require('cors');

const router = express.Router();
const { getSearchResults } = require('./db');

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index', { search_result: [{}] });
});

router.all('/submit', async (req, res, next) => {
  try {
    const searchRes = await getSearchResults(req.body.item);
    return res.render('index', searchRes);
  } catch (error) {
    return res.render('index', { search_result: [{ error }] });
  }
});

router.get('/status', cors(), async (req, res, next) => {
  const status = { solved: false };
  try {
    const item =
      "hammer' UNION (SELECT TABLE_NAME, TABLE_SCHEMA FROM information_schema.tables);-- ";
    const { search_result } = await getSearchResults(item);
    status.solved = Array.isArray(search_result) && !search_result.length;
    return res.json(status);
  } catch (error) {
    return res.json(status);
  }
});

module.exports = router;
