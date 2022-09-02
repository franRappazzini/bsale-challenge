const { Router } = require("express");
const pool = require("../db");
const category = Router();

category.get("", (req, res) => {
  const query = "SELECT * FROM category";

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

module.exports = category;
