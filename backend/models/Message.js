const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity', default: null },
  room: { type: String, default: null },
  content: { type: String, maxlength: 2000, default: '' },
  media: { url: String, type: { type: String, enum: ['image', 'video', 'audio'] } },
  isRead: { type: Boolean, default: false },
  isDisappearing: { type: Boolean, default: false },
  expiresAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false },
  isWhisper: { type: Boolean, default: false },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
}, { timestamps: true });

messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  isDisappearing: { type: Boolean, default: false },
  unreadCount: { type: Map, of: Number, default: {} },
}, { timestamps: true });

module.exports = {
  Message: mongoose.model('Message', messageSchema),
  Conversation: mongoose.model('Conversation', conversationSchema),
};
