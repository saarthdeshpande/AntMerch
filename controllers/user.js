const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

createUser = async (req, res, next) => {
    try {
        let { firstName, lastName, address, email, type, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            return res.status(409).send({ token: null })
        }
        bcrypt.hash(password, 8, async function (err, password) {
            const user = new User ({ firstName, lastName, address, email, type, password })
            await user.save()
            const token = await jwt.sign(user.toJSON(), process.env.JWT_SECRET,{ algorithm: "HS256", expiresIn: 3600 })
            res.cookie("token", token, { maxAge: 365 * 24 * 60 * 60 * 1000 });
            return res.send({
                token,
                user: user.toJSON()
            })
        })
    } catch (e) {
        console.log(e)
        res.status(406).send({ token: null })
    }
}

userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).send({ token: null })
        }
        bcrypt.compare(password, user.password, async function (error, result) {
            if (error) {
                console.log(error)
                return res.status(406).send()
            };
            if (result === true) {
                const token = await jwt.sign(user.toJSON(), process.env.JWT_SECRET,{ algorithm: "HS256", expiresIn: 365 * 24 * 60 * 60 })
                res.cookie("token", token, { maxAge: 365 * 24 * 60 * 60 });
                return res.send({
                    token,
                    user: user.toJSON()
                })
            } else {
                return res.status(401).send({ token: null })
            }
        })
    } catch (e) {
        console.log(e)
        return res.status(404).send({ token: null })
    }
}

userLogout = (req, res, next) => {
    try {
        console.log(req.cookies)
    } catch (e) {
        console.log(e)
        return res.status().send()
    }
}

module.exports = { createUser, userLogin, userLogout }