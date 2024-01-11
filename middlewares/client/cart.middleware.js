const Cart = require('../../models/cart.model')

module.exports.cartId = async (req, res, next) => {
    const cartId = req.cookies.cartId
    if (!cartId) {
        const cart = new Cart()
        await cart.save()
        const expiredTime = 1000 * 60 * 60 * 24 * 30
        res.cookie('cartId', cart.id, { expires: new Date(Date.now() + expiredTime), httpOnly: true })
    }
    else {
        // find by user id for security
        const cart = await Cart.findOne({
            _id: cartId
        })
        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0)
        res.locals.totalQuantity = totalQuantity
    }

    next()
}
