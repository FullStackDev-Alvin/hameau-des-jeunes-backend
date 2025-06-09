const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '101101101';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1]; // Expect 'Bearer tokenstring'
  if (!token)
    return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded; // attach admin info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
