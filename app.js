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

/* login - nya*/
//POST - login

/* signup - ody*/
//POST - signup

/* coworker - jiwon*/
//GET - display workspace
app.get("/coworker", (req, res) => {
  try {
    let properties = [];

    if (fs.existsSync("properties.json")) {
      let data = fs.readFileSync("properties.json", "utf8");

      properties = JSON.parse(data);
      if (!Array.isArray(properties)) {
        properties = [];
      }
    }

    const responseMessage = {
      status: "success",
      result: properties,
    };

    res.json(responseMessage);
  } catch {
    throw Error();
  }
});
//GET - each property
app.get("/coworker/:id", (req, res) => {
  try {
    let propertyId = req.params.id;
    let properties = [];

    if (fs.existsSync("properties.json")) {
      let data = fs.readFileSync("properties.json", "utf8");

      properties = JSON.parse(data);
      if (!Array.isArray(properties)) {
        properties = [];
      }
    }
    let property = properties.find((item) => (item.property_id = propertyId));
    console.log(property);

    const responseMessage = {
      status: "success",
      result: property,
    };

    res.json(responseMessage);
  } catch {
    throw Error();
  }
});

/* owner -jhenyffer*/
//GET - display owner's properties
//POST - add a new property
//POST or PATCH -  edit a property
//DELETE - delete a property

app.listen(8081, () => {
  console.log("Example app listening on port 8081!");
});
