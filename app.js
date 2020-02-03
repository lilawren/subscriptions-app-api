// Written by Lawrence Li

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors());

app.use(morgan("dev"));
// Use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add intentional timeout
app.use((req, res, next) => {
  setTimeout(next, 1000);
});

const port = 5000;

var PLAN_COSTS = {
  basic: 1,
  good: 10,
  better: 100,
  best: 1000
};

var PLAN_NAMES = {
  basic: "Basic",
  good: "Good",
  better: "Better",
  best: "Best"
};

let storedSubscription = {
  plan: "good",
  name: "Good",
  seats: 5,
  cost: 50
};

// Get current plan
app.get("/api/current", (req, res) => {
  res.json(storedSubscription).status(200);
});

// Update the plan
app.put("/api/current", (req, res) => {
  console.log(req.body);
  const { plan, seats } = req.body;
  storedSubscription = {
    ...storedSubscription,
    plan,
    name: PLAN_NAMES[plan],
    seats,
    cost: seats * PLAN_COSTS[plan]
  };

  res.sendStatus(200);
});

// Returns price of the updated subscription
app.get("/api/preview", (req, res) => {
  const { plan, seats } = req.query;
  const result = {
    plan,
    name: PLAN_NAMES[plan],
    seats,
    cost: seats * PLAN_COSTS[plan]
  };
  res.json(result).status(200);
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
