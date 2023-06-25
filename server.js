const express = require("express");
const { execSync } = require("child_process");
const path = require("path");
const open = require("openurl");

const app = express();
const port = 3000;

const phpFilesDir = path.join(__dirname, "src", "php");
const htmlFilesDir = path.join(__dirname, "src");

app.use("/php", (req, res) => {
  const url = req.url === "/" ? "/index.php" : req.url;
  const command = `php -f ${path.join(phpFilesDir, url)}`;
  const output = execSync(command).toString();
  res.send(output);
});

app.use(express.static(htmlFilesDir));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  open.open(`http://localhost:${port}`);
});
