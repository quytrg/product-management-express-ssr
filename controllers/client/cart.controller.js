const Cart = require('../../models/cart.model')
const Product = require('../../models/product.model')

const productHelper = require('../../helpers/product')

// [GET] /cart
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
        res.render('client/pages/cart/index.pug',{
            titlePage: 'Cart',
            cartDetails
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}

// [POST] /cart/add/:id 
module.exports.addPost = async (req, res) => {
    try {
        const cartId = req.cookies.cartId
        const productId = req.params.id
        const quantity = parseInt(req.body.quantity)
        
        const cart = await Cart.findOne({
            _id: cartId
        })

        const productExists = cart.products.find(
            item => item.product_id === productId
        )

        if (productExists) {
            const newQuantity = productExists.quantity + quantity;

            await Cart.updateOne(
                {
                    _id: cartId,
                    "products.product_id": productId,
                },
                {
                    "products.$.quantity": newQuantity,
                }
            );
        }
        else {
            const productObject = {
                product_id: productId,
                quantity: quantity
            }

            cart.products.push(productObject)
            await cart.save()
        }
        req.flash('successMessage', 'Thêm vào giỏ hàng thành công!')
        res.redirect('back')
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    }
}

// [GET] /cart/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const productId = req.params.id
        const cartId = req.cookies.cartId
        await Cart.findOneAndUpdate(
            { _id: cartId },
            { "$pull": { "products": { "product_id": productId } } },
            { safe: true, multi: false }
        )
        req.flash('successMessage', 'Xoá sản phẩm thành công!')
        res.redirect('back')
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}

// [GET] /cart/update-quantity/:id/:quantity
module.exports.updateQuantity = async (req, res) => {
    try {
        const cartId = req.cookies.cartId
        const productId = req.params.id
        const quantity = parseInt(req.params.quantity)
        
        const cart = await Cart.findOne({
            _id: cartId
        })

        if (quantity > 0) {
            await Cart.updateOne(
                {
                    _id: cartId,
                    "products.product_id": productId,
                },
                {
                    "products.$.quantity": quantity,
                }
            );
        }
    
        req.flash('successMessage', 'Chỉnh sửa số lượng sản phẩm thành công!')
        res.redirect('back')
    }
    catch (err) {
        console.log(err);
        res.redirect('back')    
    }
}
