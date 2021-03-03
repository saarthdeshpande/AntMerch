const router = require('express').Router()
const { createUser, userLogin, userLogout } = require('../controllers/user')

router.post('/create', createUser)
router.post('/login', userLogin)
router.post('/logout', userLogout)

module.exports = router