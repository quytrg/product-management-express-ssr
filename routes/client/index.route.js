const productRouter = require('./product.route.js')
const homeRouter = require('./home.route.js')
const searchRouter = require('./search.route.js')
const cartRouter = require('./cart.route.js')
const checkoutRouter = require('./checkout.route.js')

const categoryMiddleware = require('../../middlewares/client/category.middleware.js')
const cartMiddleware = require('../../middlewares/client/cart.middleware.js')

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use('/product', productRouter)
    app.use('/search', searchRouter)
    app.use('/cart', cartRouter)
    app.use('/checkout', checkoutRouter)
    app.use('/', homeRouter)
}
