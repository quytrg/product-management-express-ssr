const express = require('express')
const router = express.Router()

const chatController = require('../../controllers/client/chat.controller.js')

const chatMiddleWare = require('../../middlewares/client/chat.middleware.js')

router.get('/:chatRoomId', chatMiddleWare.isAllowedAccess, chatController.index)

module.exports = router
