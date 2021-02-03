const express= require('express');
const { body } = require('express-validator');

const User = require('../models/user.model');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/signup', 
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if(userDoc){
            return Promise.reject('Email address already exists!');
          }
        })
      }).normalizeEmail(),
    body('password').trim().isLength({ min: 5 }).isEmpty()
  ],
  authController.signup
); // --> /api/auth/signup

router.post('/login', authController.login); // --> /api/auth/login

module.exports = router;