const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')
const Order = require('../../models/order.model')

const productHelper = require('../../helpers/product')

// [GET] /checkout
module.exports.index = async (req, res) => {
    try {
        // finh by user id for security
        const cartDetails = await Cart.findOne({
            _id: req.cookies.cartId
        })

        let totalCartPrice = 0

        for (item of cartDetails.products) {
            const productInfo = await Product.findOne({ _id: item.product_id })
            const newPrice = productHelper.newPriceOfProduct(productInfo)
            productInfo.newPrice = newPrice
            item.productInfo = productInfo
            item.totalPrice = newPrice * item.quantity

            totalCartPrice += item.totalPrice
        }

        cartDetails.totalCartPrice = totalCartPrice
        res.render('client/pages/checkout/index.pug',{
            titlePage: 'Check Out',
            cartDetails
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}

// [POST] /checkout/order
module.exports.orderPost = async (req, res) => {
    try {
        const userInfo = {
            fullName: req.body.fullName,
            address: req.body.address,
            phone: req.body.phone
        }

        if (userInfo.fullName && userInfo.address && userInfo.phone) {
            const cartId = req.cookies.cartId

            const cart = await Cart.findOne({
                _id: cartId
            })

            const products = []

            for (const product of cart.products) {
                const productObject = {
                    product_id: product.product_id,
                    quantity: product.quantity,
                    price: 0,
                    discountPercentage: 0,
                }

                const productInfo = await Product.findOne({
                    _id: product.product_id
                })

                productObject.price = productInfo.price
                productObject.discountPercentage = productInfo.discountPercentage

                products.push(productObject)

                // update stock for product
                await Product.updateOne(
                    { _id: product.product_id },
                    { $inc: { stock: -product.quantity } }
                )
            }

            const orderObject = {
                cart_id: cartId,
                userInfo: userInfo,
                products: products
            }
            const order = new Order(orderObject)
            await order.save()

            // remove cart 
            await Cart.updateOne({ _id: cartId }, { products: [] })

            res.redirect(`/checkout/success/${order.id}`)
        }
        else {
            res.redirect('back')
        }
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    }
}

// [GET] /chechout/success/:id
module.exports.success = async (req, res) => {
    try {
        const orderId = req.params.id

        const order = await Order.findOne({ _id: orderId })

        let totalPrice = 0

        for (const product of order.products) {
            const productInfo = await Product.findById(product.product_id).select("title thumbnail")

            product.productInfo = productInfo
            product.newPrice = productHelper.newPriceOfProduct(product)
            product.totalPrice = parseFloat(product.newPrice) * product.quantity

            totalPrice += product.totalPrice
        }

        order.totalPrice = totalPrice

        res.render('client/pages/checkout/success.pug',{
            titlePage: 'Order Successfully',
            order
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}
