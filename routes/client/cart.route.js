const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/client/cart.controller.js')

router.post('/add/:id', cartController.addPost)

router.get('/delete/:id', cartController.delete)

router.get('/', cartController.index)


module.exports = router
