const mysql = require('mysql');

const mysqlConnection = mysql.createPool({
  connectionLimit: 20,
  host: '162.214.162.222',
  user: 'kagencia_access',
  password: 'UT&9]F#)nG^S7x9=Iw',
  database: 'kagencia_capacitaciones_crece_con_colgate'
});

module.exports = mysqlConnection;