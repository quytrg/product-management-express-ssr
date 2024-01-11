const Product = require('../../models/product.model.js')
const ProductCategory = require('../../models/product-category.model.js')
const productHelper = require('../../helpers/product.js')

// [GET] /product
module.exports.index = async (req, res) => {

    const filter = {
        status: "active",
        deleted: false
    }
    const products = await Product.find(filter)
                                .sort({ position: 'desc' })

    const newProducts = productHelper.newPriceOfProducts(products)

    res.render('client/pages/product/index.pug', {
        titlePage: 'Products',
        sectionTitle: 'Danh sách sản phẩm',
        products: newProducts
    })
}

// [GET] /product/:categorySlug
module.exports.category = async (req, res) => {
    // try catch
    const categorySlug = req.params.categorySlug
    const category = await ProductCategory.findOne({ slug: categorySlug })

    const getAllSubCategoryId = async (parent_id) => {
        const subCategoryId = await ProductCategory.find({
            parent_id: parent_id,
            deleted: false,
            status: 'active'
        }).select('_id')

        const allSub = subCategoryId.map(item => item.id)
        
        for (const sub of allSub) {
            const childs = await getAllSubCategoryId(sub)
            allSub.push(...childs)
        }

        return allSub
    }

    const allSubCategoryId = await getAllSubCategoryId(category.id)

    const filter = {
        category_id: { $in: [ category.id,  ...allSubCategoryId ] },
        status: "active",
        deleted: false
    }
    const products = await Product.find(filter)
                                .sort({ position: 'desc' })

    const newProducts = productHelper.newPriceOfProducts(products)

    res.render('client/pages/product/index.pug', {
        titlePage: 'Products',
        sectionTitle: category.title,
        products: newProducts
    })
}

// [GET] /product/details/:slug
module.exports.details = async (req, res) => {
    try {
        const filter = {
            slug: req.params.slug,
            status: "active",
            deleted: false
        }
        const product = await Product.findOne(filter)

        const category = await ProductCategory.findOne({
            _id: product.category_id
        })
        product.category = category
    
        product.newPrice = productHelper.newPriceOfProduct(product)
            
        res.render('client/pages/product/details.pug', {
            titlePage: 'Products',
            product
        })
            
    } catch (error) {
        console.log(error)
        res.redirect('/product')
    }
}

module.exports.add = (req, res) => {
    res.send('Add product')
}
