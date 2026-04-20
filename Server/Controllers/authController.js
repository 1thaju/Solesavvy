const User = require('../models/User');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const mongoose = require('mongoose');

exports.signup = async (req, res) => {
  try {
    // Check MongoDB connection first
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB is not connected. ReadyState:', mongoose.connection.readyState);
      return res.status(500).json({ 
        message: 'Database connection error. Please check if MongoDB is running.',
        error: 'MongoDB connection is not established. Please start MongoDB service.'
      });
    }

    const { username, email, password } = req.body;
    
    console.log('Signup request received:', { username, email, password: password ? '***' : undefined });
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email: trimmedEmail });
    } catch (dbError) {
      console.error('Database error checking existing user:', dbError);
      return res.status(500).json({ 
        message: 'Database connection error. Please check if MongoDB is running.',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    let hashedPass;
    try {
      hashedPass = await argon2.hash(password);
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return res.status(500).json({ 
        message: 'Error processing password. Please try again.',
        error: process.env.NODE_ENV === 'development' ? hashError.message : undefined
      });
    }

    // Create user
    const user = new User({ 
      username: trimmedUsername, 
      email: trimmedEmail, 
      password: hashedPass 
    });

    await user.save();
    
    console.log('User created successfully:', trimmedEmail);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Handle duplicate key error (MongoDB)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    // Handle MongoDB connection errors
    if (error.name === 'MongoServerError' || error.name === 'MongoNetworkError') {
      return res.status(500).json({ 
        message: 'Database connection error. Please check if MongoDB is running.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // Generic error - always include error details in development
    const errorDetails = {
      message: error.message || 'Unknown error',
      name: error.name || 'Error',
      code: error.code || undefined
    };
    
    // Check if it's a MongoDB connection issue
    if (error.message?.includes('MongoServerError') || 
        error.message?.includes('MongoNetworkError') ||
        error.message?.includes('connection') ||
        error.message?.includes('connect ECONNREFUSED') ||
        error.message?.includes('timeout')) {
      return res.status(500).json({ 
        message: 'Database connection error. Please check if MongoDB is running.',
        error: process.env.NODE_ENV === 'development' ? errorDetails.message : undefined
      });
    }
    
    // Generic error
    res.status(500).json({ 
      message: 'Error creating user. Please try again.',
      error: process.env.NODE_ENV === 'development' ? errorDetails.message : undefined,
      details: process.env.NODE_ENV === 'development' ? {
        name: errorDetails.name,
        code: errorDetails.code
      } : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
   
    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
