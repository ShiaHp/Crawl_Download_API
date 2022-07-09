const express = require('express')
const router = express.Router();

const {downloadImg} = require('../controllers/imasController')
router.route('/imas/download').get(downloadImg)


module.exports = router;