const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret_nato_bai';

const loggingMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

const authMiddleware = (req, res, next) => {
    console.log('Auth Header:', req.headers['authorization']);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log('Token Verification Error:', err);
        return res.status(401).json({ message: 'Invalid token' });
      }
      console.log('Decoded Token:', decoded);
      req.userId = decoded.id;
      next();
    });
  };

module.exports = { loggingMiddleware, authMiddleware };