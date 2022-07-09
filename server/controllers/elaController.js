const axios = require("axios");
const cheerio = require("cheerio");
const Url = require("../models/listUrl");
const cloudinary = require("../utils/cloudinary");

// const elaUrl = "https://e-hentai.org/g/688123/82735fb9bf";

const getUrl = async (req, res) => {
  const { urlMain } = req.body;
  console.log(urlMain)
  const urlContainer = [];
  const filterContainer = [];
  const urlContainer1 = [];
  const charUrlContainer = [];
  const image = [];
  let imageUrlList = [];
  const catchError = [];
  const finalUrlContainer = [];

  try {
    await axios(urlMain)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $("table tbody tr td ", html).each(function () {
          const list = $(this).find("a").attr("href");
          if (
            list !== undefined &&
            list.split(`${urlMain}/?p=`)[1] !== undefined
          ) {
            urlContainer.push(list);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });

    urlContainer.map((item) => {
      const data = item.split(`${urlMain}/?p=`)[1];
      filterContainer.push(data);
    });

    const arrOfNum = filterContainer.map((str) => {
      return Number(str);
    });

    // if you want to download all image, just replace biggest[0], but it's will be error and probably banned ehe
    // const biggest = arrOfNum.sort((a, b) => b - a);

    for (let i = 0; i <= 1; i++) {
      let url = `${urlMain}/?p=` + i;
      urlContainer1.push(url);
    }
    const response = urlContainer1.map((url, i) => {
      return axios(url);
    });

    const result = await Promise.all(response);

    result.map((res, i) => {
      const html = res.data;
      const $ = cheerio.load(html);
      $("div#gdt > div.gdtm ", html).each(function (i, e) {
        $(this)
          .find("a")
          .each(async function () {
            const url = $(this).attr("href");

            charUrlContainer.push(url);
          });
      });
    });

    const response1 = charUrlContainer.map((url) => {
      return axios(url);
    });
    const result1 = await Promise.all(response1);

    const data = result1.map((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $(" div#i3 ").each(async function () {
        const url = $(this).find("a img").attr("src");
        image.push(url);
      });
    });

    image.forEach(async (item) => {
      const result = await cloudinary.uploader
        .upload(item, {
          folder: "ela",
        })
        .catch((err) => catchError.push(err));

      imageUrlList.push(result.url);
    });

    setTimeout(async () => {
      const result2 = await Url.create({
        url: imageUrlList,
      });
      res.status(200).json({
        message: "Success",
        result2,
      });
    }, 5000);

  
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getUrl };
