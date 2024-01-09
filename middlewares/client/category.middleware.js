const ProductCategory = require('../../models/product-category.model')

const tree = require('../../helpers/tree')

module.exports.category = async (req, res, next) => {
    try {
        const categories = await ProductCategory.find({
            deleted: false
        })

        const categoryTree = tree.create(categories)
            
        res.locals.categoryTree = categoryTree

        next()
    }
    catch (err) {
        console.log("ERROR OCCURED:", error);
    }
}
