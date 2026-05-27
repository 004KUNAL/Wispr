const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  isGuest: { type: Boolean, default: false },
  activeIdentity: { type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' },
  identities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GhostIdentity' }],
  trustScore: { type: Number, default: 100, min: 0, max: 1000 },
  isAdmin: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  settings: {
    hideOnlineStatus: { type: Boolean, default: false },
    disappearingChats: { type: Boolean, default: false },
    screenshotPrevention: { type: Boolean, default: false },
    nightMode: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true },
  },
  lastSeen: { type: Date, default: Date.now },
  sessionExpiry: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
