const express = require('express');
const router = express.Router();
const { createCommunity, getCommunities, getCommunity, joinCommunity, getCommunityPosts } = require('../controllers/communityController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', getCommunities);
router.get('/:slug', optionalAuth, getCommunity);
router.get('/:id/posts', optionalAuth, getCommunityPosts);
router.post('/', protect, createCommunity);
router.post('/:id/join', protect, joinCommunity);

module.exports = router;
