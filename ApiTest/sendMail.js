const sendMail = async (req,res) => {
    res.send()
}


router.post('/', async (req, res) => {
    try {
      const {error} = validate(req.body);
      if (error) return res.status(400).send({ message: error.details[0].message });
  
      const username = await User.findOne({ username: req.body.email });
      if (username) return res.status(409).send({ message: "User with given email already exists"});
  
      const user = await User.findOne({ email: req.body.email });
      if (user) return res.status(409).send({ message: "User with given email already exists"});
  
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      const newUser = new User({ ...req.body, password: hashedPassword });
      await newUser.save();
  
      // Send email to user
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your_email@gmail.com',
          pass: 'your_password'
        }
      });
  
      const mailOptions = {
        from: 'your_email@gmail.com',
        to: req.body.email,
        subject: 'Welcome to our site!',
        text: `Hi ${req.body.firstname},\n\nThanks for signing up for our site!`
      };
  
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
  
      res.status(201).send({ message: "User created sucessfully"});
  
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });