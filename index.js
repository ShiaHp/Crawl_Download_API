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


// routes get image from specific id of image
// app.get('/api/v1/mlth/chara/show/gal/:id/:url', async(req, res) => {
//       const url = `${charMlthUrl}/${req.params.id}/${req.params.url}`;
//       console.log(url)
//       const gallery = []
      
//       try {
//           axios(url).then((response) => {
//             const html = response.data;
//             const $ = cheerio.load(html);
//             $("article.d2_3 > section.imgbox").each(function(index,element){
//               $(this).find("article > a > img").each((function(){
//                 const image = $(this).attr("data-original");


//                 const options = {
//                   url: image,
//                   dest: "F:/Pictures/Live2D/others",
               
//                 };

//                 download
//                 .image(options)
//                 .then(({ filename }) => {
//                   console.log("Save to", filename);
//                 })
//                 .catch((err) => console.error(err));
            
          
//                 gallery.push(image);
//              }))
      
//             })
//             res.status(200).json({ gallery})
//           })
//       } catch (error) {
//         res.status(500).json(error)
//       }


// })



app.listen(process.env.PORT || 8080, (req, res) => {
  console.log("Server is running on port 8080");
});
