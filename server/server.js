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
  "https://portfolio-dashboard-two-gold.vercel.app/",
  "https://portfolio-livid-pi-85.vercel.app/",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],  
  allowedHeaders: ["Content-Type", "Authorization"],   
};

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

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
