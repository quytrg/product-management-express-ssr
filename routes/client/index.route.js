const productRouter = require('./product.route.js')
const homeRouter = require('./home.route.js')
const searchRouter = require('./search.route.js')
const cartRouter = require('./cart.route.js')
const checkoutRouter = require('./checkout.route.js')
const userRouter = require('./user.route.js')
const chatRouter = require('./chat.route.js')
const usersRouter = require('./users.route.js')
const chatRoomsRouter = require('./chat-rooms.route.js')


// middlewares
const categoryMiddleware = require('../../middlewares/client/category.middleware.js')
const cartMiddleware = require('../../middlewares/client/cart.middleware.js')
const userMiddleware = require('../../middlewares/client/user.middleware.js')
const settingMiddleware = require('../../middlewares/client/setting.middleware.js')
const authMiddleware = require('../../middlewares/client/auth.middleware.js')

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
    app.use('/chat', authMiddleware.requireAuth, chatRouter)
    app.use('/users', authMiddleware.requireAuth, usersRouter)
    app.use('/chat-rooms', authMiddleware.requireAuth, chatRoomsRouter)
    app.use('/', homeRouter)
}
