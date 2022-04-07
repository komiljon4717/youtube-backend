const controller = require('../controllers/index.js')
const router = require('express').Router()

router.get('/', controller.GET)
router.post('/', controller.POST)

module.exports = router