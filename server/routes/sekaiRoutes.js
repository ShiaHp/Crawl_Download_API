const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const {downloadImg} = require('../controllers/sekaiController')

router.route('/sekai/downloadAll').get(downloadImg);



module.exports = router;