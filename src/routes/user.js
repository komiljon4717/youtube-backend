const checkToken = require('../middlewares/checkToken.js')
const controller = require('../controllers/user.js')
const router = require('express').Router()

router.get('/users', checkToken, controller.GET)

module.exports = router