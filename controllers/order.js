const {Order} = require('../models/order')
const User = require('../models/user')
const Cart = require('../models/cart')
const Product = require('../models/product')
const sendMail = require('../src/sendGrid')

handleMail = async (productCount, orderId, customerId) => {
    let customer = await User.findOne({ _id: customerId })
    await sendMail(customer.email, productCount, orderId, customer.firstName )
}

placeOrder = async (req, res, next) => {
     try {
         let cart = await Cart.findOneAndDelete({ customerId: req.user })
         let productCount = 0, orderAmount = 0;
         for (const product of cart.products) {
             productCount += product.quantity
             let updatedProduct = await Product.findOneAndUpdate({ _id: product.productId }, { $inc: { productQuantity: (-1 * product.quantity) } })
             orderAmount += (product.quantity * updatedProduct.productPrice)
         }
         const order = new Order({ customerId: req.user, purchaseDate: Date.now(), status: true, purchasedItems: cart.products, orderAmount })
         await order.save()
         await handleMail(productCount, order._id, req.user)
         res.send({ status: 'SUCCESS' })
     } catch (e) {
         console.log(e)
         // await new Cart(cart).save()
         res.send(e)
     }
}

getCustomerOrders = async function (req, res, next) {
     try {
         // doubt: populate instead, more efficient
         let failedOrders, successOrders;
         await Order.find({ customerId: req.user })
             .populate('purchasedItems.productId')
             .exec((err, results) => {
                 if (err) console.log(err)
                 failedOrders = results.filter(order => order.status === false)
                 successOrders = results.filter(order => order.status === true)
                 res.send({ failedOrders, successOrders })
             })
     } catch(e) {
         console.log(e)
         res.send(e)
     }
}

getSellerOrders = async (req, res, next) => {
    try {
        // doubt: populate instead, more efficient
        let failedOrders, successOrders;
        await Order.find({})
            .populate('purchasedItems.productId')
            .exec((err, results) => {
                if (err) console.log(err)
                results.forEach(result => {
                    result.purchasedItems = result.purchasedItems.filter(product => product.productId.seller == req.user)
                })
                failedOrders = results.filter(order => order.status === false)
                successOrders = results.filter(order => order.status === true)
                res.send({ failedOrders, successOrders })
            })
    } catch(e) {
        console.log(e)
        res.send(e)
    }
}

module.exports = { placeOrder, getCustomerOrders, getSellerOrders }