const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const winston = require('winston');
const dotenv = require("dotenv");


// Routes

const mlthRoutes = require("./routes/mlthRoutes")
const baRoutes = require("./routes/baRoutes");
const imasRoutes = require("./routes/imasRoutes")
const sekaiRoutes = require("./routes/sekaiRoutes");
const shinyRoutes = require("./routes/shinyRoutes")


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}







// set up
const app = express();
app.use(cors({
  origin: "http://localhost:3000", // allow to server to accept request from different origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true // allow session cookie from browser to pass through
}));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
dotenv.config();


app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// routes
app.use("/api/v1",baRoutes)
app.use("/api/v1/idol",imasRoutes)
app.use("/api/v1/idol",mlthRoutes)
app.use("/api/v1/idol",shinyRoutes)
app.use("/api/v1/idol",sekaiRoutes)





app.listen(process.env.PORT || 8080, (req, res) => {
  console.log("Server is running on port 8080");
});
