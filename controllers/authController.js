const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '101101101';

// Optional: register admin (use only once or protected in production)
exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin)
      return res.status(400).json({ message: 'Username already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, passwordHash });
    await admin.save();

    res.status(201).json({ message: 'Admin registered' });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
};

// Login admin and issue JWT token
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
      expiresIn: '8h',
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};
