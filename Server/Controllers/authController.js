const User = require('../models/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPass = await argon2.hash(password)
    const user = new User({ username, email, password: hashedPass });
    await user.save();
    res.json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch =  await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id , username:user.username }, 'your_jwt_secret', { expiresIn: '1h' });
   
    res.json({ token,username:user.username});
    console.log(res)
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
