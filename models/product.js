const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const validateURL = (url) => {
    const re = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*)\s*$/i;
    return re.test(url);
}

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: false
    },
    productPrice: {
        type: Number,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    productCategory: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    productImage: {
        type: String,
        required: false
    }
})

productSchema.plugin(uniqueValidator);

const Product = mongoose.model('Product', productSchema)

module.exports = Product