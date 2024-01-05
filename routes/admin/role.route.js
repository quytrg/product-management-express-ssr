const express = require('express')
const router = express.Router()

const roleController = require('../../controllers/admin/role.controller.js')

const validateRole = require('../../validates/admin/role.validate.js')

// permissions
const permissions = require('../../middlewares/admin/permissions.midleware.js')

router.get('/create', roleController.create)

router.post(
    '/create',
    permissions.createRole,
    validateRole.createPost,
    roleController.createPost
)

router.get('/edit/:id', roleController.edit)

router.patch(
    '/edit/:id',
    permissions.editRole,
    roleController.editPatch
)

router.get('/permissions', roleController.permissions)

router.patch(
    '/permissions',
    permissions.permissionsRole, 
    roleController.permissionsPatch
)

router.get('/', roleController.index)

module.exports = router
