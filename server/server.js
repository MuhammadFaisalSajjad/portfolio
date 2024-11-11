// require("dotenv").config();
// const express = require("express");
// const routes = require("./routes/index");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const dbConnection = require("./database/database");

// const app = express();
// const port = process.env.PORT || 3000;

// // Ensure that the environment variable name is the same as in Vercel
// const MONGODB_URL = process.env.MONGODB_URL; // Use the correct environment variable
// const whitelist = [
//   "https://portfolio-dashboard-two-gold.vercel.app",
//   "https://portfolio-livid-pi-85.vercel.app",
//   "https://faisal-portfolio-backend.vercel.app",
// ];

// // CORS Options Delegate Function
// const corsOptionsDelegate = function (req, callback) {
//   let corsOptions;
//   if (whitelist.indexOf(req.header("Origin")) !== -1) {
//     // If origin is in the whitelist, allow the request
//     corsOptions = {
//       origin: true,
//       methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed methods
//       allowedHeaders: "Content-Type,Authorization", // Allowed headers
//       credentials: true,
//     };
//   } else {
//     // If origin is not allowed, block the request
//     corsOptions = { origin: false };
//   }
//   callback(null, corsOptions); // callback expects error (null) and options
// };

// // Middleware
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }));
// app.use('*',cors(corsOptionsDelegate));
// // app.use(cors({ origin: '*' }));

// // DB Connection
// dbConnection(MONGODB_URL);

// // API Endpoints
// app.get("/", (req, res) => {
//   res.send("Welcome to Backend");
// });

// app.use("/api", routes);
// app.options("*", cors(corsOptionsDelegate));

// // Initializing Server
// app.listen(port, () => {
//   console.log(`Server is listening on http://localhost:${port}`);
// });


//-------------------------------------------------------------------------------------------------------

require("dotenv").config();
const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbConnection = require("./database/database");

const app = express();
const port = process.env.PORT || 3000;

// Environment variable for MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL;

// Whitelist for allowed origins
const whitelist = [
  "https://portfolio-dashboard-two-gold.vercel.app",
  "https://portfolio-livid-pi-85.vercel.app",
  "https://faisal-portfolio-backend.vercel.app",
];

// CORS options delegate function
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  const origin = req.header("Origin");
  if (whitelist.includes(origin)) {
    corsOptions = {
      origin: true,
      methods: "GET,POST,PUT,DELETE,OPTIONS", // Allowed methods
      allowedHeaders: "Content-Type,Authorization", // Allowed headers
      credentials: true,
    };
    console.log(`CORS allowed for origin: ${origin}`); // Debugging
  } else {
    corsOptions = { origin: false };
    console.log(`CORS denied for origin: ${origin}`); // Debugging
  }
  callback(null, corsOptions); // Callback with no error and options
};

// Apply CORS middleware before route handling
app.use(cors(corsOptionsDelegate));
app.options("*", cors(corsOptionsDelegate)); // Preflight handling

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

// DB Connection
dbConnection(MONGODB_URL);

// API Endpoints
app.get("/", (req, res) => {
  res.send("Welcome to Backend");
});

app.use("/api", routes);

// Initializing Server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
