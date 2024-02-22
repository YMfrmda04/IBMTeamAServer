const router = require('express').Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message })

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

router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).json({ users });
    } catch(error){
        res.status(500).json({ message: error.message })
    }
})


router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user)
            user = await User.findById(req.params.email);

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if(!user)
            user = await User.findById(req.params.email);

        if (!user) return res.status(404).json({ message: "User not found" });
    
        if (req.body.password) {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        }
    
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "User has been deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;