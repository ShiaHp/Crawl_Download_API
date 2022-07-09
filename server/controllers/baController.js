
const axios = require("axios");
const cheerio = require("cheerio");



const url = "https://bluearchive.fandom.com/wiki/Blue_Archive/Student_Profile";
const charUrl = "https://bluearchive.fandom.com/wiki/";

const getAllChar = async (req, res) =>{
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
            url: "https://localhost:8080/api/v1/ba" + url,
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
  }

  const getSingleChar  = async (req, res) =>{
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
  }



    

module.exports = {getAllChar, getSingleChar}






