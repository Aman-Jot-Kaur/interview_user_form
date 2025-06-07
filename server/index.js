require("dotenv").config();

global.argv = process.argv.slice(2);
global.port = global.argv[0] || process.env.APP_PORT;

if (!global.port) {
  console.log("port is not defined. argv = ", global.argv);
  process.exit(128);
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cluster = require("cluster");
const os = require("os");
const path = require("path"); // added
const app = express();

// Middleware

const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(cors({
  origin: "*",
  credentials: true,
}));

// ✅ FIXED: Static uploads with CORS header
app.use('/uploads', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Body parsing
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// DB Connection
require("./config/db_connection").db_connection();

// Clustering setup
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log("Starting a new worker");
    cluster.fork();
  });
} else {
  app.listen(global.port, () => {
    console.log(`Worker ${process.pid} started on port ${global.port}`);
  });
}

// Routes
app.use("/", require("./routes"));

// Error handling
process.on("uncaughtException", (err) => {
  console.log("uncaught exception", err);
});

module.exports = { app };
