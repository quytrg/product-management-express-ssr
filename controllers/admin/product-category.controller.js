const ProductCategory = require('../../models/product-category.model.js')

const systemConfig = require('../../config/system/index')

const treeHelper = require('../../helpers/tree.js')

// [GET] /admin/product-category
module.exports.index = async (req, res) => {

    const filter = {
        deleted: false
    }

    const categories = await ProductCategory.find(filter)
    const categoryTree = treeHelper.create(Array.from(categories))

    res.render(`${systemConfig.prefixAdmin}/pages/product-category/index.pug`, {
        titlePage: 'Product Category',
        categoryTree
    })
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {

    const filter = {
        deleted: false
    }

    const categories = await ProductCategory.find(filter)
    const categoryTree = treeHelper.create(Array.from(categories))

    res.render(`${systemConfig.prefixAdmin}/pages/product-category/create.pug`, {
        titlePage: 'Create Category',
        categoryTree
    })
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {

    if (req.body.position !== '') { 
        req.body.position = parseInt(req.body.position)
    } 
    else {
        req.body.position = await ProductCategory.count() + 1
    }
    
    const doc = await ProductCategory.create(req.body)
    await doc.save()

    res.redirect(`/${systemConfig.prefixAdmin}/product-category`)
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
    
    try {
        const category = await ProductCategory.findById({ _id: req.params.id })

        const filter = {
            deleted: false
        }
    
        const categories = await ProductCategory.find(filter)
        const categoryTree = treeHelper.create(Array.from(categories))

        res.render(`${systemConfig.prefixAdmin}/pages/product-category/edit.pug`, {
            titlePage: 'Edit Category',
            category,
            categoryTree
        })
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/product-category`)
    }
    
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {

    if (req.body.position !== '') { 
        req.body.position = parseInt(req.body.position)
    } 
    else {
        req.body.position = await ProductCategory.count() + 1
    }
    
    await ProductCategory.findOneAndUpdate({ _id: req.params.id }, req.body)

    req.flash('changeSuccess', 'Đã cập nhật thông tin danh mục thành công!')

    res.redirect(`back`)
}
