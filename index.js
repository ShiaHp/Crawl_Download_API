const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const fs = require("fs");
const client = require("https");
const res = require("express/lib/response");
const download = require('image-downloader');



const url = "https://bluearchive.fandom.com/wiki/Blue_Archive/Student_Profile";
const charUrl = "https://bluearchive.fandom.com/wiki/";

const imasUrl = 'https://starlight.kirara.ca/char/';

const shinyUrl = 'https://imassc.gamedbs.jp/chara/show/1/'

// set up
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static('public/images'));
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
  const characters = []
  const quotes = []
    const charBio = {}
    const live2D = []
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
              const data = $(this).text().trim()
              const result = data.replace(/^\s+|\s+$/gm,'')
              details.push(result);
             
          });
          const newDetails = details.slice(1)
          if(image !== undefined) {
            for ( let i = 0; i < newDetails.length; i++){
                charBio[profile[i]] =newDetails[i];  
          }
          characters.push({
            image,
            ...charBio
        })
        }
          
        //   get quotes
        $('.quote ',html).each(function(){
            const quote = $(this).find("td").text()
            const result = quote.replace(/^\s+|\s+$/gm,'')
            quotes.push(result)
        })
     
      });
      $("table",html).each(function (index, element){
        const tds = $(element).find("td");
          const data = $(tds[3]).find('img').attr('data-src')
          live2D.push(data)
      })
 
    const  uniq = [...new Set(quotes)];
    const  uniq1 = [...new Set(live2D)];

    const live = uniq1.filter(element => {
        return element !== undefined;
      });


      

     





      res.status(200).json({
          message : 'Success',
            quote : uniq ,
            live2D : live,
            character  : characters
      })
    });

  } catch (error) {
    res.status(500).json(error);
  }
});

  // function downloadImage(url,filepath) {
  //     client.get(url,(response) => {
  //       res.pipe(fs.createWriteStream(filepath));

  //     })

  app.get("/imas/download", async (req, res) => {
      // let url = imasUrl + req.params.id;
      let id_start_chars = 101
      let id_of_character = 314;
      for( id_start_chars ; id_start_chars < id_of_character ;id_start_chars++){
        let url =imasUrl + id_start_chars
        
        const image = [] ;
  
        await axios(url).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
    
            $(".carcon",html).each(function () {
              const data =  $(this).find("div > div > a").attr('href')
                image.push(data)
                const options = {
                  url : data,
                  dest : 'F:/Pictures/Live2D/others', 
                  // Create a folder as following
          
                }
                download.image(options).then(({filename}) => {
                  console.log('Save to' , filename)
                }).catch((err) => console.error(err));
            })
          
      
      
          }).catch((err) => console.error(err))

      }

      res.status(200).json({
        message: 'Success. All images download to your folder',
    
})
   
   
   
     

  })

  // STILL ERROR
  app.get("/shiny/1/:id", async (req, res) => {
    let url = shinyUrl + req.params.id;
    const image = [] ;
    try {
       await axios(url).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

    //  $(" .uk-width-1-2@m uk-first-column a",html).each(function(){
    //     const data = $(this).find("img").attr("src");
    //     console.log(data)
    // })
    // download icon png
    
          $("div.uk-width-1-4 > div.uk-card ",html).each(function(){
            const img =    $(this).find("a > img").attr("data-src");
        
          })
          // Download image from website 
          $("div.uk-grid-match",html).each(function(i,e){
            const img=  $(this).find("a > img").attr("data-src");
            console.log(img)
            image.push(img)
          })
        $(" body > div.uk-offcanvas-content > main > div.uk-container.uk-container-center.uk-margin-top.uk-margin-large-bottom > div > div.uk-width-2-3\\@m.uk-first-column > div.uk-grid-match.uk-grid-small.uk-text-center.uk-grid.uk-grid-stack > div.uk-grid-margin.uk-first-column > div",html).each(function(){
          const img=  $(this).find("a > img").attr("data-src");
            console.log(img)
          })
   
       
            // const options = {
            //   url : data,
            //   dest : '/Pictures/live2D',
      
            // }
            // download.image(options).then(({filename}) => {
            //   console.log('Save to' , filename)
            // }).catch((err) => console.error(err));
       
   

      })
      res.status(200).json({image})
    } catch (error) {
      res.status(500).json(error);
    }

})


app.listen(process.env.PORT || 8080, (req, res) => {
  console.log("Server is running on port 8080");
});
