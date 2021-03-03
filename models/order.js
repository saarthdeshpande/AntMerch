const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const PurchasedProductSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    purchaseDate: {
        type: Date,
        required: true
    },
    customerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: Boolean,
        required: true,
        default: null
    },
    orderAmount: {
      type: Number,
      required: true
    },
    purchasedItems: [PurchasedProductSchema]
})

orderSchema.plugin(uniqueValidator);

const Order = mongoose.model('Order', orderSchema)

module.exports = {PurchasedProductSchema, Order}