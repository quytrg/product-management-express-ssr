const Product = require('../../models/product.model.js')
const ProductCategory = require('../../models/product-category.model.js')
const Account = require('../../models/account.model.js')

const systemConfig = require('../../config/system/index')
const filterStatusHelper = require('../../helpers/filterStatus.js')
const searchHelper = require('../../helpers/search.js')
const paginationHelper = require('../../helpers/pagination.js')
const bodyParser = require('body-parser')

const treeHelper = require('../../helpers/tree.js')

// [GET] /admin/product
module.exports.index = async (req, res) => {
    
    const find = {
        deleted: false
    }

    // filter status
    const filterStatus = filterStatusHelper(req.query)
    if (req.query.status) {
        find.status = req.query.status
    }

    // search
    const searchObject = searchHelper(req.query)
    if (req.query.keyword) {
       find.title = searchObject.regex
    }

    // pagination
    let initPagination = {
        currentPage: 1,
        limit: 4
    }
    initPagination.totalProduct = await Product.count(find)
    const paginationObject = paginationHelper(req.query, initPagination)

    //sort
    const sortMethod = {}

    if (req.query.sortKey && req.query.sortValue) {
        sortMethod[req.query.sortKey] = req.query.sortValue
    }
    else {
        sortMethod.position = 'desc'
    }

    const products = await Product.find(find)
                                .sort(sortMethod)
                                .limit(paginationObject.limit)
                                .skip(paginationObject.skip)

    // creating info
    for (const product of products) {
        const accountCreated = await Account.findOne({ _id: product.createdBy.account_id })
        
        if (accountCreated) {
            product.createdBy.accountName = accountCreated.fullName
        }

        const accountIdUpdated = product.updatedBy[product.updatedBy.length - 1]
        if (accountIdUpdated) {
            const accountUpdated = await Account.findOne({ _id: accountIdUpdated.account_id })
            if (accountUpdated) {
                product.updatedBy[product.updatedBy.length - 1].accountName = accountUpdated.fullName
            }
        }
    }

    res.render(`${systemConfig.prefixAdmin}/pages/product/index.pug`, {
        titlePage: 'Product',
        products,
        filterStatus,
        keyword: searchObject.keyword,
        paginationObject
    })
}

// [PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    const { status, id } = req.params

    await Product.updateOne(
        { _id: id }, 
        { 
            status: status,
            $push: { updatedBy: updatedBy }
        }
    )

    req.flash('changeSuccess', 'Trang thái đã được thay đổi thành công!')

    res.redirect('back')
}

// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    
    const { type, ids } = req.body
    const idsChange = ids.split(', ')

    switch (type) {
        case 'active':
        case 'inactive':
            await Product.updateMany({ _id: {$in: idsChange} }, { status: type, $push: { updatedBy: updatedBy } })
            req.flash('changeSuccess', `Đã thay đổi trang thái ${idsChange.length} sản phẩm thành công`)
            break 
        case 'delete-all':
            await Product.updateMany({ _id: {$in: idsChange} }, {
                deleted: true,
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            })
            req.flash('changeSuccess', `Đã xoá ${idsChange.length} sản phẩm thành công`)
            break
        case 'change-position':
            for(const item of idsChange) {
                const [ id, position ] = item.split('-')
                await Product.updateOne({ _id: id }, { position: position, $push: { updatedBy: updatedBy } })
            }
            req.flash('changeSuccess', `Đã thay đổi vị trí của ${idsChange.length} sản phẩm thành công`)
            break
        default:
            break
    }

    

    res.redirect('back')
}

// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
    
    const id = req.params.id

    await Product.updateOne({ _id: id }, { 
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    })

    req.flash('changeSuccess', 'Sản phẩm đã được xoá thành công!')

    res.redirect('back')
}

// [GET] /admin/product/create
module.exports.create = async (req, res) => {
    const filter = {
        deleted: false
    }

    const categories = await ProductCategory.find(filter)
    const categoryTree = treeHelper.create(Array.from(categories))

    res.render(`${systemConfig.prefixAdmin}/pages/product/create.pug`, {
        titlePage: 'Create Product',
        categoryTree
    })
}

// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseFloat(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if (req.body.position !== '') { 
        req.body.position = parseInt(req.body.position)
    } 
    else {
        req.body.position = await Product.count() + 1
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    
    const doc = await Product.create(req.body)
    await doc.save()

    res.redirect(`/${systemConfig.prefixAdmin}/product`)
}

// [GET] /admin/product/edit/:id

module.exports.edit = async (req, res) => {

    try {
        const product = await Product.findById({ _id: req.params.id })

        const filter = {
            deleted: false
        }
    
        const categories = await ProductCategory.find(filter)
        const categoryTree = treeHelper.create(Array.from(categories))

        res.render(`${systemConfig.prefixAdmin}/pages/product/edit.pug`, {
            titlePage: 'Edit Product',
            product,
            categoryTree
        })
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/product`)
    }
    
}

// [PATCH] /admin/product/edit/:id

module.exports.editPatch = async (req, res) => {

    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseFloat(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)

    if (req.body.position !== '') { 
        req.body.position = parseInt(req.body.position)
    } 
    else {
        req.body.position = await Product.count() + 1
    }

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }
    
    await Product.findOneAndUpdate(
        { _id: req.params.id }, 
        {
            ...req.body,
            $push: { updatedBy: updatedBy }
        }
    )

    req.flash('changeSuccess', 'Đã cập nhật thông tin sản phẩm thành công!')

    res.redirect(`back`)
}

// [GET] /admin/product/details/:id

module.exports.details = async (req, res) => {

    try {
        const product = await Product.findById({ _id: req.params.id })

        res.render(`${systemConfig.prefixAdmin}/pages/product/details.pug`, {
            titlePage: 'Product Deltails',
            product
        })
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/product`)
    }
}
