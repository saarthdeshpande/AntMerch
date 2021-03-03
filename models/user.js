const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const validateName = (name) => {
    const re = /^[A-Za-z]+/;
    return re.test(name)
}

const AddressSchema = new mongoose.Schema({
    addressLine: {
        type: String,
        required: true
    },
    city: {
      type: String,
      required: true,
      validate: [validateName, 'Invalid city name!']
    },
    state: {
        type: String,
        required: true,
        validate: [validateName, 'Invalid state name!']
    },
    country: {
        type: String,
        required: true,
        validate: [validateName, 'Invalid country name!']
    },
    pinCode: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'Other'
    }
});


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate: [validateEmail, 'Invalid email address']
    },
    type: {
        type: Boolean,
        default: true
    },
    firstName: {
        type: String,
        required: true,
        validate: [validateName, 'Invalid name']
    },
    lastName: {
        type: String,
        required: true,
        validate: [validateName, 'Invalid name']
    },
    address: {
        type: AddressSchema
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        delete ret.password
        return ret;
    }
};

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema)

module.exports = User


