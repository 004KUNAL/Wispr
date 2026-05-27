const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, maxlength: 500, default: '' },
  avatar: { type: String, default: '' },
  banner: { type: String, default: '' },
  color: { type: String, default: '#00f5ff' },
  category: {
    type: String,
    enum: ['confessions', 'thoughts', 'creativity', 'support', 'gaming', 'tech', 'music', 'art', 'dark', 'nsfw', 'general'],
    default: 'general',
  },
  isPrivate: { type: Boolean, default: false },
  isInviteOnly: { type: Boolean, default: false },
  inviteCode: { type: String, default: null },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity', required: true },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  membersCount: { type: Number, default: 0 },
  postsCount: { type: Number, default: 0 },
  rules: [{ title: String, description: String }],
  tags: [String],
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
}, { timestamps: true });

communitySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Community', communitySchema);
