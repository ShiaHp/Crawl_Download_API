const axios = require("axios");
const cheerio = require("cheerio");
const download = require("image-downloader");

const  mlthUrl = "https://imas.gamedbs.jp/mlth/"
const charMlthUrl  = "https://imas.gamedbs.jp/mlth/chara/show/"


const getInfoChar = async (req, res) =>{
    const characters = [];
    try {
        await axios(mlthUrl).then((response) => {
            const html = response.data;
            const $ = cheerio.load(html)

            $("ul li",html).each( async function (){
              let nameChar = ""
              const name = $(this).find("a").attr("title");
           
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
}



const downloadImg = async (req, res) =>{
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
                          dest: "F:/Pictures/Live2D/mlth",
                       
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
}



module.exports = {downloadImg,getInfoChar }