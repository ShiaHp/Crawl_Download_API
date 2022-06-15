const axios = require("axios");
const cheerio = require("cheerio");
const download = require("image-downloader");

const shinyUrl = "https://imassc.gamedbs.jp/chara/show/";
const charUrl = "https://imassc.gamedbs.jp/chara/show/1/";


const downloadImg = async (req, res) => {

  let firstChar = 1;

  let endChar = 25;

  const urlContainer = [];
    for ( firstChar ; firstChar <= endChar ; firstChar ++){
        let url = shinyUrl + firstChar;
        await axios(url).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("div.uk-grid-match", html).each(function (i, e) {
              $(this)
                .find("a")
                .each(function () {
                  const url = $(this).attr("href");
                  axios(url).then((response) => {
                      const html = response.data;
                      const $ = cheerio.load(html);
                      $(" .uk-grid-match ").each(function () {
                        $(this)
                          .find("a")
                          .each(function () {
                          
                            const url = $(this).attr("href");
                             const newUrl = url.split("https://imassc.gamedbs.jp/image/card")[1]
                             if(newUrl !== undefined){
                               const  image = url
                               const options = {
                                url: image,
                                dest: "/Pictures/live2D/shiny",
                              };
                              download
                                .image(options)
                                .then(({ filename }) => {
                                  console.log("Save to", filename);
                                })
                                .catch((err) => console.error(err));
                             }
                             
                           
                          });
                      });
                    });
                  urlContainer.push(url);
                });
            });
      
         
          });
    }  
    

    res.status(200).json({ urlContainer });
};

const downChar = async (req, res) => {
  const url = charUrl + req.params.id;


  try {
    axios(url).then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $(" .uk-grid-match ").each(function () {
        $(this)
          .find("a")
          .each(function () {
          
            const url = $(this).attr("href");
             const newUrl = url.split("https://imassc.gamedbs.jp/image/card")[1]
             if(newUrl !== undefined){
               const  image = url
               const options = {
                url: image,
                dest: "/Pictures/live2D/shiny",
              };
              download
                .image(options)
                .then(({ filename }) => {
                  console.log("Save to", filename);
                })
                .catch((err) => console.error(err));
             }
             
           
          });
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = { downloadImg, downChar };
