const { v4: uuidv4 } = require("uuid");
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
let userinfo = []; //Start with empty array
if (fs.existsSync("users.json")) {
  let data = fs.readFileSync("users.json", "utf-8");
  userinfo = JSON.parse(data);
}

app.post("/register", (req, res) => {
  userinfo.push(req.body);
  fs.writeFileSync("users.json", JSON.stringify(userinfo));
  res.sendStatus(200);
});

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
//POST - add a new property
//GET - display a property
//GET - display owner's properties
//PUT or PATCH -  edit a property
//DELETE - delete a property

//POST - add a new property
app.post("/properties", (req, res) => {
  if (!req.query.ownerId) {
    res.status(400).send();
  }
  const ownerProperty = {
    propertyId: uuidv4(), //Library that generate IDs
    ownerId: req.query.ownerId,
    address: req.body.address,
    neighborhood: req.body.neighborhood,
    squareFeet: req.body.squareFeet,
    hasParking: req.body.hasParking,
    hasPublicTransit: req.body.hasPublicTransit,
    workspace: req.body.workspace, //workspace: Array of Objects with all the options
  };
  const propertyDB = readPropertyData();
  propertyDB.push(ownerProperty);
  savePropertyData(propertyDB);
  res.status(200).send({ ownerProperty });
});

function readPropertyData() {
  try {
    const data = fs.readFileSync("properties.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
  }
}

function savePropertyData(data) {
  try {
    fs.writeFileSync("properties.json", JSON.stringify(data, null, 2));
    console.log("Property data saved to properties.json");
  } catch (error) {
    console.error("Error writing JSON file:", error);
  }
}
//GET - display a property
app.get("/properties/:id", (req, res) => {
  const ownerPropertyData = readPropertyData();
  let propertyFound;
  ownerPropertyData.forEach((property) => {
    if (property.propertyId === req.params.id) {
      propertyFound = property;
    }
  });
  if (propertyFound) {
    res.status(200).send(propertyFound);
  } else {
    res.status(404).send();
  }
});

//GET - display owner's properties
app.get("/properties", (req, res) => {
  if (!req.query.ownerId) {
    res.status(400).send();
  }
  const ownerPropertyData = readPropertyData();
  const ownerProperties = [];
  ownerPropertyData.forEach((property) => {
    if (property.ownerId === req.query.ownerId) {
      ownerProperties.push(property);
    }
  });
  res.status(200).send(ownerProperties);
});
//PUT or PATCH -  edit a property

app.listen(8081, () => {
  console.log("Example app listening on port 8081!");
});
