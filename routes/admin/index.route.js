const dashboardRouter = require('./dashboard.route.js')
const productRouter = require('./product.route.js')
const productCategoryRouter = require('./product-category.route.js')
const roleRouter = require('./role.route.js')
const accountRouter = require('./account.route.js')
const authRouter = require('./auth.route.js')
const myAccountRouter = require('./my-account.route.js')
const settingRouter = require('./setting.route.js')

const authMiddleware = require('../../middlewares/admin/auth.middleware.js')

const authController = require('../../controllers/admin/auth.controller.js')

module.exports = (app) => {
    const PATH_ADMIN = '/' + app.locals.prefixAdmin

    app.get(PATH_ADMIN, authController.login)
    
    app.use(
        PATH_ADMIN + '/dashboard',
        authMiddleware.requireAuth,
        dashboardRouter
    )
    app.use(
        PATH_ADMIN + '/product',
        authMiddleware.requireAuth,
        productRouter
    )
    app.use(
        PATH_ADMIN + '/product-category',
        authMiddleware.requireAuth,
        productCategoryRouter
    )
    app.use(
        PATH_ADMIN + '/roles',
        authMiddleware.requireAuth,
        roleRouter
    )
    app.use(
        PATH_ADMIN + '/accounts',
        authMiddleware.requireAuth,
        accountRouter
    )
    app.use(
        PATH_ADMIN + '/auth',
        authRouter
    )
    app.use(
        PATH_ADMIN + '/my-account',
        authMiddleware.requireAuth,
        myAccountRouter
    )
    app.use(
        PATH_ADMIN + '/settings',
        authMiddleware.requireAuth,
        settingRouter
    )
}   
