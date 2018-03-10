const express = require('express')
const router = express.Router()

router.post('/', require('./getUserInfo'))

module.exports = router