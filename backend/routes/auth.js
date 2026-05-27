const express = require('express');
const router = express.Router();
const { register, login, guestLogin, getMe, createIdentity, switchIdentity } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/guest', guestLogin);
router.get('/me', protect, getMe);
router.post('/identity', protect, createIdentity);
router.put('/identity/:id/switch', protect, switchIdentity);

module.exports = router;
