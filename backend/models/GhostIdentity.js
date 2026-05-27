const mongoose = require('mongoose');

const ghostIdentitySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alias: { type: String, required: true, trim: true, maxlength: 30 },
  avatar: {
    url: { type: String, default: '' },
    style: { type: String, enum: ['cyber', 'ghost', 'neon', 'shadow', 'void'], default: 'cyber' },
    color: { type: String, default: '#00f5ff' },
  },
  bio: { type: String, maxlength: 200, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  reputationTier: {
    type: String,
    enum: ['phantom', 'shadow', 'cipher', 'ghost', 'specter', 'wraith', 'legend'],
    default: 'phantom',
  },
  postsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
}, { timestamps: true });

ghostIdentitySchema.pre('save', function (next) {
  const rep = this.reputation;
  if (rep < 50) this.reputationTier = 'phantom';
  else if (rep < 200) this.reputationTier = 'shadow';
  else if (rep < 500) this.reputationTier = 'cipher';
  else if (rep < 1000) this.reputationTier = 'ghost';
  else if (rep < 2500) this.reputationTier = 'specter';
  else if (rep < 5000) this.reputationTier = 'wraith';
  else this.reputationTier = 'legend';
  next();
});

module.exports = mongoose.model('GhostIdentity', ghostIdentitySchema);
