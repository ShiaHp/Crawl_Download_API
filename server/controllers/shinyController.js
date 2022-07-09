const axios = require("axios");
const cheerio = require("cheerio");
const download = require("image-downloader");

const shinyUrl = "https://imassc.gamedbs.jp/chara/show/";
const charUrl = "https://imassc.gamedbs.jp/chara/show/1/";
const homepage = "https://imassc.gamedbs.jp/";

const downloadImg = async (req, res) => {
  let firstChar = 1;
  let endChar = 25;
  const urlContainer = [];
  const charUrlContainer = [];
  const nameContainer = [];
  let urlBack = [];
  let imgOfCharCont = {};

  for (firstChar; firstChar <= endChar; firstChar++) {
    let url = shinyUrl + firstChar;
    urlContainer.push(url);

  }

  const nameCont = async (req, res) => {
    await axios(homepage)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $("div.uk-grid-match ", html).each(function () {
          $(this)
            .find("a > img")
            .each(function () {
              const name = $(this).attr("alt").split("詳")[0];
              nameContainer.push(name);
            });
        });
      })
      .catch((err) => console.error(err));
  };

  nameCont();

  const response = urlContainer.map((url, i) => {
    return axios(url);
  });

  const result = await Promise.all(response);
  result.map((res, i) => {
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
  });

  const result2 = await Promise.all(response2);

  result2.map((response,index) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $(" .uk-grid-match ").each(function () {
      $(this)
        .find("a")
        .each(function () {
          const url = $(this).attr("href");

          if (
            url.split("https://imassc.gamedbs.jp/image/card")[1] !== undefined
          ) {

            const image = url       
            urlBack.push(image);
            // const options = {
            //   url: image,
            //   dest: "/Pictures/live2D/shiny",
            // };
            // download
            //   .image(options)
            //   .then(({ filename }) => {
            //     console.log("Save to", filename);
            //   })
            //   .catch((err) => console.error(err));
          
            
          }
        });
    });
  });



  res.status(200).json({ urlBack });
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
