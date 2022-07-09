const axios = require("axios");
const cheerio = require("cheerio");
const download = require("image-downloader");
const Url = require("../models/listUrl");
const cloudinary = require("../utils/cloudinary");
const imasUrl = "https://starlight.kirara.ca/char/";

const downloadImg = async (req, res, next) => {
  try {
    let firstChar = 101;
    // 314
    let endChar = 314;
    const urlContainer = [];
    const image = [];
    let imageUrlList = [];
    for (firstChar; firstChar <= endChar; firstChar++) {
      let url = imasUrl + firstChar;
      if (
        url == "https://starlight.kirara.ca/char/143" ||
        url == "https://starlight.kirara.ca/char/142" ||
        url == "https://starlight.kirara.ca/char/144" ||
        url == "https://starlight.kirara.ca/char/206" ||
        url == "https://starlight.kirara.ca/char/146" ||
        url == "https://starlight.kirara.ca/char/209" ||
        url == "https://starlight.kirara.ca/char/207" ||
        url == "https://starlight.kirara.ca/char/208" ||
        url == "https://starlight.kirara.ca/char/248" ||
        url == "https://starlight.kirara.ca/char/252" ||
        url == "https://starlight.kirara.ca/char/277" ||
        url == "https://starlight.kirara.ca/char/279" ||
        url == "https://starlight.kirara.ca/char/282" ||
        url == "https://starlight.kirara.ca/char/281" ||
        url == "https://starlight.kirara.ca/char/303" ||
        url == "https://starlight.kirara.ca/char/311" ||
        url == "https://starlight.kirara.ca/char/278" ||
        url == "https://starlight.kirara.ca/char/301" ||
        url == "https://starlight.kirara.ca/char/276" ||
        url == "https://starlight.kirara.ca/char/302" ||
        url == "https://starlight.kirara.ca/char/299"
        ||
        url == "https://starlight.kirara.ca/char/312"
      ) {
        console.log("do nothing");
      } else {
        urlContainer.push(url);
      }
    }
    const response = urlContainer.map((url) => {
      return axios(url);
    });
    const result = await Promise.all(response);
    result.map((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $(".carcon", html).each(async function () {
        const data = $(this).find("div > div > a").attr("href");
        if (data !== "javascript:void(0);") {
          image.push(data);
          console.log(data);
        }
      });
    });

    for (let i = 0; i < image.length; i++) {
      const img = image[i];

      const result = await cloudinary.uploader.upload(img, { folder: "imas1" });
      imageUrlList.push(result.url);
    }
    const result1 = await Url.create({
      url: imageUrlList,
    });

    res.status(200).json({
      message: "Success",
      result1,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { downloadImg };
