const express = require('express')
const router = express.Router()

const userController = require('../../controllers/client/user.controller.js')

// validates
const userValidate = require('../../validates/client/user.validate.js')

// middlewares
const authMiddleware = require('../../middlewares/client/auth.middleware.js')

router.get('/register', userController.register)

router.post('/register', userValidate.registerPost ,userController.registerPost)

router.get('/login', userController.login)

router.post('/login', userValidate.loginPost, userController.loginPost)

router.get('/logout', userController.logout)

router.get('/password/forgot', userController.forgotPassword)

router.post('/password/forgot', userValidate.forgotPasswordPost, userController.forgotPasswordPost)

router.get('/password/otp', userController.otp)

router.post('/password/otp', userValidate.otpPost, userController.otpPost)

router.get('/password/reset', userController.resetPassword)

router.post('/password/reset', userValidate.resetPasswordPost, userController.resetPasswordPost)

router.get('/info', authMiddleware.requireAuth, userController.info)

module.exports = router
