const router = require('express').Router()
const isCustomer = require('../middleware/isCustomer')
const isSeller = require('../middleware/isSeller')
const { placeOrder, getCustomerOrders, getSellerOrders } = require('../controllers/order')

router.post('/', isCustomer, placeOrder)
router.get('/customer', isCustomer, getCustomerOrders)
router.get('/seller', isSeller, getSellerOrders)

module.exports = router