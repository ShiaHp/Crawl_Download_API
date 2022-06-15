const express = require('express')
const router = express.Router();

const {downloadImg,getInfoChar } = require('../controllers/mlthController')
router.route('/mlth/info').get(getInfoChar);
router.route('/mlth/downloadChar/:id').get(downloadImg);



module.exports = router;