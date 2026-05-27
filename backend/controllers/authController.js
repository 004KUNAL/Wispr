const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const GhostIdentity = require('../models/GhostIdentity');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const ghostNames = ['NeonPhantom','CipherX','VoidWalker','GlitchGhost','ShadowByte','NullEntity','DarkPulse','CryptoShade','EchoZero','VectorGhost'];
const ghostColors = ['#00f5ff','#bf00ff','#ff0090','#00ff9f','#ff6b00','#7b2fff','#ff2d55','#39ff14'];

// @POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { email, password, alias } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    let user;
    try {
      user = await User.create({ email, password });

      const ghostAlias = alias || ghostNames[Math.floor(Math.random() * ghostNames.length)] + '#' + Math.floor(Math.random() * 9999);
      const identity = await GhostIdentity.create({
        owner: user._id,
        alias: ghostAlias,
        avatar: { color: ghostColors[Math.floor(Math.random() * ghostColors.length)], style: 'cyber' },
      });

      user.identities.push(identity._id);
      user.activeIdentity = identity._id;
      await user.save();

      const token = generateToken(user._id);
      res.status(201).json({ success: true, token, user: { ...user.toJSON(), activeIdentity: identity } });
    } catch (err) {
      if (user) {
        await User.deleteOne({ _id: user._id });
      }
      next(err);
    }
  } catch (err) { next(err); }
};

// @POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const user = await User.findOne({ email }).populate('activeIdentity').populate('identities');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) { next(err); }
};

// @POST /api/auth/guest
exports.guestLogin = async (req, res, next) => {
  try {
    const guestEmail = `guest_${uuidv4()}@wispr.ghost`;
    const user = await User.create({ email: guestEmail, password: uuidv4(), isGuest: true });

    const alias = 'Ghost#' + Math.floor(Math.random() * 99999);
    const identity = await GhostIdentity.create({
      owner: user._id,
      alias,
      avatar: { color: '#00f5ff', style: 'ghost' },
    });

    user.identities.push(identity._id);
    user.activeIdentity = identity._id;
    user.sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ success: true, token, user: { ...user.toJSON(), activeIdentity: identity }, isGuest: true });
  } catch (err) { next(err); }
};

// @GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('activeIdentity').populate('identities');
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// @POST /api/auth/identity
exports.createIdentity = async (req, res, next) => {
  try {
    const { alias, bio, avatarStyle, avatarColor } = req.body;
    if (!alias) return res.status(400).json({ success: false, message: 'Alias required' });

    const identity = await GhostIdentity.create({
      owner: req.user._id,
      alias,
      bio: bio || '',
      avatar: { style: avatarStyle || 'cyber', color: avatarColor || '#00f5ff' },
    });

    req.user.identities.push(identity._id);
    await req.user.save();
    res.status(201).json({ success: true, identity });
  } catch (err) { next(err); }
};

// @PUT /api/auth/identity/:id/switch
exports.switchIdentity = async (req, res, next) => {
  try {
    const identity = await GhostIdentity.findOne({ _id: req.params.id, owner: req.user._id });
    if (!identity) return res.status(404).json({ success: false, message: 'Identity not found' });

    req.user.activeIdentity = identity._id;
    await req.user.save();
    res.json({ success: true, identity });
  } catch (err) { next(err); }
};
