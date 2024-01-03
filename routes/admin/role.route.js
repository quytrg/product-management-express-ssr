const express = require('express')
const router = express.Router()

const roleController = require('../../controllers/admin/role.controller.js')

const validateRole = require('../../validates/admin/role.validate.js')

router.get('/create', roleController.create)

router.post(
    '/create',
    validateRole.createPost,
    roleController.createPost
)

router.get('/edit/:id', roleController.edit)

router.patch('/edit/:id', roleController.editPatch)

router.get('/permissions', roleController.permissions)

router.patch('/permissions', roleController.permissionsPatch)

router.get('/', roleController.index)

module.exports = router
