const express = require("express");
const phpExpress = require("php-express");
const mysql = require("mysql");

const app = express();
const port = 3000;

// Configuration for PHP to work with Express
app.set("views", "./php");
app.engine("php", phpExpress.engine);
app.set("view engine", "php");
app.all(/.+\.php$/, (req, res, next) => {
  phpExpress.router(req, res, next);
});

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "password",
  //   database: "mydatabase",
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
