const axios = require("axios");
const cheerio = require("cheerio");
const download = require("image-downloader");
const request = require("request");

const sharp = require("sharp");

const sekaiUrl = "https://pjsekai.gamedbs.jp/chara/show/";
const charUrl = "hhttps://pjsekai.gamedbs.jp/chara/show/1";

const downloadImg = async (req, res) => {
  let firstChar = 1;

  let endChar = 25;
  const urlContainer = [];
  const charUrlContainer = [];
  let urlBack = [];


  for (firstChar; firstChar <= endChar; firstChar++) {
    let url = sekaiUrl + firstChar;
    urlContainer.push(url);
  }
  const response = urlContainer.map((url) => {
    return axios(url);
  })
  const result = await Promise.all(response);
  result.map((res) => {
    const html = res.data;
    const $ = cheerio.load(html);
    $("div.uk-grid-match", html).each(function (i, e) {
      $(this)
        .find("a")
        .each(async function () {
          const url = $(this).attr("href");
          charUrlContainer.push(url);
        });
    });
  });

  const response2 = charUrlContainer.map((url) => {
    return axios(url);
  })
 
  const result2 = await Promise.all(response2)
  
  result2.map((response)=>{
      
    const html = response.data;
    const $ = cheerio.load(html);
    $(".uk-grid-match").each(function () {
      $(this)
        .find("a")
        .each(function () {
          const url = $(this).attr("href");
       
          if(url.split(
            "https://pjsekai.gamedbs.jp/image/chara/"
          )[1] !== undefined && url.split("https://pjsekai.gamedbs.jp/image/chara/member/")[1]){
            const image = url;
            urlBack.push(image);
            const output = Date.now() + "result.png";
            request({ url, encoding: null }, function (error, response, body) {
               sharp(body)
                 .toFile(`/Pictures/live2D/shiny/${output}`)
                 .then(() => {}).catch((err) => console.error(err))
             }
           );
          }  
     
         
           
       
        });
    });
  })

        
      
    
  
 
 


  res.status(200).json({
    message: "Success",
    urlBack  : urlBack
  });
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
            const newUrl = url.split("https://imassc.gamedbs.jp/image/card")[1];
            if (newUrl !== undefined) {
              const image = url;
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
