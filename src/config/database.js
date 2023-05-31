const mysql = require("mysql");
const dotenv = require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 20,
  host: process.env.DDBB_HOST,
  user: process.env.DDBB_USER,
  password: process.env.DDBB_PASSWORD,
  database: "kagencia_visita_autoguiada_droguitas",
});

exports.db_query = async (query, data) => {
  return await new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        connection.query(query, data, (err, results, fields) => {
          if (err) reject(err);

          resolve(results);

          connection.release();
          if (err) reject(err);
        });
      }
    });
  });
};
