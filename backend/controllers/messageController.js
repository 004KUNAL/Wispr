const { Message, Conversation } = require('../models/Message');
const GhostIdentity = require('../models/GhostIdentity');

// @GET /api/messages/conversations
exports.getConversations = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    const conversations = await Conversation.find({ participants: identity._id })
      .sort({ updatedAt: -1 })
      .populate('participants', 'alias avatar reputationTier')
      .populate('lastMessage');
    res.json({ success: true, conversations });
  } catch (err) { next(err); }
};

// @GET /api/messages/:conversationId
exports.getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const messages = await Message.find({ room: req.params.conversationId, isDeleted: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender', 'alias avatar')
      .populate('replyTo');
    res.json({ success: true, messages: messages.reverse() });
  } catch (err) { next(err); }
};

// @POST /api/messages
exports.sendMessage = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    const { receiverId, content, isDisappearing, expiresIn, isWhisper, replyTo } = req.body;

    const receiver = await GhostIdentity.findById(receiverId);
    if (!receiver) return res.status(404).json({ success: false, message: 'Recipient not found' });

    const roomId = [identity._id.toString(), receiverId].sort().join('_');

    const messageData = {
      sender: identity._id, receiver: receiverId, room: roomId,
      content, isWhisper: isWhisper || false, replyTo: replyTo || null,
      isDisappearing: isDisappearing || req.user.settings?.disappearingChats || false,
    };

    if (messageData.isDisappearing && expiresIn) {
      messageData.expiresAt = new Date(Date.now() + parseInt(expiresIn) * 1000);
    }

    const message = await Message.create(messageData);

    await Conversation.findOneAndUpdate(
      { participants: { $all: [identity._id, receiverId] } },
      { participants: [identity._id, receiverId], lastMessage: message._id, $inc: { [`unreadCount.${receiverId}`]: 1 } },
      { upsert: true, new: true }
    );

    const populated = await message.populate('sender', 'alias avatar');
    res.status(201).json({ success: true, message: populated });
  } catch (err) { next(err); }
};

// @DELETE /api/messages/:id
exports.deleteMessage = async (req, res, next) => {
  try {
    const identity = req.user.activeIdentity;
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message not found' });
    if (!message.sender.equals(identity._id)) return res.status(403).json({ success: false, message: 'Not authorized' });
    message.isDeleted = true;
    message.content = 'This message was deleted';
    await message.save();
    res.json({ success: true });
  } catch (err) { next(err); }
};
