const mysql = require('mysql');

let db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysqlroot',
  database: 'inventory'
});

db.connect();

const getSearchResults = async (item) => {
  return new Promise((resolve, reject) => {
    // const sql_command = "select * from items where item_name like '%"+item+"%';";
    const sql_command = `select * from items where item_name like '%${item}%';`;
      
    // const sql_command = `select * from items where item_name like ${mysql.escape('%' + item + '%')};`;
    
    db.query(sql_command, [item], (err, results) => {
      if (err) 
        return reject(err);
      return resolve({ search_result: results });
    });
  });
}


module.exports = {
  getSearchResults
}