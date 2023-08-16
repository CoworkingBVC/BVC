const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PropertyManager = require("./PropertyManager");
const handlebars = require("handlebars");

const fs = require("fs");

const app = express();

const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("images"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main.html");
});

/* login - nya*/
//POST - login

/* signup - ody*/
//POST - signup
app.get("/main.html", (req, res) => {
  res.sendFile(__dirname + "/main.html");
});

app.get("/signup.html", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

let userinfo = []; //Start with empty array
if (fs.existsSync("users.json")) {
  let data = fs.readFileSync("users.json", "utf-8");
  userinfo = JSON.parse(data);
}

app.post("/register", (req, res) => {
  userinfo.push({ id: uuidv4(), ...req.body });
  fs.writeFileSync("users.json", JSON.stringify(userinfo));
  res.sendStatus(200);
});

/* coworker - jiwon*/

app.get("/propertyList.html", (req, res) => {
  res.sendFile(__dirname + "/propertyList.html");
});

app.get("/property.html", (req, res) => {
  res.sendFile(__dirname + "/property.html");
});

app.get("/propertyList.js", (req, res) => {
  res.sendFile(__dirname + "/propertyList.js");
});

app.get("/style.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/coworker", async (req, res) => {
  try {
    let properties = [];

    properties = ReadData();
    let workspaces = [];
    for (let i = 0; i < properties.length; i++) {
      for (let k = 0; k < properties[i].workspace.length; k++) {
        let worksapceWithPropertyInfo = {
          propertyId: properties[i].propertyId,
          address: properties[i].address,
          neighborhood: properties[i].neighborhood,
          squareFeet: properties[i].squareFeet,
          hasParking: properties[i].hasParking,
          hasPublicTransit: properties[i].hasPublicTransit,
          type: properties[i].workspace[k].type,
          seats: properties[i].workspace[k].seats,
          isSmokingAllowed: properties[i].workspace[k].isSmokingAllowed,
          AvailabilityStart: properties[i].workspace[k].availabilityStart,
          AvailabilityEnd: properties[i].workspace[k].availabilityEnd,
          leaseTerm: properties[i].workspace[k].leaseTerm,
          price: properties[i].workspace[k].price,
        };
        workspaces.push(worksapceWithPropertyInfo);
      }
    }

    const responseMessage = {
      status: "success",
      result: workspaces,
    };

    res.json(responseMessage);
  } catch {
    throw Error();
  }
});

//GET - search
app.get("/search", (req, res) => {
  //console.log("search");
  const {
    address,
    neighborhood,
    squareFeetMin,
    squareFeetMax,
    hasParking,
    hasPublicTransit,
    seats,
    isSmokingAllowed,
    AvailabilityStart,
    AvailabilityEnd,
    priceMin,
    priceMax,
  } = req.query;

  let properties = [];

  properties = ReadData();

  const propertyManager = new PropertyManager(properties);

  const propertySearchOptions = {
    address: address,
    neighborhood: neighborhood,
    squareFeet: [parseInt(squareFeetMin), parseInt(squareFeetMax)],
    hasParking: hasParking === "true",
    hasPublicTransit: hasPublicTransit === "true",
  };

  const workspaceSearchOptions = {
    seats: parseInt(seats),
    isSmokingAllowed: isSmokingAllowed === "true",
    AvailabilityStart: AvailabilityStart,
    AvailabilityEnd: AvailabilityEnd,
    price: [parseInt(priceMin), parseInt(priceMax)],
  };

  function filterNonNaNOrUndefined(obj) {
    const result = {};
    for (const key in obj) {
      switch (key) {
        case "squareFeet":
        case "price":
          const [min, max] = obj[key];

          if (!isNaN(min) || !isNaN(max)) {
            result[key] = [!isNaN(min) ? min : 0, !isNaN(max) ? max : "Max"];
          }
          break;

        case "seats":
          if (!isNaN(obj[key])) {
            result[key] = obj[key];
          }
          break;
        default:
          if (obj[key] !== undefined || !isNaN(obj[key])) {
            result[key] = obj[key];
          }
      }
    }
    return result;
  }

  const filteredPropertySearchOptions = filterNonNaNOrUndefined(
    propertySearchOptions
  );
  const filteredWorkspaceSearchOptions = filterNonNaNOrUndefined(
    workspaceSearchOptions
  );

  const matchingWorkspaces = propertyManager.searchWorkspaces(
    filteredPropertySearchOptions,
    filteredWorkspaceSearchOptions
  );

  if (matchingWorkspaces.length > 0) {
    const responseMessage = {
      status: "success",
      result: matchingWorkspaces,
    };

    res.json(responseMessage);
  } else {
    res.json({ message: "No matching workspaces found." });
  }
});

//GET - each workspace
app.get("/coworker/:id", (req, res) => {
  //if the user clicks a worksapce, it will show the owner info
  try {
    let propertyId = req.params.id;
    let properties = [];
    properties = ReadData();

    let property = properties.find((item) => item.propertyId == propertyId);
    let ownerId = property.ownerId;

    let userinfo = [];
    if (fs.existsSync("users.json")) {
      let data = fs.readFileSync("users.json", "utf-8");
      userinfo = JSON.parse(data);
    }

    let ownerInfo = userinfo.find((owner) => owner.id == ownerId);

    const responseMessage = {
      status: "success",
      result: ownerInfo,
      propertyId,
    };

    res.json(responseMessage);
  } catch {
    throw Error();
  }
});

function ReadData() {
  if (fs.existsSync("properties.json")) {
    let data = fs.readFileSync("properties.json", "utf8");

    properties = JSON.parse(data);
    if (!Array.isArray(properties)) {
      properties = [];
    }
  }
  return properties;
}

/* owner -jhenyffer*/
//POST - add a new property
//GET - display a property
//GET - display owner's properties
//PUT or PATCH -  edit a property
//DELETE - delete a property

//POST - add a new property
app.post("/properties", (req, res) => {
  if (!req.query.ownerId) {
    res.status(400).send("missing owner ID");
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
app.put("/properties/:id", (req, res) => {
  if (!req.query.ownerId) {
    res.status(400).send();
  }
  const newPropertyInfo = {
    propertyId: req.params.id,
    ownerId: req.query.ownerId,
    address: req.body.address,
    neighborhood: req.body.neighborhood,
    squareFeet: req.body.squareFeet,
    hasParking: req.body.hasParking,
    hasPublicTransit: req.body.hasPublicTransit,
    workspace: req.body.workspace,
  };
  //read list of properties
  const propertyData = readPropertyData();
  //find property by id
  let found = false;
  for (let i = 0; i < propertyData.length; i++) {
    if (
      propertyData[i].propertyId === newPropertyInfo.propertyId &&
      propertyData[i].ownerId === newPropertyInfo.ownerId
    ) {
      found = true;
      propertyData[i] = newPropertyInfo; //modify the object in the array
    }
  }
  if (!found) {
    res.status(404).send();
  }
  //save the object
  savePropertyData(propertyData);
  //204 answer
  res.status(204).send();
});

//DELETE - delete a property
app.delete("/properties/:id", (req, res) => {
  if (!req.query.ownerId) {
    res.status(400).send();
  }

  const propertyData = readPropertyData();
  const propertyIndex = propertyData.findIndex(
    (property) =>
      property.propertyId === req.params.id &&
      property.ownerId === req.query.ownerId
  );
  if (propertyIndex === -1) {
    res.status(404).send();
  } else {
    propertyData.splice(propertyIndex, 1);
    savePropertyData(propertyData);
    res.status(204).send();
  }
});

const port = 8081;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
