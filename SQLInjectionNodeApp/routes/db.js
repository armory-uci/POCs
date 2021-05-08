var express = require('express');
var router = express.Router();
var mysql = require('mysql');

let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysqlroot',
  database: 'inventory'
});

db.connect();

router.all('/', async (req, res, next) => {
  try {
    // const sql_command = "select * from items where item_name like '%"+req.body.item+"%';";
    const sql_command = `select * from items where item_name like '%${req.body.item}%';`;
    
    // const sql_command = `select * from items where item_name like ${mysql.escape('%' + req.body.item + '%')};`;
    
    db.query(sql_command, [req.body.item], (err, results) => {
      if (err) throw err;
      return res.render('index', { search_result: results });
    });
  } catch (error) {
    return res.render('index', { search_result: [{ error } ]});
  }
});

module.exports = router;
