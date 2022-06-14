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
const mlthRoutes = require("./routes/mlthRoutes")

const url = "https://bluearchive.fandom.com/wiki/Blue_Archive/Student_Profile";
const charUrl = "https://bluearchive.fandom.com/wiki/";
const imasUrl = "https://starlight.kirara.ca/char/";
const shinyUrl = "https://imassc.gamedbs.jp/chara/show/1/";
const  mlthUrl = "https://imas.gamedbs.jp/mlth/"
const charMlthUrl  = "https://imas.gamedbs.jp/mlth/chara/show/"
const firstChar = "https://imas.gamedbs.jp/mlth/chara/show/1/"
const file = fs.createWriteStream("file.jpg");
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
// app.use("/api/v1/mlth",mlthRoutes)

app.get("/api/v1", async (req, res) => {
  const characters = [];

  const limit = Number(req.query.limit);

  try {
    // const data = await axios(url);
    axios(url).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("tbody tr", html).each(function () {
        const name = $(this).find("a").attr("title");
        const image = $(this).find("a > img").attr("data-src");
        const url = $(this).find("a").attr("href");
     
        characters.push({
          name,
          image,
          url: "https://blue-archive-api.onrender.com/api/v1" + url,
        });
      });

      // const newChars = characters.filter(function (el){
      //     return el.url !== undefined
      // })

      if (limit && limit > 0) {
        res.status(200).json(characters.slice(0, limit));
      } else {
        res.status(200).json(characters);
      }

      // $("td",html).each(function(){
      //      const name =  $(this).find("a").attr('title');
      //      console.log(name)
      //  })
      //
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
// get a characters
app.get("/api/v1/wiki/:character", (req, res) => {
  let url = charUrl + req.params.character;
  const profile = [];
  const details = [];
  const characters = [];
  const quotes = [];
  const charBio = {};
  const live2D = [];
  try {
    axios(url).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      // get the title
      $("aside", html).each(function () {
        //  get banner image

        const image = $(this).find("img").attr("src");

        // dùng each để xử lý chia array thành tập hợp các phần tử : key - values
        $(this)
          .find("section > div > h3")
          .each(function () {
            profile.push($(this).text());
          });

        //  get details
        $(this)
          .find("section > div > div")
          .each(function () {
            const data = $(this).text().trim();
            const result = data.replace(/^\s+|\s+$/gm, "");
            details.push(result);
          });
        const newDetails = details.slice(1);
        if (image !== undefined) {
          for (let i = 0; i < newDetails.length; i++) {
            charBio[profile[i]] = newDetails[i];
          }
          characters.push({
            image,
            ...charBio,
          });
        }

        //   get quotes
        $(".quote ", html).each(function () {
          const quote = $(this).find("td").text();
          const result = quote.replace(/^\s+|\s+$/gm, "");
          quotes.push(result);
        });
      });
      $("table", html).each(function (index, element) {
        const tds = $(element).find("td");
        const data = $(tds[3]).find("img").attr("data-src");
        live2D.push(data);
      });

      const uniq = [...new Set(quotes)];
      const uniq1 = [...new Set(live2D)];

      const live = uniq1.filter((element) => {
        return element !== undefined;
      });

      res.status(200).json({
        message: "Success",
        quote: uniq,
        live2D: live,
        character: characters,
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/imas/download", async (req, res) => {
  // let url = imasUrl + req.params.id;
  let id_start_chars = 101;
  let id_of_character = 314;
  for (id_start_chars; id_start_chars < id_of_character; id_start_chars++) {
    let url = imasUrl + id_start_chars;
    const image = [];
    await axios(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $(".carcon", html).each(function () {
          const data = $(this).find("div > div > a").attr("href");
          image.push(data);
          const options = {
            url: data,
            dest: "F:/Pictures/Live2D/others",
         
          };
          download
            .image(options)
            .then(({ filename }) => {
              console.log("Save to", filename);
            })
            .catch((err) => console.error(err));
        });
      })
      .catch((err) => console.error(err));
  }

  res.status(200).json({
    message: "Success. All images download to your folder",
  });
});

// STILL ERROR
app.get("/charac/:id", async (req, res) => {
  // let url = shinyUrl + req.params.id;
  // const image = [];
  // try {
  //   await axios(url).then((response) => {
  //     const html = response.data;
  //     const $ = cheerio.load(html);

  //     //  $(" .uk-width-1-2@m uk-first-column a",html).each(function(){
  //     //     const data = $(this).find("img").attr("src");
  //     //     console.log(data)
  //     // })
  //     // download icon png

  //     $("div.uk-width-1-4 > div.uk-card ", html).each(function () {
  //       const img = $(this).find("a > img").attr("data-src");
  //     });
  //     // Download image from website
  //     $("div.uk-grid-match", html).each(function (i, e) {
  //       const img = $(this).find("a > img").attr("data-src");
  //       console.log(img);
  //       image.push(img);
  //     });
  //     $(
  //       " body > div.uk-offcanvas-content > main > div.uk-container.uk-container-center.uk-margin-top.uk-margin-large-bottom > div > div.uk-width-2-3\\@m.uk-first-column > div.uk-grid-match.uk-grid-small.uk-text-center.uk-grid.uk-grid-stack > div.uk-grid-margin.uk-first-column > div",
  //       html
  //     ).each(function () {
  //       const img = $(this).find("a > img").attr("data-src");
  //       console.log(img);
  //     });

  //     // const options = {
  //     //   url : data,
  //     //   dest : '/Pictures/live2D',

  //     // }
  //     // download.image(options).then(({filename}) => {
  //     //   console.log('Save to' , filename)
  //     // }).catch((err) => console.error(err));
  //   });
  //   res.status(200).json({ image });
  // } catch (error) {
  //   res.status(500).json(error);
  // }
  let url = charMlthUrl  + req.params.id;
  const image = [];
  const nameChar = [];
  const gallery = []
  try {
    axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("ul li").each(function(){
        const url = $(this).find("a").attr("href");
        const newUrl = url || 'This is error'
        gallery.push(newUrl);
      })
   
      res.status(200).json({
        message : "Success",
        gallery: gallery
      })
    })
      
    
    } catch (error) {
    res.status(500).json(error);
  }
});

// CINDERELLA GIRL ROUTES
// routes get info about idol of mlth
app.get("/api/v1/mlth", async (req, res) => {
  const characters = [];
    try {
        await axios(mlthUrl).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html)

            $("ul li",html).each( async function (){
              let nameChar = ""
              const name = $(this).find("a").attr("title");
              // try {
              //   let newName = await translate(name, {to: 'en'})
              //   nameChar = newName
              // } catch (error) {
              //   console.log(error)
              // }
           
              const image = $(this).find("a > div").attr("style");
              const url = $(this).find("a").attr("href")
            
              const newUrl = url.split("https://imas.gamedbs.jp/")[1]
          
                characters.push({
                  name,url : "https://localhost8080/api/v1/" + newUrl ,
                })
              
            })
          res.status(200).json({
            messages: " Success",
            characters : characters
          })
        })
    } catch (error) {
        res.status(500).json(error);
    }



});

