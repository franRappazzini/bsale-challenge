require("dotenv").config();
const mysql = require("mysql");
const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env;

const pool = mysql.createPool({
  connectionLimit: 10,
  host: DB_HOST,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASS,
});

module.exports = pool;
