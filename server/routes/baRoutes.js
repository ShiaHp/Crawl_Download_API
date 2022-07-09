const express = require('express')
const router = express.Router();
const {getAllChar,getSingleChar} = require('../controllers/baController')

router.route('/ba/getAll').get(getAllChar)
router.route('/ba/wiki/:character').get(getSingleChar)

module.exports = router;