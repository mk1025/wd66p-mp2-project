const express = require("express");
const { execSync } = require("child_process");
const path = require("path");
const open = require("openurl");

const app = express();
const port = 3000;

const phpFilesDir = path.join(__dirname, "src", "php");
const htmlFilesDir = path.join(__dirname, "src");
const jsFilesDir = path.join(__dirname, "src", "scripts", "js");

app.use(express.static(htmlFilesDir));
app.use(express.static(jsFilesDir));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("php/registration", (req, res) => {
  const data = req.body;
  console.log(data);
  const command = `php-cgi -f ${path.join(phpFilesDir, "registration.php")}`;
  const output = execSync(command, { input: JSON.stringify(data) }).toString();
  res.send(output);
});

app.use("/php", (req, res) => {
  const url = req.url === "/" ? "/index.php" : req.url;
  const command = `php -f ${path.join(phpFilesDir, url)}`;
  const output = execSync(command).toString();
  res.send(output);
});

module.exports = app;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  open.open(`http://localhost:${port}`);
});
