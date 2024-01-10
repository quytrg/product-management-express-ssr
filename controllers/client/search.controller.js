const Product = require('../../models/product.model')
const productHelper = require('../../helpers/product')
const searchHelper = require('../../helpers/search.js')

// [GET] /search?keyword=value 
module.exports.index = async (req, res) => {
    try {
        const searchObject = searchHelper(req.query)
        if (searchObject.keyword) {
            const filter = {
                title: searchObject.regex,
                deleted: false,
                status: 'active'
            }
            const products = await Product.find(filter)
            productHelper.newPriceOfProducts(products)
            res.render('client/pages/search/index.pug', {
                titlePage: 'Search',
                sectionTitle: 'Kết quả tìm kiếm',
                products,
                keyword: searchObject.keyword
            })                
        }
        else {
            res.redirect('back')
        }
    }
    catch(err) {
        console.log(err)
        res.redirect("back")
    }    
}
