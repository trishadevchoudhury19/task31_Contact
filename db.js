const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Apple1234@',
  database: 'contactbook',
  waitForConnections: true,
  connectionLimit: 10
});
module.exports = pool.promise();
