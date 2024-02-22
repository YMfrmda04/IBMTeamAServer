const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    firstname:{ type: String, required: true },
    lastname:{ type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: String, default: 'user' },
    creationDate: { type: Date, default: Date.now }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATE, {expiresIn: "7d"});
    return token
}

const validate = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().required().label("First Name"),
        lastname: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })

    return schema.validate(data);
};

const User = mongoose.model('user', userSchema);
module.exports = { User, validate };