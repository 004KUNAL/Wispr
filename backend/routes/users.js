const express = require('express');
const router = express.Router();
const { getIdentity, updateIdentity, followIdentity, getIdentityPosts, getLeaderboard, updateSettings } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/leaderboard', getLeaderboard);
router.get('/identity/:id', getIdentity);
router.get('/identity/:id/posts', getIdentityPosts);
router.put('/identity/:id', protect, upload.single('avatar'), updateIdentity);
router.post('/follow/:id', protect, followIdentity);
router.put('/settings', protect, updateSettings);

module.exports = router;
