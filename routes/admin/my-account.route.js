const express = require('express')
const router = express.Router()

// multer storage
const multer = require('multer')
const upload = multer()

// cloud storage
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js')

const myAccountController = require('../../controllers/admin/my-account.controller.js')

router.get('/', myAccountController.index)

router.get('/edit', myAccountController.edit)

router.patch(
    '/edit',
    upload.single('avatar'),
    uploadCloud.upload,
    myAccountController.editPatch
)

// router.get('/permissions', roleController.permissions)

// router.patch(
//     '/permissions',
//     permissions.permissionsRole, 
//     roleController.permissionsPatch
// )

// router.get('/', roleController.index)

module.exports = router
