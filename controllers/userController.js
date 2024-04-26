const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
require('dotenv').config();

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password , role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});


// Generate JWT
const generateToken = (id) => {
  const secret = process.env.SECRET_KEY; // Replace with your own secret key
  const token = jwt.sign({ id }, secret, { expiresIn: '1h' }); // Adjust expiresIn as per your requirements
  return token;
};


// Get user profile
const getMyProfile = (req,res) => {
  res.json(req.user) ;
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile
};