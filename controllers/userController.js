const UserModel = require('../models/userModel');

const register = (req, res) => {
  const { username, password, email } = req.body;
  if (UserModel.findByUsername(username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  const newUser = UserModel.create({ username, password, email });
  res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
};

const login = (req, res) => {
  const { username, password } = req.body;
  const user = UserModel.findByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', token: 'mock_token' });
};

const getProfile = (req, res) => {
  const userId = 1; // Mock user ID
  const user = UserModel.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...profile } = user;
  res.json(profile);
};

module.exports = { register, login, getProfile };