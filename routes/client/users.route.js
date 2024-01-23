const express = require('express')
const router = express.Router()

const usersController = require('../../controllers/client/users.controller.js')

router.get('/not-friend', usersController.notFriend)

module.exports = router
