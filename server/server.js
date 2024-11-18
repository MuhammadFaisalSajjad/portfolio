require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConnection = require("./database/database");
const routes = require("./routes/index");

const app = express();
const port = process.env.PORT || 3000;

// Ensure that the environment variable name is correct
const MONGODB_URL = process.env.MONGODB_URL;

// Define the whitelist for allowed origins
const whitelist = [
  "https://portfolio-dashboard-two-gold.vercel.app",
  "https://portfolio-livid-pi-85.vercel.app",
  "https://faisal-portfolio-backend.vercel.app",
];

// CORS Options Delegate Function
const corsOptionsDelegate = function (req, callback) {
  const origin = req.header("Origin");
  let corsOptions;
  if (whitelist.includes(origin)) {
    corsOptions = {
      origin: origin, // Reflect the request origin
      methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed methods
      allowedHeaders: "Content-Type,Authorization", // Allowed headers
      credentials: true, // Allow credentials
    };
    console.log(`CORS allowed for origin: ${origin}`); // Debug logging
  } else {
    corsOptions = { origin: false };
    console.log(`CORS denied for origin: ${origin}`); // Debug logging
  }
  callback(null, corsOptions);
};

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// Apply CORS middleware
app.use(cors(corsOptionsDelegate));
app.options("*", cors(corsOptionsDelegate)); // Handle preflight requests

// Set header for credentials
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Database connection
dbConnection(MONGODB_URL);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

// Apply API routes
app.use("/api", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
