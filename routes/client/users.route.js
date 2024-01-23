const express = require('express')
const router = express.Router()

const usersController = require('../../controllers/client/users.controller.js')

router.get('/not-friend', usersController.notFriend)

router.get('/request', usersController.request)

router.get('/accept', usersController.accept)

router.get('/friends', usersController.friends)

module.exports = router
