const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(8081, () => {
  console.log("Example app listening on port 8081!");
});
