const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    firstname:{ type: String, required: true },
    lastname:{ type: String, required: true },
    userId:{ type: String, required: true },
    password:{ type: String, required: true }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATE, {expiresIn: "7d"});
    return token
}

const User = mongoose.model('staff', userSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().required().label("First Name"),
        lastname: Joi.string().required().label("Last Name"),
        userId: Joi.string().required().label("User Id"),
        password: passwordComplexity().required().label("Password")
    })

    return schema.validate(data);
};


module.exports = { User, validate };