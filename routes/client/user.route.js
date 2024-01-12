const express = require('express')
const router = express.Router()

const userController = require('../../controllers/client/user.controller.js')

// validates
const userValidate = require('../../validates/client/user.validate.js')

router.get('/register', userController.register)

router.post('/register', userValidate.registerPost ,userController.registerPost)

router.get('/login', userController.login)

router.post('/login', userValidate.loginPost, userController.loginPost)

router.get('/logout', userController.logout)

module.exports = router
