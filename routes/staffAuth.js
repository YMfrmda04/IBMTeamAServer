const router = require('express').Router();
const {User} = require('../models/staff');
const Joi = require('joi');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) 
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne( { userId: req.body.userId });
        if (!user) 
            return res.status(401).send({ message: 'Invalid Email or Password' });

        const validPassword = await bcrypt.compare(
            req.body.password, user.password
        );

        if(!validPassword)
            return res.status(401).send({ message: 'Invalid Email or Password' });

        const Stafftoken = user.generateAuthToken();
        res.status(200).send({ data: Stafftoken, message: "Logged in successfully" })

    } catch (error) {
        res.status(500).send({ message: error.message })//'Server Error, Please try again...'}) token
    }
})

const validate = (data) => {
    const schema = Joi.object({
        userId: Joi.string().required().label("User Id"),
        password: Joi.string().required().label('Password')
    });

    return schema.validate(data);
}

module.exports = router;