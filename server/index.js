const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// set up
const app = express();


app.use(
  cors({
    origin: "http://localhost:3000", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow session cookie from browser to pass through
  })
);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(
  "/public/uploads/post",
  express.static(__dirname + "/public/uploads/post")
);



app.use(bodyParser.json({}));
app.use(cors());
dotenv.config();

const connectDB = (url) => {
  return mongoose.connect(url);
};
// Routes

const mlthRoutes = require("./routes/mlthRoutes");
const baRoutes = require("./routes/baRoutes");
const imasRoutes = require("./routes/imasRoutes");
const sekaiRoutes = require("./routes/sekaiRoutes");
const shinyRoutes = require("./routes/shinyRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const elaRouter = require("./routes/e-gal");

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// routes
app.use("/api/v1", baRoutes);
app.use("/api/v1/idol", imasRoutes);
app.use("/api/v1/idol", mlthRoutes);
app.use("/api/v1/idol", shinyRoutes);
app.use("/api/v1/idol", sekaiRoutes);
app.use("/api/v1/", uploadRoutes);
app.use("/api/v1/",elaRouter)



const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(process.env.PORT || 8080, (req, res) => {
      console.log("Server is running on port 8080");
      console.log(`Connect to DB`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
