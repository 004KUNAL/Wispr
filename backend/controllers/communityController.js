const Community = require('../models/Community');
const GhostIdentity = require('../models/GhostIdentity');
const { Post } = require('../models/Post');
const { v4: uuidv4 } = require('uuid');

// @POST /api/communities
exports.createCommunity = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    const { name, description, category, isPrivate, isInviteOnly, color, rules } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const existing = await Community.findOne({ slug });
    if (existing) return res.status(400).json({ success: false, message: 'Community name taken' });

    const community = await Community.create({
      name, slug, description, category: category || 'general',
      isPrivate: isPrivate || false, isInviteOnly: isInviteOnly || false,
      color: color || '#00f5ff',
      creator: identity._id,
      moderators: [identity._id],
      members: [identity._id],
      membersCount: 1,
      rules: rules || [],
      inviteCode: isInviteOnly ? uuidv4().slice(0, 8).toUpperCase() : null,
    });

    await GhostIdentity.findByIdAndUpdate(identity._id, { $push: { communities: community._id } });
    res.status(201).json({ success: true, community });
  } catch (err) { next(err); }
};

// @GET /api/communities
exports.getCommunities = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    const query = { isBanned: false, isPrivate: false };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    const communities = await Community.find(query)
      .sort({ membersCount: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('creator', 'alias avatar')
      .select('-members -moderators');

    res.json({ success: true, communities });
  } catch (err) { next(err); }
};

// @GET /api/communities/:slug
exports.getCommunity = async (req, res, next) => {
  try {
    const community = await Community.findOne({ slug: req.params.slug })
      .populate('creator', 'alias avatar reputationTier')
      .populate('moderators', 'alias avatar');
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    res.json({ success: true, community });
  } catch (err) { next(err); }
};

// @POST /api/communities/:id/join
exports.joinCommunity = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    const { inviteCode } = req.body;
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    if (community.isInviteOnly && community.inviteCode !== inviteCode)
      return res.status(403).json({ success: false, message: 'Invalid invite code' });

    const isMember = community.members.includes(identity._id);
    if (isMember) {
      community.members.pull(identity._id);
      community.membersCount = Math.max(0, community.membersCount - 1);
      await GhostIdentity.findByIdAndUpdate(identity._id, { $pull: { communities: community._id } });
    } else {
      community.members.push(identity._id);
      community.membersCount += 1;
      await GhostIdentity.findByIdAndUpdate(identity._id, { $push: { communities: community._id } });
    }

    await community.save();
    res.json({ success: true, isMember: !isMember, membersCount: community.membersCount });
  } catch (err) { next(err); }
};

// @GET /api/communities/:id/posts
exports.getCommunityPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const posts = await Post.find({ community: req.params.id, isDeleted: false, isPublished: true })
      .sort({ trendingScore: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('author', 'alias avatar reputationTier');
    res.json({ success: true, posts });
  } catch (err) { next(err); }
};
