const Cart = require('../models/cart')

addToCart = async (req, res, next) => {
    try {
        const { product } = req.body
        let cart = await Cart.findOne({ customerId: req.user })
        if (!cart) {
            cart = new Cart({ customerId: req.user, products: [product] })
            await cart.save()
        } else {
            let storedProduct = cart.products.filter(cartProduct => cartProduct.productId == product.productId)
            if (storedProduct.length !== 0) {
                cart.products.splice(cart.products.indexOf(storedProduct[0]), 1)
            }
            if (product.quantity !== 0) {
                cart.products.push(product)
            }
            await Cart.findOneAndUpdate({ customerId: req.user }, { products: cart.products })
        }
        res.send({ status: 'SUCCESS' })
    } catch(e) {
        console.log(e)
        res.send(e)
    }
}

getProductCountInCart = async (req, res, next) => {
     try {
         const { productId } = req.params
         let quantity = 0;
         let cart = await Cart.findOne({ customerId: req.user })
         if (cart) {
             let storedProduct = cart.products.filter(cartProduct => cartProduct.productId == productId)
             if (storedProduct.length !== 0) {
                 quantity = storedProduct[0].quantity
             }
         }
         return res.send({ quantity })
     } catch (e) {
         console.log(e)
     }
}

getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ customerId: req.user })
            .populate('products.productId')
            .exec(function(err, cart){
                if (err) throw err;
                if (cart === null) {
                    return res.send({ cart: [] })
                }
                return res.send({ cart })
            })
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}

emptyCart = async (req, res, next) => {
    try {
        await Cart.findOneAndDelete({ customerId: req.user })
        res.send({ status: 'SUCCESS' })
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}

module.exports = { addToCart, getProductCountInCart, getCart, emptyCart }