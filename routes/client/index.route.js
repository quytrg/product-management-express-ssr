const productRouter = require('./product.route.js')
const homeRouter = require('./home.route.js')
const searchRouter = require('./search.route.js')
const cartRouter = require('./cart.route.js')
const checkoutRouter = require('./checkout.route.js')
const userRouter = require('./user.route.js')

const categoryMiddleware = require('../../middlewares/client/category.middleware.js')
const cartMiddleware = require('../../middlewares/client/cart.middleware.js')
const userMiddleware = require('../../middlewares/client/user.middleware.js')
const settingMiddleware = require('../../middlewares/client/setting.middleware.js')

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use(userMiddleware.userInfo)
    app.use(settingMiddleware.generalSettings)
    app.use('/product', productRouter)
    app.use('/search', searchRouter)
    app.use('/cart', cartRouter)
    app.use('/checkout', checkoutRouter)
    app.use('/user', userRouter)
    app.use('/', homeRouter)
}
