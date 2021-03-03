const router = require('express').Router()
const { addSellerStock, getProducts, getSellerStock, removeStock, editStock } = require('../controllers/product')
const isSeller = require('../middleware/isSeller')

router.get('/customer', getProducts)
router.get('/seller', isSeller, getSellerStock)
router.post('/seller', isSeller, addSellerStock)
router.delete('/:productId', isSeller, removeStock)
router.patch('/:productId', isSeller, editStock)

module.exports = router