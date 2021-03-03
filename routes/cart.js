const router = require('express').Router()
const isCustomer = require('../middleware/isCustomer')
const { addToCart, getProductCountInCart, getCart, emptyCart } = require('../controllers/cart')

router.patch('/', isCustomer, addToCart)
router.get('/', isCustomer, getCart)
router.delete('/', isCustomer, emptyCart)
router.get('/:productId', isCustomer, getProductCountInCart)

module.exports = router