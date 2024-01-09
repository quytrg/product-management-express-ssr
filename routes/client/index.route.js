const productRouter = require('./product.route.js')
const homeRouter = require('./home.route.js')
const categoryMiddleware = require('../../middlewares/client/category.middleware.js')

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use('/product', productRouter)
    app.use('/', homeRouter)
}
