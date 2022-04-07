const checkToken = require('../middlewares/checkToken.js')
const controller = require('../controllers/admin.js')
const router = require('express').Router()

router.get('/admin', checkToken, controller.GET)
router.post('/admin', checkToken, controller.POST)
router.put('/admin', checkToken, controller.PUT)
router.delete('/admin', checkToken, controller.DELETE)

module.exports = router