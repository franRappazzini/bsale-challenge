const { Router, response } = require("express");
const { pool } = require("../db");
const product = Router();

product.get("", (req, res) => {
  const { name, category, order } = req.query;

  const orderBy = order?.split("-");

  console.log(orderBy);

  // TODO pasar a switch
  let query = "";
  if (name && category && order) {
    query = `SELECT * FROM product WHERE name LIKE '%${name}%' AND category=${category} ORDER BY ${orderBy[0]} ${orderBy[1]};`;
  } else if (name && order) {
    query = `SELECT * FROM product WHERE name LIKE '%${name}%' ORDER BY ${orderBy[0]} ${orderBy[1]};`;
  } else if (category && order) {
    query = `SELECT * FROM product WHERE category=${category} ORDER BY ${orderBy[0]} ${orderBy[1]};`;
  } else if (name && category) {
    query = `SELECT * FROM product WHERE name LIKE '%${name}%' AND category=${category};`;
  } else if (name) {
    query = `SELECT * FROM product WHERE name LIKE '%${name}%';`;
  } else if (category) {
    query = `SELECT * FROM product WHERE category=${category};`;
  } else if (order) {
    query = `SELECT * FROM product ORDER BY ${orderBy[0]} ${orderBy[1]};`;
  } else query = "SELECT * FROM product;";

  console.log(query);

  try {
    pool.getConnection((err, conn) => {
      if (err) throw err;
      conn.query(query, (err, response, fields) => {
        conn.release();
        if (err) throw err;
        res.json(response);
      });
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = product;
