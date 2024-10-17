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

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://portfolio-dashboard-two-gold.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

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
