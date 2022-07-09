const express = require('express');
const multer = require('multer');
const router = express.Router();
const sharp = require('sharp');
const Container = require('../models/Container');
const cloudinary = require('../utils/cloudinary');
const Url = require('../models/listUrl');
const upload = require('../utils/multer');

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter
// });

// const uploadTourImages = upload.fields([
//   // { name: 'imageCover', maxCount: 1 },
//   { name: 'images', maxCount: 1000}
// ]);




router.post('/uploads',upload.array('images')  , async (req, res) =>{
try {

  //    req.body.images = []
  // await Promise.all(
  //   req.files.images.map(async (file, i) => {
  //     const basePath = `${req.protocol}://${req.get("host")}/public/uploads/post/`;
  //     const filename = `${Date.now()}-${i + 1}.jpeg`;
    
  //     await sharp(file.buffer)
  //       .resize(2000, 1333)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 90 })
  //       .toFile(`public/uploads/post/${filename}`) 
  //       const newImage = `${basePath}${filename}`
  //     req.body.images.push(newImage);
  //   })



  // );

    // const newCont = await Container.create({
    //         images :  req.body.images
    // })
    var imageUrlList = [];
    
   cloudinary.uploader.upload('https://pbs.twimg.com/media/FWvw2x2aQAAmEoB?format=jpg&name=large', function(error, result) {console.log(result, error)});
  //   for (var i = 0; i < req.files.length; i++) {
  //       var locaFilePath = req.files[i].path;

  //       // Upload the local image to Cloudinary
  //       // and get image url as response
  //       var result = await  cloudinary.uploader.upload(locaFilePath);
  //       imageUrlList.push(result.url);
  //   }

  // const result1  =   await Url.create({
  //     url : imageUrlList 
  //   })

 res.json({
      message : 'Success',
      // result1 
    });







    // res.status(200).json({newCont})
    } catch (error) {
        res.status(500).json({message : error.message});
    }


})



router.get('/getUpload', async (req, res) => {
    try {
            const images = await Container.find({});
            res.status(200).json({images});
    } catch (error) {
        res.status(500).json({message : error.message});
    }
})


router.get('/getUrlImas/:id', async (req, res) =>{
    try {
        const {id} = req.params
        const foundUrl = await Url.findById({_id : id});
        
        res.status(200).json({
            foundUrl: foundUrl
        })
    } catch (error) {
            res.status(500).json({message : error.message});
    }
})
module.exports = router;