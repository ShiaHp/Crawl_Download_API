const express = require('express')
const router = express.Router();
const {getUrl} = require('../controllers/elaController')

router.route('/ela').post(getUrl)



module.exports = router;