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
const express_mongo_sanitize = require("express-mongo-sanitize");
const cluster = require('cluster');
const os = require('os');
const app = express();
app.use(helmet());
app.use(express_mongo_sanitize());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/uploads", express.static("uploads"));
require("./config/db_connection").db_connection();const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    app.listen(global.port, () => {
        console.log(`Worker ${process.pid} started on port ${global.port}`);
    });
}

app.use("/", require("./routes"));
process.on("uncaughtException", (err) => {
  console.log("uncaught exception", err);
});
module.exports = module.exports = { app, io };