app.get("/api/v1/mlth/chara/show/:id" , (req, res) => {
      const url = charMlthUrl  + req.params.id;
      const urlGal = []
      try {
        axios(url).then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          $("article.d2_3 >  ul").each(function (){
               $(this).find("li > a").each( async function (){
                  let url = $(this).attr("href").split(`https://imas.gamedbs.jp/mlth/chara/show/${req.params.id}/`)[1]
                  if(url === undefined){
                      url = '1386'
                  }
                  const newUrl = `https://localhost:8080/api/v1/mlth/chara/show/gal/${req.params.id}/` +  url || 'error' 
                
           
                  urlGal.push(newUrl);
              
              })
            
          })
         let uniq = [...new Set(urlGal)];
          var iterator = uniq.values();
          const newElements = []
          // Here all the elements of the array is being printed.
          for (let elements of iterator) {
              data = elements.split("https://localhost:8080/api/v1/mlth/chara/show/gal/")[1]
            newElements.push(data)
                }
                newElements.forEach((i,e) =>{
                  let url = charMlthUrl + i
                  try {
                    axios(url).then((response) => {
                      const html = response.data;
                      const $ = cheerio.load(html);
                      $("article.d2_3 > section.imgbox").each(function(index,element){
                        $(this).find("article > a > img").each((function(){
                          const image = $(this).attr("data-original");
          
          
                          const options = {
                            url: image,
                            dest: "F:/Pictures/Live2D/others",
                         
                          };
          
                          download
                          .image(options)
                          .then(({ filename }) => {
                            console.log("Save to", filename);
                          })
                          .catch((err) => console.error(err));
                      
                    
                  
                       }))
                
                      })
                    
                    })
                  } catch (error) {
                      console.log(error)
                  }
                 
                })
                console.log(newElements)
          res.status(200).json({
            url: urlGal
          })
        })
      } catch (error) {
        res.status(500).json(error);
      }
})
// routes get image from specific id of image
app.get('/api/v1/mlth/chara/show/gal/:id/:url', async(req, res) => {
      const url = `${charMlthUrl}/${req.params.id}/${req.params.url}`;
      console.log(url)
      const gallery = []
      
      try {
          axios(url).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("article.d2_3 > section.imgbox").each(function(index,element){
              $(this).find("article > a > img").each((function(){
                const image = $(this).attr("data-original");


                const options = {
                  url: image,
                  dest: "F:/Pictures/Live2D/others",
               
                };

                download
                .image(options)
                .then(({ filename }) => {
                  console.log("Save to", filename);
                })
                .catch((err) => console.error(err));
            
          
                gallery.push(image);
             }))
      
            })
            res.status(200).json({ gallery})
          })
      } catch (error) {
        res.status(500).json(error)
      }


})



app.listen(process.env.PORT || 8080, (req, res) => {
  console.log("Server is running on port 8080");
});
