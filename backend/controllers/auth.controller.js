const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user.model');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Validation failed');
    error.statusCode = 422;
    throw error;
  }
  
  const { email, name, password } = req.body;

  try {
    const hashedPw = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      name,
      password: hashedPw //encrypted password
    });
    const result = await user.save();
    res.status(201).json({ msg: 'User created!', userId: result._id })
  } catch (error) {
    // console.log(error);
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  
  try {
    const existingUser = await User.findOne({ email: email });
    if(!existingUser){
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, existingUser.password); //'existingUser.password' is comming from database
    if(!isEqual){
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({
      email: existingUser.email,
      userId: existingUser._id.toString()
      }, 
      process.env.JWT_SECRET,  // second parameter is key. name can be anything
      { expiresIn: '1h' }
    );


    res.status(200).json({ token: token, userId: existingUser._id });
  } catch (error) {
    if(!error.statusCode){
      error.statusCode = 500;
    }
    next(error);
  }
}