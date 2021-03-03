const jwt = require('jsonwebtoken')

const isCustomer = (req, res, next) => {
    try {
        const userObject = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
        if (userObject._id && userObject.type === true) {
            req.user = userObject._id
            return next()
        } else {
            return res.status(401).send({ status: 'FAILURE' })
        }
    } catch (e) {
        console.log(e)
        return res.status(403).send(e)
    }
}

module.exports = isCustomer