const express = require('express');
const router = express.Router();
const { createPost, getFeed, getTrending, getPost, votePost, reactPost, addComment, deletePost, blurReveal } = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', optionalAuth, getFeed);
router.get('/trending', getTrending);
router.get('/:id', optionalAuth, getPost);
router.post('/', protect, upload.array('media', 5), createPost);
router.post('/:id/vote', protect, votePost);
router.post('/:id/react', protect, reactPost);
router.post('/:id/comment', protect, addComment);
router.post('/:id/blur-reveal', protect, blurReveal);
router.delete('/:id', protect, deletePost);

module.exports = router;
