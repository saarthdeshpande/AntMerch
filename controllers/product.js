const Product = require('../models/product')

addSellerStock = async (req, res, next) => {
    try {
        const { productName, productDescription, productPrice, productQuantity, productCategory, brand, productImage } = req.body;
        const product = new Product({ productName, productDescription, productPrice, productQuantity, productCategory, brand, seller: req.user, productImage })
        await product.save()
        res.send({ status: 'SUCCESS' })
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}

getProducts = async (req, res, next) => {
    try {
        const products = await Product.find({})
        res.send({ products })
    } catch (e) {
        console.log(e)
        res.send(e)
    }
}

getSellerStock = async (req, res, next) => {
    try {
        let products = await Product.find({ seller: req.user })
        res.send({ products })
    } catch(e) {
        console.log(e)
        res.send(e)
    }
}

removeStock = async (req, res, next) => {
    try {
        await Product.findOneAndUpdate({ seller: req.user, _id: req.params.productId }, { productQuantity: 0 })
        res.send({ status: 'SUCCESS' })
    } catch(e) {
        console.log(e)
        res.send(e)
    }
}

editStock = async (req, res, next) => {
     try {
         await Product.findOneAndUpdate({ _id: req.params.productId }, req.body)
         res.send({ status: 'SUCCESS' })
     } catch (e) {
         console.log(e)
         res.send(e)
     }
}

module.exports = { addSellerStock, getProducts, getSellerStock, removeStock, editStock }