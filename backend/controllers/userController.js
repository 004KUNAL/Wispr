const GhostIdentity = require('../models/GhostIdentity');
const { Post } = require('../models/Post');
const Notification = require('../models/Notification');

// @GET /api/users/identity/:id
exports.getIdentity = async (req, res, next) => {
  try {
    const identity = await GhostIdentity.findById(req.params.id).populate('communities', 'name slug avatar');
    if (!identity) return res.status(404).json({ success: false, message: 'Identity not found' });
    res.json({ success: true, identity });
  } catch (err) { next(err); }
};

// @PUT /api/users/identity/:id
exports.updateIdentity = async (req, res, next) => {
  try {
    const identity = await GhostIdentity.findOne({ _id: req.params.id, owner: req.user._id });
    if (!identity) return res.status(404).json({ success: false, message: 'Identity not found' });

    const { alias, bio, avatarStyle, avatarColor } = req.body;
    if (alias) identity.alias = alias;
    if (bio !== undefined) identity.bio = bio;
    if (avatarStyle) identity.avatar.style = avatarStyle;
    if (avatarColor) identity.avatar.color = avatarColor;
    if (req.file) identity.avatar.url = req.file.path;

    await identity.save();
    res.json({ success: true, identity });
  } catch (err) { next(err); }
};

// @POST /api/users/follow/:id
exports.followIdentity = async (req, res, next) => {
  try {
    const target = await GhostIdentity.findById(req.params.id);
    const currentIdentity = req.user.activeIdentity;
    if (!target || !currentIdentity) return res.status(404).json({ success: false, message: 'Identity not found' });
    if (target._id.equals(currentIdentity._id)) return res.status(400).json({ success: false, message: 'Cannot follow yourself' });

    const me = await GhostIdentity.findById(currentIdentity._id);
    const isFollowing = me.following.includes(target._id);

    if (isFollowing) {
      me.following.pull(target._id);
      target.followers.pull(me._id);
      me.followingCount = Math.max(0, me.followingCount - 1);
      target.followersCount = Math.max(0, target.followersCount - 1);
    } else {
      me.following.push(target._id);
      target.followers.push(me._id);
      me.followingCount += 1;
      target.followersCount += 1;
      await Notification.create({ recipient: target._id, sender: me._id, type: 'follow', message: `${me.alias} started following you` });
    }

    await Promise.all([me.save(), target.save()]);
    res.json({ success: true, isFollowing: !isFollowing, followersCount: target.followersCount });
  } catch (err) { next(err); }
};

// @GET /api/users/identity/:id/posts
exports.getIdentityPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const posts = await Post.find({ author: req.params.id, isDeleted: false, isPublished: true })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'alias avatar reputationTier')
      .populate('community', 'name slug');
    res.json({ success: true, posts });
  } catch (err) { next(err); }
};

// @GET /api/users/leaderboard
exports.getLeaderboard = async (req, res, next) => {
  try {
    const identities = await GhostIdentity.find({ isActive: true })
      .sort({ reputation: -1 })
      .limit(20)
      .select('alias avatar reputation reputationTier followersCount');
    res.json({ success: true, identities });
  } catch (err) { next(err); }
};

// @PUT /api/users/settings
exports.updateSettings = async (req, res, next) => {
  try {
    const { hideOnlineStatus, disappearingChats, screenshotPrevention, nightMode, notifications } = req.body;
    const user = req.user;
    if (hideOnlineStatus !== undefined) user.settings.hideOnlineStatus = hideOnlineStatus;
    if (disappearingChats !== undefined) user.settings.disappearingChats = disappearingChats;
    if (screenshotPrevention !== undefined) user.settings.screenshotPrevention = screenshotPrevention;
    if (nightMode !== undefined) user.settings.nightMode = nightMode;
    if (notifications !== undefined) user.settings.notifications = notifications;
    await user.save();
    res.json({ success: true, settings: user.settings });
  } catch (err) { next(err); }
};
