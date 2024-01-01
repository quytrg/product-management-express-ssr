const dashboardRouter = require('./dashboard.route.js')
const productRouter = require('./product.route.js')
const productCategoryRouter = require('./product-category.route.js')
const roleRouter = require('./role.route.js')

module.exports = (app) => {
    const PATH_ADMIN = '/' + app.locals.prefixAdmin
    app.use(PATH_ADMIN + '/dashboard', dashboardRouter)
    app.use(PATH_ADMIN + '/product', productRouter)
    app.use(PATH_ADMIN + '/product-category', productCategoryRouter)
    app.use(PATH_ADMIN + '/roles', roleRouter)
}   
