const { Router } = require("express");
const pool = require("../db");
const product = Router();

product.get("", (req, res) => {
  const { name, category, order } = req.query;

  const orderBy = order?.split("-");

  // armo la query de SQL segun las queries pasadas
  let query = "SELECT * FROM product";
  if (name && category && order) {
    query += ` WHERE name LIKE '%${name}%' AND category=${category} ORDER BY ${orderBy[0]} ${orderBy[1]};`;
  } else if (name && order) {
    query += ` WHERE name LIKE '%${name}%' ORDER BY ${orderBy[0]} ${orderBy[1]};`;
  } else if (category && order) {
    query += ` WHERE category=${category} ORDER BY ${orderBy[0]} ${orderBy[1]};`;
  } else if (name && category) {
    query += ` WHERE name LIKE '%${name}%' AND category=${category};`;
  } else if (name) {
    query += ` WHERE name LIKE '%${name}%';`;
  } else if (category) {
    query += ` WHERE category=${category};`;
  } else if (order) {
    query += ` ORDER BY ${orderBy[0]} ${orderBy[1]};`;
  } else query += ";";

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
