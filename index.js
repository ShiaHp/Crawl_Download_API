const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const client = require("https");
const res = require("express/lib/response");
const download = require("image-downloader");
const translate = require('@vitalets/google-translate-api');



// Routes
const mlthRoutes = require("./routes/mlthRoutes")
const baRoutes = require("./routes/baRoutes");
const imasRoutes = require("./routes/imasRoutes")
const sekaiRoutes = require("./routes/sekaiRoutes");
const shinyRoutes = require("./routes/shinyRoutes")




// set up
const app = express();
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
