const express = require("express");
const bodyParser = require("body-parser");

const fs = require("fs");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* for each page? */
/* 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})
 */

/* main */
//POST - login

/* signup */
//POST - signup

/* coworker */
//GET - display workspace
//POST - booking

/* owner */
//GET - display owner's properties
//POST - add a new property
//POST or PATCH -  edit a property
//DELETE - delete a property

app.listen(8081, () => {
  console.log("Example app listening on port 8081!");
});
