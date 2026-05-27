const { Post, Comment } = require('../models/Post');
const GhostIdentity = require('../models/GhostIdentity');
const Notification = require('../models/Notification');

// @POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    if (!identity) return res.status(400).json({ success: false, message: 'No active identity' });

    const { title, content, type, mood, tags, community, isDisappearing, expiresIn, isStory, scheduledFor } = req.body;

    const media = [];
    if (req.files?.length) {
      req.files.forEach(f => media.push({ url: f.path, type: f.mimetype.startsWith('video') ? 'video' : 'image', blurred: req.body.blurMedia === 'true' }));
    }

    const postData = {
      author: identity._id,
      title: title || '',
      content: content || '',
      type: type || 'text',
      mood: mood || null,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      community: community || null,
      media,
      isDisappearing: isDisappearing === 'true' || isDisappearing === true,
      isStory: isStory === 'true' || isStory === true,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      isPublished: !scheduledFor,
    };

    if (postData.isDisappearing && expiresIn) {
      postData.expiresAt = new Date(Date.now() + parseInt(expiresIn) * 1000);
    }

    const post = await Post.create(postData);
    await GhostIdentity.findByIdAndUpdate(identity._id, { $inc: { postsCount: 1 } });

    const populated = await post.populate('author', 'alias avatar reputationTier reputation');
    res.status(201).json({ success: true, post: populated });
  } catch (err) { next(err); }
};

// @GET /api/posts
exports.getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, type, mood, community } = req.query;
    const query = { isDeleted: false, isPublished: true };
    if (type) query.type = type;
    if (mood) query.mood = mood;
    if (community) query.community = community;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'alias avatar reputationTier reputation color')
      .populate('community', 'name slug color');

    const total = await Post.countDocuments(query);
    res.json({ success: true, posts, total, pages: Math.ceil(total / limit), page: parseInt(page) });
  } catch (err) { next(err); }
};

// @GET /api/posts/trending
exports.getTrending = async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const posts = await Post.find({ isDeleted: false, isPublished: true })
      .sort({ trendingScore: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate('author', 'alias avatar reputationTier')
      .populate('community', 'name slug');
    res.json({ success: true, posts });
  } catch (err) { next(err); }
};

// @GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'alias avatar reputationTier reputation bio')
      .populate('community', 'name slug color avatar')
      .populate({ path: 'comments', populate: { path: 'author', select: 'alias avatar reputationTier' }, options: { sort: { createdAt: -1 }, limit: 50 } });

    if (!post || post.isDeleted) return res.status(404).json({ success: false, message: 'Post not found' });
    post.views += 1;
    post.trendingScore = post.upvotes.length * 3 + post.commentsCount * 2 + post.views * 0.1;
    await post.save();
    res.json({ success: true, post });
  } catch (err) { next(err); }
};

// @POST /api/posts/:id/vote
exports.votePost = async (req, res, next) => {
  try {
    const { vote } = req.body; // 'up' | 'down' | 'none'
    const identity = req.user.activeIdentity;
    const post = await Post.findById(req.params.id);
    if (!post || post.isDeleted) return res.status(404).json({ success: false, message: 'Post not found' });

    post.upvotes.pull(identity._id);
    post.downvotes.pull(identity._id);
    if (vote === 'up') post.upvotes.push(identity._id);
    if (vote === 'down') post.downvotes.push(identity._id);

    post.trendingScore = post.upvotes.length * 3 + post.commentsCount * 2 + post.views * 0.1;
    await post.save();

    if (vote === 'up') {
      await GhostIdentity.findByIdAndUpdate(post.author, { $inc: { reputation: 2 } });
      if (!post.author.equals(identity._id)) {
        await Notification.create({ recipient: post.author, sender: identity._id, type: 'upvote', post: post._id, message: `${identity.alias} upvoted your post` });
      }
    }

    res.json({ success: true, upvotes: post.upvotes.length, downvotes: post.downvotes.length });
  } catch (err) { next(err); }
};

// @POST /api/posts/:id/react
exports.reactPost = async (req, res, next) => {
  try {
    const { reactionType } = req.body;
    const identity = req.user.activeIdentity;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.reactions = post.reactions.filter(r => !r.identity.equals(identity._id));
    if (reactionType) post.reactions.push({ identity: identity._id, type: reactionType });
    await post.save();
    res.json({ success: true, reactions: post.reactions });
  } catch (err) { next(err); }
};

// @POST /api/posts/:id/comment
exports.addComment = async (req, res, next) => {
  try {
    const { content, parentComment, isWhisper } = req.body;
    const identity = req.user.activeIdentity;
    const post = await Post.findById(req.params.id);
    if (!post || post.isDeleted) return res.status(404).json({ success: false, message: 'Post not found' });

    const comment = await Comment.create({ author: identity._id, content, parentComment: parentComment || null, isWhisper: isWhisper || false });

    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, { $push: { replies: comment._id } });
    } else {
      post.comments.push(comment._id);
      post.commentsCount += 1;
      post.trendingScore = post.upvotes.length * 3 + post.commentsCount * 2 + post.views * 0.1;
      await post.save();
    }

    await GhostIdentity.findByIdAndUpdate(post.author, { $inc: { reputation: 1 } });
    if (!post.author.equals(identity._id)) {
      await Notification.create({ recipient: post.author, sender: identity._id, type: 'comment', post: post._id, message: `${identity.alias} commented on your post` });
    }

    const populated = await comment.populate('author', 'alias avatar reputationTier');
    res.status(201).json({ success: true, comment: populated });
  } catch (err) { next(err); }
};

// @DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    if (!post.author.equals(identity._id) && !req.user.isAdmin)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    post.isDeleted = true;
    await post.save();
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) { next(err); }
};

// @POST /api/posts/:id/blur-reveal
exports.blurReveal = async (req, res, next) => {
  try {
    const { mediaIndex } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post || !post.media[mediaIndex]) return res.status(404).json({ success: false, message: 'Media not found' });
    post.media[mediaIndex].blurred = false;
    await post.save();
    res.json({ success: true, media: post.media[mediaIndex] });
  } catch (err) { next(err); }
};
