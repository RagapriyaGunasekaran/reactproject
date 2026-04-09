const express = require('express');
const router = express.Router();
// Use curly braces to pull the specific functions from the controller
const { register, login } = require('../controllers/authController');

// If 'register' or 'login' is undefined above, this next line crashes the server
router.post('/register', register); 
router.post('/login', login);

module.exports = router;