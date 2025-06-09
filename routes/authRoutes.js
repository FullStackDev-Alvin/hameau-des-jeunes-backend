const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Optional, protect or remove in production
router.post('/login', authController.login);

module.exports = router;
