const express = require('express')
const router = express.Router()

const checkoutController = require('../../controllers/client/checkout.controller.js')

router.get('/', checkoutController.index)

router.post('/order', checkoutController.orderPost)

router.get('/success/:id', checkoutController.success)

module.exports = router
