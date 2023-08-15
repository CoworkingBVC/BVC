const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const PropertyManager = require("./PropertyManager");

const fs = require("fs");

const app = express();

const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public")); // Assuming 'public' is the folder containing your HTML, CSS, and JS files

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
//GET - display workspace
/* app.get("/coworker", (req, res) => {
  res.sendFile(__dirname + "/propertyList.html");
}); */
app.get("/coworker", async (req, res) => {
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

    //res.json(properties);
    res.json(responseMessage);
    //res.render("/propertyList.html");
    //res.sendFile(__dirname + "/propertyList.html");
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

  if (fs.existsSync("properties.json")) {
    let data = fs.readFileSync("properties.json", "utf8");

    properties = JSON.parse(data);
    if (!Array.isArray(properties)) {
      properties = [];
    }
  }

  const propertyManager = new PropertyManager(properties);

  const propertySearchOptions = {
    address: req.query.address,
    neighborhood: req.query.neighborhood,
    squareFeet: [
      parseInt(req.query.squareFeetMin),
      parseInt(req.query.squareFeetMax),
    ],
    hasParking: req.query.hasParking === "true",
    hasPublicTransit: req.query.hasPublicTransit === "true",
  };

  const workspaceSearchOptions = {
    seats: parseInt(req.query.seats),
    isSmokingAllowed: req.query.isSmokingAllowed === "true",
    AvailabilityStart: req.query.AvailabilityStart,
    AvailabilityEnd: req.query.AvailabilityEnd,
    price: [parseInt(req.query.priceMin), parseInt(req.query.priceMax)],
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
    res.json(matchingWorkspaces);
  } else {
    res.json({ message: "No matching workspaces found." });
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
  }

  res.status(204).send();
});

const port = 8081;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
