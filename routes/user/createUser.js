const router = require('express').Router();
const { User, validate } = require('../../models/user');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message })

        const username = await User.findOne({ username: req.body.email });
        if (username) return res.status(409).send({ message: "User with given username already exists"})

        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: "User with given email already exists"})

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashedPassword }).save();
        res.status(201).send({ message: "User created sucessfully"})

    } catch (error) {
        res.status(500).send({ message: error.message })//'Server Error, Please try again...'}) 
    }
})