const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/user');


exports.signUp = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error('No image provided.');
            error.statusCode = 422;
            throw error;
        }
        const isUser = await User.findOne({ email: req.body.email });
        if (isUser) {
            const error = new Error('E-Mail address already exists.');
            error.statusCode = 400;
            throw error;
        } 
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            userimage: req.file.path,
            password: hash,
            creationDate: req.body.creationDate
        });
        const result = await user.save();
        return res.status(201).json({ message: 'Signup Successfully.' });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
        const error = new Error('Email Not Exit.');
        error.statusCode = 404;
        throw error;
    }
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
        const token = jwt.sign({ _id: user._id }, config.get('jwtSecret'), { expiresIn: 600000 });
        res.json({ token:  'bearer ' + token, user:{ user: user } });
    } else {
        const error = new Error('Password not match.');
        error.statusCode = 401;
        throw error;
    }
  } catch (err) {
    next(err);
  }
};

exports.all_users = async (req, res, next) => {
    try {
        const users = await User.find().select(' _id userName email userimage creationDate');
        res.status(200).json({ count: users.length, users: users });
    } catch (err) {
        next(err);
    }
};

exports.singleUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'User fetched.', user: user });
    } catch (err) {
      next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);    
        if(!user) {
          const error = new Error('Could not find user.');
          error.statusCode = 404;
          throw error;
        }
        const filePath = path.join(__dirname, '../../', user.userimage);
        fs.unlink(filePath, err => console.log(err));
        const result = await User.findByIdAndRemove(req.params.userId);
        return res.status(200).json({ message: 'User Deleted' });
    } catch (err) {
        next(err);
    }
};

