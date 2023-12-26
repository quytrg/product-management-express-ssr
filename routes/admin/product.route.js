const express = require('express')
const router = express.Router()

// multer storage
const multer  = require('multer')
const storage = require('../../helpers/multerStorage')
const upload = multer({ storage: storage })

const productController = require('../../controllers/admin/product.controller.js')

// validate

const validateProduct = require('../../validates/admin/product.validate.js')

router.patch('/change-status/:status/:id', productController.changeStatus)

router.patch('/change-multi', productController.changeMulti)

router.delete('/delete/:id', productController.deleteItem)

router.get('/create', productController.create)

router.post(
    '/create', 
    upload.single('thumbnail'), 
    validateProduct.createPost,
    productController.createPost,
)

router.get('/edit/:id', productController.edit)

router.patch(
    '/edit/:id',
    upload.single('thumbnail'), 
    validateProduct.createPost,
    productController.editPatch
)

router.get('/details/:id', productController.details)

router.get('/', productController.index)

module.exports = router