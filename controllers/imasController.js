const axios = require("axios");
const cheerio = require("cheerio");
const download = require("image-downloader");
const imasUrl = "https://starlight.kirara.ca/char/";

const downloadImg = async (req, res) =>{

    let id_start_chars = 101;
    let id_of_character = 314;
    const image = [];
    
    for (id_start_chars; id_start_chars <= id_of_character; id_start_chars++) {
      let url = imasUrl + id_start_chars;
      await axios(url)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          $(".carcon", html).each(function () {
            const data = $(this).find("div > div > a").attr("href");
              if(data !==  'javascript:void(0);'){
              image.push(data)
            }
          
            const options = {
              url: data,
              dest: "F:/Pictures/Live2D/imas",
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
      image  : image 
    });
}



module.exports = {downloadImg}