const jwt = require('jsonwebtoken');
const User = require('../models/User');

const onlineUsers = new Map(); // identityId -> socketId

const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate('activeIdentity');
        socket.user = user;
        socket.identityId = user?.activeIdentity?._id?.toString();
      }
      next();
    } catch {
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    if (socket.identityId) {
      onlineUsers.set(socket.identityId, socket.id);
      io.emit('online_users', Array.from(onlineUsers.keys()));
    }

    // Join personal room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
    });

    // Real-time messaging
    socket.on('send_message', (data) => {
      const { roomId, message } = data;
      socket.to(roomId).emit('new_message', message);
    });

    // Typing indicator
    socket.on('typing', ({ roomId, alias }) => {
      socket.to(roomId).emit('user_typing', { alias });
    });

    socket.on('stop_typing', ({ roomId }) => {
      socket.to(roomId).emit('user_stop_typing');
    });

    // Live feed updates
    socket.on('join_feed', () => {
      socket.join('global_feed');
    });

    socket.on('new_post', (post) => {
      io.to('global_feed').emit('feed_post', post);
    });

    // Notifications
    socket.on('send_notification', ({ recipientId, notification }) => {
      const recipientSocket = onlineUsers.get(recipientId);
      if (recipientSocket) {
        io.to(recipientSocket).emit('notification', notification);
      }
    });

    // Voice room presence (UI only)
    socket.on('join_voice_room', ({ roomId, alias }) => {
      socket.join(`voice_${roomId}`);
      socket.to(`voice_${roomId}`).emit('voice_user_joined', { alias, socketId: socket.id });
    });

    socket.on('leave_voice_room', ({ roomId, alias }) => {
      socket.leave(`voice_${roomId}`);
      socket.to(`voice_${roomId}`).emit('voice_user_left', { alias });
    });

    // Heatmap thought
    socket.on('heatmap_thought', (data) => {
      io.emit('new_heatmap_thought', data);
    });

    socket.on('disconnect', () => {
      if (socket.identityId) {
        onlineUsers.delete(socket.identityId);
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
      console.log(`💤 Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initSocket, onlineUsers };
