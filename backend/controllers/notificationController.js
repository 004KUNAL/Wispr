const Notification = require('../models/Notification');

// @GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    const { page = 1, limit = 20 } = req.query;
    const notifications = await Notification.find({ recipient: identity._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender', 'alias avatar')
      .populate('post', 'title content type')
      .populate('community', 'name slug');

    const unreadCount = await Notification.countDocuments({ recipient: identity._id, isRead: false });
    res.json({ success: true, notifications, unreadCount });
  } catch (err) { next(err); }
};

// @PUT /api/notifications/read-all
exports.markAllRead = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    await Notification.updateMany({ recipient: identity._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
};

// @PUT /api/notifications/:id/read
exports.markRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) { next(err); }
};

// @DELETE /api/notifications/:id
exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};
