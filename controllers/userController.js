const Joi = require('joi');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'secret_nato_bai';

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string().email().required()
});

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});

const register = async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const { username, password, email } = req.body;
    if (UserModel.findByUsername(username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }
  
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
  
    const newUser = UserModel.create({ username, password: hashedPassword, email });
    res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
  };  

const login = async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const { username, password } = req.body;
    const user = UserModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  };

const getProfile = (req, res) => {
  const user = UserModel.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...profile } = user;
  res.json(profile);
};

module.exports = { register, login, getProfile };