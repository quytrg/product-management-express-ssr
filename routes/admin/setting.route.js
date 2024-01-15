const express = require('express')
const router = express.Router()

// multer storage
const multer = require('multer')
const upload = multer()

// cloud storage
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js')

const settingController = require('../../controllers/admin/setting.controller.js')

router.get('/general', settingController.generalSettings)

router.patch(
    '/general', 
    upload.single('logo'),
    uploadCloud.upload,
    settingController.generalSettingsPatch
)

module.exports = router
