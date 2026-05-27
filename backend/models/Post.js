const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  isWhisper: { type: Boolean, default: false },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity', required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'story', 'confession', 'thought'],
    default: 'text',
  },
  title: { type: String, maxlength: 200, default: '' },
  content: { type: String, maxlength: 5000, default: '' },
  media: [{
    url: { type: String },
    type: { type: String, enum: ['image', 'video'] },
    blurred: { type: Boolean, default: false },
    thumbnailUrl: { type: String },
  }],
  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'anxious', 'excited', 'numb', 'confused', 'hopeful', 'dark', 'peaceful'],
    default: null,
  },
  tags: [{ type: String, lowercase: true, trim: true }],
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  reactions: [{
    identity: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' },
    type: { type: String, enum: ['fire', 'ghost', 'broken', 'eye', 'skull', 'heart'] },
  }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  commentsCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isAnonymous: { type: Boolean, default: true },
  isDisappearing: { type: Boolean, default: false },
  expiresAt: { type: Date, default: null },
  isStory: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  trendingScore: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    city: { type: String },
  },
  scheduledFor: { type: Date, default: null },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

postSchema.index({ trendingScore: -1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

module.exports = { Post: mongoose.model('Post', postSchema), Comment };
