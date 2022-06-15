const express = require('express')
const router = express.Router();
const {downloadImg,downChar} = require('../controllers/shinyController')

router.route('/shiny/downloadChar/:id').get(downloadImg)
router.route('/shiny/downloadChar/single/:id').get(downChar)

module.exports = router;