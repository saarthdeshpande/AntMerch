const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const { PurchasedProductSchema } = require('./order')

const cartSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [PurchasedProductSchema]
})

cartSchema.plugin(uniqueValidator);

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart