const router = require('express').Router();
const { User, validate } = require('../models/staff');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message })

        const user = await User.findOne({ userId: req.body.userId });
        if (user) return res.status(409).send({ message: "User with given user id already exists"})

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashedPassword }).save();
        res.status(201).send({ message: "User created sucessfully"})

    } catch (error) {
        res.status(500).send({ message: error.message })//'Server Error, Please try again...'})  email
    }
})

// Getting ALL
router.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).json({ users });
    } catch(error){
        res.status(500).json({ message: error.message })
    }
})


// Getting one
router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


//Updating 1
router.put('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Check if the new email already exists in the database
      const { email, password } = req.body;
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          return res.status(409).json({ message: "Email already exists" });
        }
      }
  
      // Hash the new password before updating
      if (password) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);
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

        // Delete all messages where the user is the sender or recipient
        await Message.deleteMany({ $or: [{ sender: user._id }, { recipient: user._id }] });

        // Delete all posts made by the user
        await UploadPost.deleteMany({ creator: user._id });

        //await Follow.deleteMany({ $or: [{ followerID: user._id }, { followingID: user._id }] });

        // Delete the user
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "User, their posts, and messages deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;