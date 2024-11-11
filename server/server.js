require("dotenv").config();
const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConnection = require("./database/database");

const app = express();
const port = process.env.PORT || 3000;

// Ensure that the environment variable name is the same as in Vercel
const MONGODB_URL = process.env.MONGODB_URL; // Use the correct environment variable
const whitelist = [
  "https://portfolio-dashboard-two-gold.vercel.app",
  "https://portfolio-livid-pi-85.vercel.app"
];

// CORS Options Delegate Function
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    // If origin is in the whitelist, allow the request
    corsOptions = {
      origin: true,
      methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed methods
      allowedHeaders: "Content-Type,Authorization", // Allowed headers
      credentials: true
    };
  } else {
    // If origin is not allowed, block the request
    corsOptions = { origin: false };
  }
  callback(null, corsOptions); // callback expects error (null) and options
};

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptionsDelegate));

// DB Connection
dbConnection(MONGODB_URL);

// API Endpoints
app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

app.use("/api", routes);
app.options("*", cors(corsOptionsDelegate));


// Initializing Server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
