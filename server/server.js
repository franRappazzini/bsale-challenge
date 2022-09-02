const express = require("express");
const cors = require("cors");
const product = require("./routes/product");
const category = require("./routes/category");
const server = express();

server.use(cors());
server.use(express.json());
server.use("/product", product);
server.use("/category", category);

const port = process.env.PORT || 3001;
server.listen(port, () => console.log("Server listening on port:", port));
