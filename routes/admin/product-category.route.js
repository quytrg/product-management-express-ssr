const express = require('express')
const router = express.Router()

// multer storage
const multer = require('multer')
const upload = multer()

// cloud storage
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js')

// permissions
const permissions = require('../../middlewares/admin/permissions.midleware.js')

const productCategoryController = require('../../controllers/admin/product-category.controller.js')

router.get('/create', productCategoryController.create)

router.post(
    '/create', 
    permissions.createProductsCategory,
    upload.single('thumbnail'),
    uploadCloud.upload,
    productCategoryController.createPost
)

router.get('/edit/:id', productCategoryController.edit)

router.patch(
    '/edit/:id',
    permissions.editProductsCategory,
    upload.single('thumbnail'),
    uploadCloud.upload,
    productCategoryController.editPatch
)

router.get('/', productCategoryController.index)

module.exports = router
