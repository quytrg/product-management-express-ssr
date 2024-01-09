const Product = require('../../models/product.model')
const productHelper = require('../../helpers/product')

module.exports.index = async (req, res) => {
    const featuredProducts = await Product.find({
        deleted: false,
        status: 'active',
        featured: '1'
    }).limit(8).sort({ position: 'desc' })
    productHelper.newPriceOfProducts(featuredProducts)

    const newProducts = await Product.find({
        deleted: false,
        status: 'active',
    }).limit(8).sort({ position: 'desc' })
    productHelper.newPriceOfProducts(newProducts)

    res.render('client/pages/home/index.pug', {
        titlePage: 'Trang chu',
        featuredProducts,
        newProducts
    })
}
