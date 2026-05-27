const jwt = require('jsonwebtoken');
const User = require('../models/User');
const GhostIdentity = require('../models/GhostIdentity');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('activeIdentity').select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    if (req.user.isBanned) return res.status(403).json({ success: false, message: 'Account suspended' });

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ success: false, message: 'Admin access required' });
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).populate('activeIdentity').select('-password');
    }
    next();
  } catch {
    next();
  }
};

module.exports = { protect, adminOnly, optionalAuth };
