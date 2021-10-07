const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
// security addon
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");



// apply limiter to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});


// middleware
app.use(limiter);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const obj = JSON.parse(fs.readFileSync("data.json", "utf8"));

let earthquakes = obj.features;
let newEarthquakes = [];

for (let earthquake of earthquakes) {
  let newEarthquake = {};
  newEarthquake.id = earthquake.id;
  newEarthquake.time = earthquake.properties.time;
  newEarthquake.coordinates = earthquake.geometry.coordinates;
  newEarthquake.magnitude = earthquake.properties.mag;
  newEarthquake.location = earthquake.properties.place;

  newEarthquakes.push(newEarthquake);
}

// get all earthquake
app.get("/earthquake", (req, res) => {
  res.status(200).json(newEarthquakes);
});


// get earthquake by id
app.get("/earthquake/:id", (req, res) => {
  const id = req.params.id;

  for (let earthquake of newEarthquakes) {
    if (earthquake.id === id) {
      res.status(200).json(earthquake);
      return;
    }
  }

  res.status(404).send("Earthquake not found");
});


// modify an event 
app.put("/earthquake/:id", (req,res) => {
  const id = req.params.id;
  let earthquake = newEarthquakes.find(earthquake => earthquake.id === id)
  earthquake.time = req.body.time;
  earthquake.coordinates = req.body.coordinates;
  earthquake.magnitude = req.body.magnitude;
  earthquake.location = req.body.location;
  res.status(200).json(earthquake)
});


// delete an event 
app.delete("/earthquake/:id", (req,res) => {
  const id = req.params.id;
  let earthquake = newEarthquakes.find(earthquake => earthquake.id === id);
  newEarthquakes.splice(newEarthquakes.indexOf(earthquake),1);
  res.status(200).json(newEarthquakes);
});


// create earthquake
app.post("/earthquake", (req, res) => {
  const newEarthquake = req.body;

  newEarthquakes.push(newEarthquake);

  res.status(200).json({msg:"new earthquake added",newEarthquake});
});


//Publish api
const port = 3000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
