const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const fs = require("fs");
const obj = JSON.parse(fs.readFileSync("data.json", "utf8"));

let earthquakes = obj.features;
let newEarthquakes = [];

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

for (let earthquake of earthquakes) {
  let newEarthquake = {};
  newEarthquake.id = earthquake.id;
  newEarthquake.time = earthquake.properties.time;
  newEarthquake.coordinates = earthquake.geometry.coordinates;
  newEarthquake.magnitude = earthquake.properties.mag;
  newEarthquake.location = earthquake.properties.place;

  newEarthquakes.push(newEarthquake);
}
app.get("/earthquake", (req, res) => {
  res.json(newEarthquakes);
});

app.get("/earthquake/:id", (req, res) => {
  // reading isbn from the URL
  const id = req.params.id;

  // searching books for the isbn
  for (let earthquake of newEarthquakes) {
    if (earthquake.id === id) {
      res.json(earthquake);
      return;
    }
  }

  // sending 404 when not found something is a good practice
  res.status(404).send("Earthquake not found");
});

app.post("/earthquake", (req, res) => {
  // reading isbn from the URL
  const newEarthquake = req.body;

  newEarthquakes.push(newEarthquake);

  // sending is a good practice
  res.send("Earthquake is added");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
