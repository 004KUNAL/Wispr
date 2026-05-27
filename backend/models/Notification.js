const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity', default: null },
  type: {
    type: String,
    enum: ['follow', 'upvote', 'comment', 'reply', 'mention', 'community_invite', 'system', 'reaction', 'whisper'],
    required: true,
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null },
  message: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
