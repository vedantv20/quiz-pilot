const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { validate, authenticate, registerSchema, loginSchema } = require('../middleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), login);

// GET /api/auth/me (protected)
router.get('/me', authenticate, getMe);

module.exports = router;