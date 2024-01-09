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
        titlePage: 'Product',
        products: newProducts
    })
}

// [GET] /product/:categorySlug
module.exports.category = async (req, res) => {
    // try catch
    const categorySlug = req.params.categorySlug
    const category = await ProductCategory.findOne({ slug: categorySlug })

    const filter = {
        category_id: category.id,
        status: "active",
        deleted: false
    }
    const products = await Product.find(filter)
                                .sort({ position: 'desc' })

    const newProducts = productHelper.newPriceOfProducts(products)

    res.render('client/pages/product/index.pug', {
        titlePage: 'Product',
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
    
        product.newPrice = productHelper.newPriceOfProduct(product)
            
        res.render('client/pages/product/details.pug', {
            titlePage: 'Product',
            product
        })
            
    } catch (error) {
        res.redirect('/product')
    }
}

module.exports.add = (req, res) => {
    res.send('Add product')
}
