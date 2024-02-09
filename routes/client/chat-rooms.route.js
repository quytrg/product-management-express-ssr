const express = require('express')
const router = express.Router()

const chatRoomsController = require('../../controllers/client/chat-rooms.controller.js')

router.get('/', chatRoomsController.index)

router.get('/create', chatRoomsController.create)

router.post('/create', chatRoomsController.createPost)

module.exports = router
